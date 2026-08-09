import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import RetailerNavbar from '../../Components/Retailer/RetailerNavbar';
import AddProductModal from '../../Components/Retailer/AddProductModal';
import ProductTable from '../../Components/Retailer/ProductTable';
import ProductViewModal from '../../Components/Retailer/ProductViewModal';
import AddVariantModal from '../../Components/Retailer/AddVariantModal';
import axiosClient from '../../api/axiosClient';
import './RetailerProducts.css';

// Allowed filter statuses for retailer product submissions
const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

function RetailerProducts() {
    // --- 1. URL & ROUTING STATE ---
    // Reads URL search parameters (e.g., ?tab=catalog or ?tab=my-products) to manage active views
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'catalog';

    // --- 2. CORE DATA & LOADING STATES ---
    const [products, setProducts] = useState([]); // Holds the current page's list of products
    const [loading, setLoading] = useState(true); // True only for the initial page load spinner
    const [isFetching, setIsFetching] = useState(false); // Silent background loader to prevent full-screen jarring card reloads

    // --- 3. DASHBOARD STATISTICS STATE ---
    // Holds global backend counts independent of page size for top metrics cards
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

    // --- 4. FILTERING & MODAL UI STATES ---
    const [filterStatus, setFilterStatus] = useState(''); // Status dropdown filter value
    const [searchQuery, setSearchQuery] = useState(''); // Text search query across products
    const [showAddModal, setShowAddModal] = useState(false); // Controls visibility of Add Product modal
    const [selectedProductView, setSelectedProductView] = useState(null); // Holds product object for detailed view modal

    // --- 5. CATEGORY, SUB-CATEGORY & BRAND DROPDOWN SELECTION STATES ---
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState('');

    // --- 6. PAGINATION STATES ---
    const [page, setPage] = useState(0); // Current active page index (0-indexed)
    const [size, setSize] = useState(4); // Number of items per page (set to 4 for testing)
    const [totalPages, setTotalPages] = useState(0); // Total page count returned from backend

    // --- 7. DYNAMIC FORM ATTRIBUTES STATES (FOR ADD PRODUCT) ---
    const [schemaAttributes, setSchemaAttributes] = useState([]); // Dynamic fields based on sub-category
    const [loadingAttributes, setLoadingAttributes] = useState(false);
    const [loadingSubCats, setLoadingSubCats] = useState(false);

    // --- 8. ADD PRODUCT FORM FIELD STATES ---
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brandId: '',
        primaryImage: '',
        mrp: ''
    });
    const [attributeValues, setAttributeValues] = useState({}); // Dynamic attribute key-value pairs
    const [submitting, setSubmitting] = useState(false); // Submission loading state for button spinner

    // --- 9. ADD VARIANT MODAL STATES ---
    const [showAddVariantModal, setShowAddVariantModal] = useState(false);
    const [variantTargetProduct, setVariantTargetProduct] = useState(null); // Product receiving the new variant
    const [variantSchemaAttributes, setVariantSchemaAttributes] = useState([]);
    const [variantLoadingAttributes, setVariantLoadingAttributes] = useState(false);
    const [variantFormData, setVariantFormData] = useState({ mrp: '', primaryImage: '' });
    const [variantAttributeValues, setVariantAttributeValues] = useState({});
    const [variantSubmitting, setVariantSubmitting] = useState(false);

    // --- 10. INITIAL COMPONENT MOUNT EFFECT ---
    // Fetches global dropdown filter options (Categories, Brands) and overall retailer statistics once on load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catRes, brandRes, statsRes] = await Promise.all([
                    axiosClient.get('/api/categories/fetchAllCategories'),
                    axiosClient.get('/api/brands/fetchAllBrands'),
                    axiosClient.get('/api/products/ret-stats')
                ]);
                if (catRes.data) setCategories(catRes.data);
                if (brandRes.data) setBrands(brandRes.data);
                if (statsRes.data) setStats(statsRes.data);
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        fetchInitialData();
    }, []);

    // --- 11. STATS REFRESH FUNCTION ---
    // Independent helper to fetch and update global metrics counts after a product or variant mutation
    const fetchStats = async () => {
        try {
            const response = await axiosClient.get('/api/products/ret-stats');
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch retailer product stats", error);
        }
    };

    // --- 12. MAIN PRODUCT FETCHING LOGIC ---
    // Dynamically fetches either the global catalog or personal submissions based on active URL tab
    const fetchProducts = async () => {
        // If data array is empty, show full loader. Otherwise, use silent background fetching to prevent card reloads.
        if (products.length === 0) {
            setLoading(true);
        } else {
            setIsFetching(true);
        }

        try {
            // Switch endpoint URL based on active view tab
            let endpoint = currentTab === 'my-products' 
                ? "/api/products/my-products" 
                : "/api/products/catalog";

            const params = { page, size };

            // Attach filter criteria parameters strictly when viewing personal submissions
            if (currentTab === 'my-products') {
                if (selectedCategoryId) params.categoryId = selectedCategoryId;
                if (selectedSubCategoryId) params.subCategoryId = selectedSubCategoryId;
                if (selectedBrandId) params.brandId = selectedBrandId;
                if (filterStatus) params.status = filterStatus;
            }

            const response = await axiosClient.get(endpoint, { params });
            
            // Handle both Spring Page wrapper objects (.content) or plain arrays
            setProducts(response.data.content || response.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load products.");
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    // Trigger fetchProducts automatically whenever tab context, filters, page index, or page size changes
    useEffect(() => {
        fetchProducts();
    }, [currentTab, filterStatus, selectedCategoryId, selectedSubCategoryId, selectedBrandId, page, size]);

    // --- 13. FILTER CHANGE HANDLERS ---
    // Handles main category filter selection on the table view and cascades sub-category fetching
    const handleFilterCategoryChange = async (e) => {
        const catId = e.target.value;
        setSelectedCategoryId(catId);
        setSelectedSubCategoryId('');
        setSubCategories([]);
        setPage(0); // Reset page back to 0 on filter adjustment

        if (!catId) return;

        try {
            const response = await axiosClient.get(`/api/categories/fetchSubCatsByCatId/${catId}`);
            if (response.data) {
                setSubCategories(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load sub-categories for filtering.');
        }
    };

    // Generic handler for updating text fields in basic forms
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Opens the 'Add Product Request' modal and clears out previous state values
    const handleOpenAddModal = async () => {
        setShowAddModal(true);
        setSelectedCategoryId('');
        setSelectedSubCategoryId('');
        setSubCategories([]);
        setSchemaAttributes([]);
        setAttributeValues({});
        setFormData({ name: '', description: '', brandId: '', primaryImage: '', mrp: '' });

        try {
            const [catResponse, brandResponse] = await Promise.all([
                axiosClient.get('/api/categories/fetchAllCategories'),
                axiosClient.get('/api/brands/fetchAllBrands')
            ]);

            if (catResponse.data) setCategories(catResponse.data);
            if (brandResponse.data) setBrands(brandResponse.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load categories or brands.');
        }
    };

    // Handles category dropdown change inside the Add Product modal
    const handleCategoryChange = async (e) => {
        const catId = e.target.value;
        setSelectedCategoryId(catId);
        setSelectedSubCategoryId('');
        setSubCategories([]);
        setSchemaAttributes([]);
        setAttributeValues({});

        if (!catId) return;

        setLoadingSubCats(true);
        try {
            const response = await axiosClient.get(`/api/categories/fetchSubCatsByCatId/${catId}`);
            if (response.data) {
                setSubCategories(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load sub-categories.');
        } finally {
            setLoadingSubCats(false);
        }
    };

    // Fetches dynamic attribute fields when a sub-category is chosen in the Add Product modal
    const handleSubCategoryChange = async (e) => {
        const subCatId = e.target.value;
        setSelectedSubCategoryId(subCatId);
        setSchemaAttributes([]);
        setAttributeValues({});

        if (!subCatId) return;

        setLoadingAttributes(true);
        try {
            const response = await axiosClient.get(`/api/attribute/fetchBySubCategory/${subCatId}`);
            if (response.data) {
                const attributesList = Array.isArray(response.data) ? response.data[0]?.attributes : response.data.attributes;
                setSchemaAttributes(attributesList || []);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dynamic product attributes.');
        } finally {
            setLoadingAttributes(false);
        }
    };

    // Updates state when typing into dynamic schema attribute input fields
    const handleAttributeChange = (attrName, value) => {
        setAttributeValues((prev) => ({
            ...prev,
            [attrName]: value,
        }));
    };

    // Opens the Add Variant modal and fetches target product attributes
    const handleOpenAddVariantModal = async (product) => {
        setVariantTargetProduct(product);
        setShowAddVariantModal(true);
        setVariantFormData({ mrp: '', primaryImage: '' });
        setVariantAttributeValues({});
        setVariantSchemaAttributes([]);
        setVariantLoadingAttributes(true);

        try {
            const productDetail = await axiosClient.get(`/api/products/${product.id || product.productId}`);
            const subCategoryId = productDetail.data?.subCategoryId;

            if (subCategoryId) {
                const attrResponse = await axiosClient.get(`/api/attribute/fetchBySubCategory/${subCategoryId}`);
                const attributesList = Array.isArray(attrResponse.data)
                    ? attrResponse.data[0]?.attributes
                    : attrResponse.data?.attributes;
                setVariantSchemaAttributes(attributesList || []);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load attributes for this product.');
        } finally {
            setVariantLoadingAttributes(false);
        }
    };

    // Handles text changes in the variant input form
    const handleVariantInputChange = (e) => {
        const { name, value } = e.target;
        setVariantFormData(prev => ({ ...prev, [name]: value }));
    };

    // Updates state for dynamic attribute values inside the variant modal
    const handleVariantAttributeChange = (attrName, value) => {
        setVariantAttributeValues((prev) => ({ ...prev, [attrName]: value }));
    };

    // --- 14. SUBMISSION HANDLERS ---
    // Validates and submits a new product variant payload to the backend API
    const handleAddVariantSubmit = async (e) => {
        e.preventDefault();

        // Validate required dynamic attributes
        for (let attr of variantSchemaAttributes) {
            if (attr.required && (!variantAttributeValues[attr.name] || variantAttributeValues[attr.name].toString().trim() === '')) {
                toast.error(`Attribute "${attr.name}" is required.`);
                return;
            }
        }

        const payload = {
            mrp: Number(variantFormData.mrp),
            images: [
                {
                    imageUrl: variantFormData.primaryImage,
                    primary: true
                }
            ],
            attributes: variantAttributeValues
        };

        setVariantSubmitting(true);
        try {
            await axiosClient.post(`/api/products/${variantTargetProduct.id || variantTargetProduct.productId}/variant`, payload);
            toast.success('Variant added and is now live in your inventory-eligible list.');

            setShowAddVariantModal(false);
            setVariantTargetProduct(null);
            fetchProducts();
            fetchStats(); // Instantly refresh global metric card counts
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add variant.');
        } finally {
            setVariantSubmitting(false);
        }
    };

    // Validates and submits a brand new product request payload to the backend API
    const handleAddProductSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubCategoryId) {
            toast.error('Please select a sub-category.');
            return;
        }

        // Validate required dynamic attributes for new product request
        for (let attr of schemaAttributes) {
            if (attr.required && (!attributeValues[attr.name] || attributeValues[attr.name].toString().trim() === '')) {
                toast.error(`Attribute "${attr.name}" is required.`);
                return;
            }
        }

        const attributesMap = {};
        Object.keys(attributeValues).forEach((key) => {
            attributesMap[key] = attributeValues[key];
        });

        const payload = {
            categoryId: selectedCategoryId,
            subCategoryId: selectedSubCategoryId,
            brandId: formData.brandId,
            name: formData.name,
            description: formData.description,
            primaryImage: formData.primaryImage,
            variants: [
                {
                    mrp: Number(formData.mrp),
                    images: [
                        {
                            imageUrl: formData.primaryImage,
                            primary: true
                        }
                    ],
                    attributes: attributesMap
                }
            ]
        };

        setSubmitting(true);
        try {
            const response = await axiosClient.post('/api/products/addProduct', payload);

            if (response.data?.status === 'FAILURE') {
                toast.error(response.data.message || 'Failed to request product.');
                return;
            }

            toast.success('Product requested successfully! Pending Admin approval.');

            setShowAddModal(false);
            setFormData({ name: '', description: '', brandId: '', primaryImage: '', mrp: '' });
            setAttributeValues({});
            fetchProducts();
            fetchStats(); // Instantly refresh global metric card counts
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to request product.');
        } finally {
            setSubmitting(false);
        }
    };

    // --- 15. LOCAL SEARCH COMPUTATION ---
    // Filters products currently loaded in state based on search bar query input
    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="products-page">
            {/* Top Navigation Bar Component for Retailer portal */}
            <RetailerNavbar />

            <div className="products-container">
                {/* Header section with page title and button trigger to open Add Product modal */}
                <div className="page-header">
                    <h1>Product Catalog Requests</h1>
                    <button className="add-btn" onClick={handleOpenAddModal}>+ Add Product Request</button>
                </div>

                {/* Dashboard Statistics Row displaying true global backend counts independent of page size */}
                {currentTab === 'my-products' && (
                    <div className="stats-row">
                        <div className="stat-card">
                            <p>Total Products</p>
                            <h2>{stats.total}</h2>
                        </div>
                        <div className="stat-card">
                            <p>Approved</p>
                            <h2>{stats.approved}</h2>
                        </div>
                        <div className="stat-card">
                            <p>Pending Review</p>
                            <h2>{stats.pending}</h2>
                        </div>
                        <div className="stat-card">
                            <p>Rejected</p>
                            <h2>{stats.rejected}</h2>
                        </div>
                    </div>
                )}

                {/* Filter and Status Toolbar (Rendered only when viewing personal submissions tab) */}
                {currentTab === 'my-products' && (
                    <div className="bg-white p-3 mb-4 rounded shadow-sm d-flex flex-wrap align-items-center gap-3">
                        {/* Category Filter Dropdown */}
                        <div>
                            <label className="form-label mb-0 fw-semibold me-2">Category:</label>
                            <select 
                                className="form-select d-inline-block w-auto" 
                                value={selectedCategoryId} 
                                onChange={handleFilterCategoryChange}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sub-Category Filter Dropdown */}
                        <div>
                            <label className="form-label mb-0 fw-semibold me-2">Sub-Category:</label>
                            <select 
                                className="form-select d-inline-block w-auto" 
                                value={selectedSubCategoryId} 
                                onChange={(e) => {
                                    setSelectedSubCategoryId(e.target.value);
                                    setPage(0);
                                }} 
                                disabled={!selectedCategoryId}
                            >
                                <option value="">All Sub-Categories</option>
                                {subCategories.map(sc => (
                                    <option key={sc.id || sc._id} value={sc.id || sc._id}>{sc.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Brand Filter Dropdown */}
                        <div>
                            <label className="form-label mb-0 fw-semibold me-2">Brand:</label>
                            <select 
                                className="form-select d-inline-block w-auto" 
                                value={selectedBrandId} 
                                onChange={(e) => {
                                    setSelectedBrandId(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">All Brands</option>
                                {brands.map(b => (
                                    <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter Dropdown */}
                        <div>
                            <label htmlFor="statusFilter" className="form-label mb-0 fw-semibold me-2">Filter Status:</label>
                            <select
                                id="statusFilter"
                                className="form-select d-inline-block w-auto"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value="">All Statuses</option>
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Main Content Area: Renders a loading spinner on first mount, or the product table with silent background updates */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading products...</div>
                ) : (
                    <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s ease' }}>
                        {/* Product Table Component */}
                        <ProductTable 
                            filteredProducts={filteredProducts}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onViewProduct={(product) => setSelectedProductView(product)}
                            onAddVariant={handleOpenAddVariantModal}
                        />

                        {/* Pagination UI Controls Bar */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <button 
                                    className="btn btn-outline-secondary" 
                                    disabled={page === 0 || isFetching} 
                                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                                >
                                    Previous
                                </button>
                                <span>Page {page + 1} of {totalPages}</span>
                                <button 
                                    className="btn btn-outline-secondary" 
                                    disabled={page >= totalPages - 1 || isFetching} 
                                    onClick={() => setPage(prev => prev + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Dialog: Add New Product Request */}
            <AddProductModal 
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                handleAddProductSubmit={handleAddProductSubmit}
                categories={categories}
                subCategories={subCategories}
                brands={brands}
                selectedCategoryId={selectedCategoryId}
                selectedSubCategoryId={selectedSubCategoryId}
                handleCategoryChange={handleCategoryChange}
                handleSubCategoryChange={handleSubCategoryChange}
                loadingSubCats={loadingSubCats}
                formData={formData}
                handleInputChange={handleInputChange}
                loadingAttributes={loadingAttributes}
                schemaAttributes={schemaAttributes}
                attributeValues={attributeValues}
                handleAttributeChange={handleAttributeChange}
                submitting={submitting}
            />

            {/* Modal Dialog: View Detailed Product Data */}
            <ProductViewModal 
                product={selectedProductView} 
                onClose={() => setSelectedProductView(null)} 
            />

            {/* Modal Dialog: Add Variant to Existing Product */}
            <AddVariantModal
                showModal={showAddVariantModal}
                onClose={() => { setShowAddVariantModal(false); setVariantTargetProduct(null); }}
                product={variantTargetProduct}
                formData={variantFormData}
                handleInputChange={handleVariantInputChange}
                loadingAttributes={variantLoadingAttributes}
                schemaAttributes={variantSchemaAttributes}
                attributeValues={variantAttributeValues}
                handleAttributeChange={handleVariantAttributeChange}
                submitting={variantSubmitting}
                onSubmit={handleAddVariantSubmit}
            />
        </div>
    );
}

export default RetailerProducts;