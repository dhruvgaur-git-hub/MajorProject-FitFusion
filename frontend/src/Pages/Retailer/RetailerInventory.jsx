import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import RetailerNavbar from '../../Components/Retailer/RetailerNavbar';
import AddStockModal from '../../Components/Retailer/AddStockModal';
import UpdateStockModal from '../../Components/Retailer/UpdateStockModal';
import axiosClient from '../../api/axiosClient';

function RetailerInventory() {
    const [inventoryList, setInventoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/inventory/retailer');
            setInventoryList(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load inventory.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleEditClick = (item) => {
        setSelectedInventoryItem(item);
        setShowUpdateModal(true);
    };

    const filteredInventory = inventoryList.filter((item) =>
        (item.sku || item.variantId || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
        (item.productName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="inventory-page">
            <RetailerNavbar />

            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2>Inventory & Stock Management</h2>
                        <p className="text-muted">Manage quantities and selling prices for your approved products.</p>
                    </div>
                    <button 
                        className="btn btn-brand"
                        onClick={() => setShowAddModal(true)}
                    >
                        + Add New Stock
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by SKU or Product Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Inventory Table */}
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Variant SKU</th>
                                    <th>Available Stock</th>
                                    {/* <th>Reserved Stock</th> */}
                                    <th>Quoted Price (₹)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            Loading inventory...
                                        </td>
                                    </tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No inventory records found. Click "+ Add New Stock" to list stock for an approved product.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => (
                                        <tr key={item.id || item.inventoryId}>
                                            <td className="fw-semibold">
                                                {item.sku || item.variantId}
                                            </td>
                                            <td>
                                                <span className={`badge ${item.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                    {item.quantity} units
                                                </span>
                                            </td>
                                            {/* <td className="text-muted">{item.reservedQuantity || 0} units</td> */}
                                            <td>₹{Number(item.retailerQuotedPrice || 0).toLocaleString()}</td>
                                            <td>
                                                <span className={`badge ${item.active ? 'bg-primary' : 'bg-secondary'}`}>
                                                    {item.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleEditClick(item)}
                                                >
                                                    Edit Stock / Price
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddStockModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchInventory}
            />

            <UpdateStockModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                inventoryItem={selectedInventoryItem}
                onSuccess={fetchInventory}
            />
        </div>
    );
}

export default RetailerInventory;