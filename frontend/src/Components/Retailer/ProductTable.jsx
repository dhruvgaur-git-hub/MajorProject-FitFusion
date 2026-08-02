import React from 'react';

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

function ProductTable({ filteredProducts, searchQuery, setSearchQuery }) {
    return (
        <div className="table-card">
            <div className="toolbar">
                <h3>Product Inventory ({filteredProducts.length} items)</h3>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', color: '#888', padding: '24px' }}>
                                No products found.
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {product.primaryImage && (
                                            <img 
                                                src={product.primaryImage} 
                                                alt={product.name} 
                                                style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} 
                                            />
                                        )}
                                        <span>{product.name}</span>
                                    </div>
                                </td>
                                <td style={{ color: '#888', fontSize: '13px' }}>{product.sku}</td>
                                <td>{product.category}</td>
                                <td>₹{(product.price || 0).toLocaleString()}</td>
                                <td>{product.stock ?? 0}</td>
                                <td>
                                    <span className={getStatusClass(product.stock ?? 0)}>
                                        {getStatus(product.stock ?? 0)}
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
    );
}

export default ProductTable;