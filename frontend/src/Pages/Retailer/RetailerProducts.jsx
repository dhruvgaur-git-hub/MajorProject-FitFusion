import { useState, useEffect } from 'react';
import RetailerNavbar from '../../Components/Retailer/RetailerNavbar';
import './RetailerProducts.css';

const STORAGE_KEY = 'retailer_products';

const mockProducts = [
    { id: 1, name: 'Whey Protein Powder', sku: 'SKU-001', category: 'Supplements', price: 1999, stock: 340 },
    { id: 2, name: 'Resistance Band Set', sku: 'SKU-002', category: 'Equipment', price: 799, stock: 180 },
    { id: 3, name: 'Pre-Workout Blend', sku: 'SKU-003', category: 'Supplements', price: 1499, stock: 12 },
    { id: 4, name: 'Yoga Mat Pro', sku: 'SKU-004', category: 'Accessories', price: 1299, stock: 0 },
    { id: 5, name: 'Creatine Monohydrate', sku: 'SKU-005', category: 'Supplements', price: 999, stock: 95 },
];

function getStatus(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 15) return 'Low Stock';
    return 'Active';
}

function getStatusClass(stock) {
    const status = getStatus(stock);
    if (status === 'Active') return 'badge badge-active';
    if (status === 'Low Stock') return 'badge badge-low';
    return 'badge badge-out';
}

function RetailerProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: '', sku: '', category: '', price: '', stock: '' });

    // Load from localStorage on first render
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setProducts(JSON.parse(stored));
        } else {
            setProducts(mockProducts);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
        }
    }, []);

    function saveProducts(updated) {
        setProducts(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    function handleDelete(id) {
        if (window.confirm('Are you sure you want to delete this product?')) {
            saveProducts(products.filter(p => p.id !== id));
        }
    }

    function handleEditClick(product) {
        setEditId(product.id);
        setForm({
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stock: product.stock,
        });
        setShowModal(true);
    }

    function handleAddClick() {
        setEditId(null);
        setForm({ name: '', sku: '', category: '', price: '', stock: '' });
        setShowModal(true);
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (editId) {
            const updated = products.map(p =>
                p.id === editId
                    ? { ...p, name: form.name, sku: form.sku, category: form.category, price: parseFloat(form.price), stock: parseInt(form.stock) }
                    : p
            );
            saveProducts(updated);
        } else {
            const newProduct = {
                id: Date.now(),
                name: form.name,
                sku: form.sku,
                category: form.category,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
            };
            saveProducts([...products, newProduct]);
        }
        setShowModal(false);
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = products.filter(p => p.stock > 15).length;
    const lowStockCount = products.filter(p => p.stock >= 0 && p.stock <= 15).length;
    const netAmount = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    return (
        <div className="products-page">
            <RetailerNavbar />

            <div className="products-container">

                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1>My Products</h1>
                    </div>
                    <button className="add-btn" onClick={handleAddClick}>+ Add Product</button>
                </div>

                {/* Stats */}
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

                {/* Products Table */}
                <div className="table-card">
                    <div className="toolbar">
                        <h3>Product Inventory ({products.length} items)</h3>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', color: '#888', padding: '24px' }}>
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td style={{ color: '#888', fontSize: '13px' }}>{product.sku}</td>
                                        <td>{product.category}</td>
                                        <td>₹{product.price.toLocaleString()}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <span className={getStatusClass(product.stock)}>
                                                {getStatus(product.stock)}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEditClick(product)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select name="category" value={form.category} onChange={handleChange} required>
                                        <option value="">Select</option>
                                        <option>Supplements</option>
                                        <option>Equipment</option>
                                        <option>Accessories</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>SKU</label>
                                    <input
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                        placeholder="e.g. SKU-001"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock *</label>
                                    <input
                                        name="stock"
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="save-btn">{editId ? 'Save Changes' : 'Add Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RetailerProducts;
