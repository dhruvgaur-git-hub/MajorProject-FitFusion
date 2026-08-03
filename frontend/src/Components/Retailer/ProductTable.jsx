import React from 'react';

function getStatusBadgeClass(status) {
    switch (status) {
        case 'ACCEPTED':
        case 'APPROVED':
            return 'badge badge-active';
        case 'PENDING':
            return 'badge badge-low';
        case 'REJECTED':
            return 'badge badge-out';
        default:
            return 'badge';
    }
}

function ProductTable({ filteredProducts, searchQuery, setSearchQuery, onViewProduct, onAddStock }) {
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
                        <th>SKU / Code</th>
                        <th>Category</th>
                        {/* <th>Price (MRP)</th> */}
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: '#888', padding: '24px' }}>
                                No products found.
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map(product => (
                            <tr key={product.id || product.productId}>
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
                                <td style={{ color: '#888', fontSize: '13px' }}>
                                    {product.status === 'PENDING' ? (
                                        <span style={{ fontStyle: 'italic', color: '#e67e22' }}>Pending Approval</span>
                                    ) : (
                                        product.productCode || product.sku || 'N/A'
                                    )}
                                </td>
                                <td>{product.categoryName || product.category || 'General'}</td>
                                {/* <td>₹{((product.variants && product.variants[0]?.mrp) || product.price || 0).toLocaleString()}</td> */}
                                <td>
                                    <span className={getStatusBadgeClass(product.status)}>
                                        {product.status || 'PENDING'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="edit-btn" 
                                        style={{ marginRight: '6px' }}
                                        onClick={() => onViewProduct(product)}
                                    >
                                        View
                                    </button>

                                    {/* Stock button is shown ONLY for APPROVED products */}
                                    {product.status === 'APPROVED' && (
                                        <button 
                                            className="edit-btn" 
                                            style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none' }}
                                            onClick={() => onAddStock && onAddStock(product)}
                                        >
                                            Stock
                                        </button>
                                    )}
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