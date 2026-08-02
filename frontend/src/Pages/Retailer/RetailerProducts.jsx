import { useState } from 'react';
import { toast } from 'react-toastify';
import RetailerNavbar from '../../Components/Retailer/RetailerNavbar';
import AddProductModal from '../../Components/Retailer/AddProductModal';
import ProductTable from '../../Components/Retailer/ProductTable';
import axiosClient from '../../api/axiosClient';
import './RetailerProducts.css';

const STORAGE_KEY = 'retailer_products';

const mockProducts = [
    { id: 1, name: 'Whey Protein Powder', sku: 'SKU-001', category: 'Supplements', price: 1999, stock: 340 },
    { id: 2, name: 'Resistance Band Set', sku: 'SKU-002', category: 'Equipment', price: 799, stock: 180 },
    { id: 3, name: 'Pre-Workout Blend', sku: 'SKU-003', category: 'Supplements', price: 1499, stock: 12 },
    { id: 4, name: 'Yoga Mat Pro', sku: 'SKU-004', category: 'Accessories', price: 1299, stock: 0 },
    { id: 5, name: 'Creatine Monohydrate', sku: 'SKU-005', category: 'Supplements', price: 999, stock: 95 },
];

function RetailerProducts() {
    const [products, setProducts] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
            return mockProducts;
        }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    
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
            
            const newProductEntry = {
                id: Date.now(),
                name: formData.name,
                sku: 'SKU-' + Math.floor(100 + Math.random() * 900),
                category: 'General',
                price: Number(formData.mrp),
                stock: 50,
                primaryImage: formData.primaryImage,
            };
            const updatedProducts = [newProductEntry, ...products];
            setProducts(updatedProducts);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

            setShowAddModal(false);
            setFormData({ name: '', description: '', brandId: '', primaryImage: '', mrp: '' });
            setAttributeValues({});
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add product.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = products.filter(p => p.stock > 15).length;
    const lowStockCount = products.filter(p => p.stock >= 0 && p.stock <= 15).length;
    const netAmount = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);

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
                        <p>Active Listings</p>
                        <h2>{activeCount}</h2>
                    </div>
                    <div className="stat-card">
                        <p>Low Stock Items</p>
                        <h2>{lowStockCount}</h2>
                    </div>
                    <div className="stat-card">
                        <p>Net Amount</p>
                        <h2>₹{netAmount.toLocaleString()}</h2>
                    </div>
                </div>

                <ProductTable 
                    filteredProducts={filteredProducts}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
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
        </div>
    );
}

export default RetailerProducts;