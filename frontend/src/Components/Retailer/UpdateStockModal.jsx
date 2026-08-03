import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';

function UpdateStockModal({ show, onClose, inventoryItem, onSuccess }) {
    const [quantity, setQuantity] = useState('');
    const [retailerQuotedPrice, setRetailerQuotedPrice] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (inventoryItem) {
            setQuantity(inventoryItem.quantity ?? '');
            setRetailerQuotedPrice(inventoryItem.retailerQuotedPrice ?? '');
        }
    }, [inventoryItem]);

    if (!show || !inventoryItem) return null;

    const handleUpdate = async (e) => {
        e.preventDefault();

        const inventoryId = inventoryItem.id || inventoryItem.inventoryId;
        const payload = {
            quantity: Number(quantity),
            retailerQuotedPrice: Number(retailerQuotedPrice)
        };

        setSubmitting(true);
        try {
            await axiosClient.put(`/api/inventory/${inventoryId}`, payload);
            toast.success('Stock updated successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update stock.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleUpdate}>
                        <div className="modal-header">
                            <h5 className="modal-title">Update Stock & Price</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted mb-3">
                                <strong>SKU :</strong> {inventoryItem.sku || inventoryItem.variantId}
                            </p>

                            <div className="mb-3">
                                <label className="form-label">Available Stock Quantity <span className="text-danger">*</span></label>
                                <input 
                                    type="number" 
                                    className="form-control"
                                    value={quantity} 
                                    onChange={(e) => setQuantity(e.target.value)} 
                                    min="0"
                                    required 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Retailer Quoted Price (₹) <span className="text-danger">*</span></label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control"
                                    value={retailerQuotedPrice} 
                                    onChange={(e) => setRetailerQuotedPrice(e.target.value)} 
                                    min="0"
                                    required 
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateStockModal;