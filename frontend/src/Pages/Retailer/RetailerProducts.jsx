import { useState } from 'react';
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
    // Initialising state from localStorage or mock data
    const [products] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
            return mockProducts;
        }
    });

    const activeCount = products.filter(p => p.stock > 15).length;
    const lowStockCount = products.filter(p => p.stock >= 0 && p.stock <= 15).length;
    const netAmount = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    return (
        <div className="products-page">
            <RetailerNavbar />

            <div className="products-container">

                <div className="page-header">
                    <div>
                        <h1>My Products</h1>
                    </div>
                    <button className="add-btn">+ Add Product</button>
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

                <div className="table-card">
                    <div className="toolbar">
                        <h3>Product Inventory ({products.length} items)</h3>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
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
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', color: '#888', padding: '24px' }}>
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map(product => (
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
                                            <button className="edit-btn">Edit</button>
                                            <button className="delete-btn">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default RetailerProducts;