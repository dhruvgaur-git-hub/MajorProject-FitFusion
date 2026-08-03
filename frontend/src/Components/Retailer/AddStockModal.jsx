import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';

function AddStockModal({ show, onClose, product, onSuccess }) {
    const [approvedProducts, setApprovedProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [selectedVariantId, setSelectedVariantId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [retailerQuotedPrice, setRetailerQuotedPrice] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Load Approved Products if no product is directly passed
    useEffect(() => {
        if (show && !product) {
            fetchApprovedProducts();
        } else if (show && product) {
            setSelectedProductId(product.id || product.productId);
            setSelectedProductDetails(product);
            if (product.variants && product.variants.length > 0) {
                setSelectedVariantId(product.variants[0].variantId);
            }
        }
    }, [show, product]);

    const fetchApprovedProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await axiosClient.get('/api/products/my-products', {
                params: { status: 'APPROVED' }
            });
            setApprovedProducts(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load approved products.');
        } finally {
            setLoadingProducts(false);
        }
    };

    // When retailer selects a product from the dropdown, fetch its variants
    const handleProductSelect = async (e) => {
        const prodId = e.target.value;
        setSelectedProductId(prodId);
        setSelectedVariantId('');
        setSelectedProductDetails(null);

        if (!prodId) return;

        try {
            const response = await axiosClient.get(`/api/products/${prodId}`);
            const fullProd = response.data;
            setSelectedProductDetails(fullProd);

            if (fullProd && fullProd.variants && fullProd.variants.length > 0) {
                setSelectedVariantId(fullProd.variants[0].variantId);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load product details and variants.');
        }
    };

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProductId) {
            toast.error('Please select an approved product.');
            return;
        }

        if (!selectedVariantId) {
            toast.error('Please select a product variant.');
            return;
        }

        const payload = {
            productId: selectedProductId,
            variantId: selectedVariantId,
            quantity: Number(quantity),
            retailerQuotedPrice: Number(retailerQuotedPrice)
        };

        setSubmitting(true);
        try {
            await axiosClient.post('/api/inventory/addinventory', payload);
            toast.success('Inventory added successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding inventory:', error);
            toast.error(error.response?.data?.message || error.response?.data || 'Failed to add inventory.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add Stock</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            
                            {/* Step 1: Select Approved Product */}
                            {!product && (
                                <div className="mb-3">
                                    <label className="form-label">Select Approved Product <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={selectedProductId}
                                        onChange={handleProductSelect}
                                        required
                                    >
                                        <option value="">-- Choose an Approved Product --</option>
                                        {approvedProducts.map((p) => (
                                            <option key={p.id || p.productId} value={p.id || p.productId}>
                                                {p.name} ({p.brandName || 'Brand'})
                                            </option>
                                        ))}
                                    </select>
                                    {loadingProducts && <small className="text-muted">Loading approved products...</small>}
                                </div>
                            )}

                            {/* Step 2: Select Variant */}
                            <div className="mb-3">
                                <label className="form-label">Select Variant <span className="text-danger">*</span></label>
                                <select 
                                    className="form-select"
                                    value={selectedVariantId}
                                    onChange={(e) => setSelectedVariantId(e.target.value)}
                                    disabled={!selectedProductId}
                                    required
                                >
                                    {!selectedProductDetails || !selectedProductDetails.variants || selectedProductDetails.variants.length === 0 ? (
                                        <option value="">No active variants available</option>
                                    ) : (
                                        selectedProductDetails.variants.map((v) => (
                                            <option key={v.variantId} value={v.variantId}>
                                                SKU: {v.sku} (MRP: ₹{v.mrp})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Step 3: Quantity */}
                            <div className="mb-3">
                                <label className="form-label">Stock Quantity <span className="text-danger">*</span></label>
                                <input 
                                    type="number"
                                    className="form-control"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Enter stock quantity"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Step 4: Quoted Price */}
                            <div className="mb-3">
                                <label className="form-label">Retailer Quoted Price (₹) <span className="text-danger">*</span></label>
                                <input 
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    value={retailerQuotedPrice}
                                    onChange={(e) => setRetailerQuotedPrice(e.target.value)}
                                    placeholder="Enter your selling price"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-success" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Inventory'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddStockModal;