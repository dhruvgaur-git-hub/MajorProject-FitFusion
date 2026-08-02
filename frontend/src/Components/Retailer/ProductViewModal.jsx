import React from 'react';

function ProductViewModal({ product, onClose }) {
    if (!product) return null;

    return (
        <div className="modal-backdrop" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content bg-white p-4 rounded shadow" style={{ width: '500px', maxWidth: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Product Details</h4>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                {/* Rejection Alert Box */}
                {product.status === 'REJECTED' && (
                    <div className="alert alert-danger mb-3 p-3 rounded" style={{ backgroundColor: '#f8d7da', color: '#842029', border: '1px solid #f5c2c7' }}>
                        <strong>Rejected Reason:</strong>
                        <p className="mb-0 mt-1">{product.rejectionReason || 'No specific reason provided by admin.'}</p>
                    </div>
                )}

                <div className="text-center mb-3">
                    {product.primaryImage && (
                        <img 
                            src={product.primaryImage} 
                            alt={product.name} 
                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} 
                        />
                    )}
                </div>

                <div className="mb-2"><strong>Name:</strong> {product.name}</div>
                <div className="mb-2"><strong>Status:</strong> <span className="badge bg-secondary">{product.status}</span></div>
                <div className="mb-2"><strong>SKU / Code:</strong> {product.productCode || product.sku || 'N/A'}</div>
                <div className="mb-2"><strong>Category:</strong> {product.category || 'General'}</div>
                <div className="mb-2"><strong>Description:</strong> {product.description || 'No description provided.'}</div>
                <div className="mb-3"><strong>MRP:</strong> ₹{((product.variants && product.variants[0]?.mrp) || product.price || 0).toLocaleString()}</div>

                <div className="text-end">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default ProductViewModal;