import React from 'react';

function AddProductModal({
    showAddModal,
    setShowAddModal,
    handleAddProductSubmit,
    categories,
    subCategories,
    selectedCategoryId,
    selectedSubCategoryId,
    handleCategoryChange,
    handleSubCategoryChange,
    loadingSubCats,
    formData,
    handleInputChange,
    loadingAttributes,
    schemaAttributes,
    attributeValues,
    handleAttributeChange,
    submitting
}) {
    if (!showAddModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h2>Add New Product</h2>
                <form onSubmit={handleAddProductSubmit}>
                    
                    {/* Category & Sub-Category Selection */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                value={selectedCategoryId}
                                onChange={handleCategoryChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Sub-Category *</label>
                            <select
                                value={selectedSubCategoryId}
                                onChange={handleSubCategoryChange}
                                disabled={!selectedCategoryId || loadingSubCats}
                                required
                            >
                                <option value="">{loadingSubCats ? 'Loading...' : 'Select Sub-Category'}</option>
                                {subCategories.map((subCat) => (
                                    <option key={subCat.id || subCat._id} value={subCat.id || subCat._id}>{subCat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Brand ID *</label>
                            <input
                                type="text"
                                name="brandId"
                                value={formData.brandId}
                                onChange={handleInputChange}
                                placeholder="Enter brand ID"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="form-group">
                        <label>Primary Image URL</label>
                        <input
                            type="text"
                            name="primaryImage"
                            value={formData.primaryImage}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
                    <h3 style={{ fontSize: '15px', color: '#2c3e50', marginBottom: '14px' }}>Dynamic Attributes</h3>

                    {loadingAttributes ? (
                        <p style={{ fontSize: '13px', color: '#888' }}>Loading dynamic attributes...</p>
                    ) : !selectedSubCategoryId ? (
                        <p style={{ fontSize: '13px', color: '#888' }}>Select a sub-category above to load specific attributes (e.g., sizes, colors).</p>
                    ) : schemaAttributes.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#888' }}>No dynamic attributes configured for this sub-category.</p>
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
                        <button 
                            type="button" 
                            className="cancel-btn" 
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="save-btn" 
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;