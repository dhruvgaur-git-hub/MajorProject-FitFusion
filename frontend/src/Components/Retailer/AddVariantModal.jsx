import React from 'react';

function AddVariantModal({
    showModal,
    onClose,
    product,
    formData,
    handleInputChange,
    handleFileChange,
    loadingAttributes,
    schemaAttributes = [],
    attributeValues,
    handleAttributeChange,
    submitting,
    onSubmit
}) {
    if (!showModal || !product) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h2>Add Variant — {product.name}</h2>
                <p style={{ fontSize: '13px', color: '#888', marginTop: '-8px' }}>
                    This adds a new size/color/etc. variant to an already-approved product. It goes live immediately — no admin approval needed.
                </p>

                <form onSubmit={onSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>MRP (Price) *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="mrp"
                                value={formData.mrp}
                                onChange={handleInputChange}
                                placeholder="Enter MRP"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Variant Image File *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    </div>

                    <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
                    <h3 style={{ fontSize: '15px', color: '#2c3e50', marginBottom: '14px' }}>Variant Attributes</h3>

                    {loadingAttributes ? (
                        <p style={{ fontSize: '13px', color: '#888' }}>Loading attributes...</p>
                    ) : schemaAttributes.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#888' }}>No dynamic attributes configured for this product's sub-category.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {schemaAttributes.map((attr) => (
                                <div className="form-group" key={attr.name}>
                                    <label>
                                        {attr.name} {attr.required && <span style={{ color: 'red' }}>*</span>}
                                    </label>

                                    {attr.type === 'DROPDOWN' && (
                                        <select
                                            value={attributeValues[attr.name] || ''}
                                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                            required={attr.required}
                                        >
                                            <option value="">Select {attr.name}</option>
                                            {attr.allowedValues && attr.allowedValues.map((val) => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    )}

                                    {attr.type === 'NUMBER' && (
                                        <input
                                            type="number"
                                            value={attributeValues[attr.name] || ''}
                                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                            placeholder={`Enter ${attr.name}`}
                                            required={attr.required}
                                        />
                                    )}

                                    {attr.type === 'BOOLEAN' && (
                                        <select
                                            value={attributeValues[attr.name] || ''}
                                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                            required={attr.required}
                                        >
                                            <option value="">Select Option</option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    )}

                                    {attr.type === 'TEXT' && (
                                        <input
                                            type="text"
                                            value={attributeValues[attr.name] || ''}
                                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                            placeholder={`Enter ${attr.name}`}
                                            required={attr.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Add Variant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddVariantModal;