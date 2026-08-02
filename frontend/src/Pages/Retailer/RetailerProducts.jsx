import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import RetailerNavbar from '../../Components/Retailer/RetailerNavbar';
import AddProductModal from '../../Components/Retailer/AddProductModal';
import ProductTable from '../../Components/Retailer/ProductTable';
import ProductViewModal from '../../Components/Retailer/ProductViewModal';
import axiosClient from '../../api/axiosClient';
import './RetailerProducts.css';

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

function RetailerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProductView, setSelectedProductView] = useState(null);
    
    // Category, Sub-Category & Brand Selection States
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');

    // Dynamic Attributes States
    const [schemaAttributes, setSchemaAttributes] = useState([]);
    const [loadingAttributes, setLoadingAttributes] = useState(false);
    const [loadingSubCats, setLoadingSubCats] = useState(false);

    // Form Field States
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brandId: '',
        primaryImage: '',
        mrp: ''
    });
    const [attributeValues, setAttributeValues] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/api/products/my-products", {
                params: filterStatus ? { status: filterStatus } : {},
            });
            setProducts(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filterStatus]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Open Modal & Fetch Categories & Brands Concurrently
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

    const handleAttributeChange = (attrName, value) => {
        setAttributeValues((prev) => ({
            ...prev,
            [attrName]: value,
        }));
    };

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubCategoryId) {
            toast.error('Please select a sub-category.');
            return;
        }

        for (let attr of schemaAttributes) {
            if (attr.required && (!attributeValues[attr.name] || attributeValues[attr.name].toString().trim() === '')) {
                toast.error(`Attribute "${attr.name}" is required.`);
                return;
            }
        }

        // Map attribute values to a dictionary object
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
            await axiosClient.post('/api/products/addProduct', payload);
            toast.success('Product added successfully!');
            
            setShowAddModal(false);
            setFormData({ name: '', description: '', brandId: '', primaryImage: '', mrp: '' });
            setAttributeValues({});
            fetchProducts(); // Refresh backend products list
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add product.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewProduct = (product) => {
        setSelectedProductView(product);
    };

    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const approvedCount = products.filter(p => p.status === 'APPROVED').length;
    const pendingCount = products.filter(p => p.status === 'PENDING').length;
    const rejectedCount = products.filter(p => p.status === 'REJECTED').length;

    return (
        <div className="products-page">
            <RetailerNavbar />

            <div className="products-container">
                <div className="page-header">
                    <h1>My Products</h1>
                    <button className="add-btn" onClick={handleOpenAddModal}>+ Add Product</button>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <p>Total Products</p>
                        <h2>{products.length}</h2>
                    </div>
                    <div className="stat-card">
                        <p>Approved</p>
                        <h2>{approvedCount}</h2>
                    </div>
                    <div className="stat-card">
                        <p>Pending Review</p>
                        <h2>{pendingCount}</h2>
                    </div>
                    <div className="stat-card">
                        <p>Rejected</p>
                        <h2>{rejectedCount}</h2>
                    </div>
                </div>

                <div className="bg-white p-3 mb-4 rounded shadow-sm d-flex align-items-center gap-3">
                    <label htmlFor="statusFilter" className="form-label mb-0 fw-semibold">Filter Status:</label>
                    <select
                        id="statusFilter"
                        className="form-select w-auto"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading products...</div>
                ) : (
                    <ProductTable 
                        filteredProducts={filteredProducts}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onViewProduct={handleViewProduct}
                    />
                )}
            </div>

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

            <ProductViewModal 
                product={selectedProductView} 
                onClose={() => setSelectedProductView(null)} 
            />
        </div>
    );
}

export default RetailerProducts;