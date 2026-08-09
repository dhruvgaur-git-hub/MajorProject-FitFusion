import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "DISABLED"];

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");

    // Modal State for handling APPROVED / REJECTED extra inputs
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [targetStatus, setTargetStatus] = useState("");
    const [productCode, setProductCode] = useState("");
    const [reason, setReason] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/api/products", {
                params: filterStatus ? { status: filterStatus } : {},
            });
            setProducts(response.data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filterStatus]);

    // Triggered when dropdown changes
    const handleDropdownChange = (product, newStatus) => {
        if (newStatus === "APPROVED" || newStatus === "REJECTED") {
            setSelectedProduct(product);
            setTargetStatus(newStatus);
            setProductCode(product.productCode || ""); // Pre-fill if exists
            setReason("");
            setShowModal(true);
        } else {
            // For PENDING or DISABLED, execute directly without extra inputs
            executeStatusUpdate(product.id, newStatus, null, null);
        }
    };

    // Execute API Call matching your Controller & Service requirements
    const executeStatusUpdate = async (productId, status, pCode, pReason) => {
        try {
            await axiosClient.patch(
                `/api/products/${productId}/status`,
                { reason: pReason || null },
                { 
                    params: { 
                        status: status,
                        ...(pCode && { productCode: pCode }) 
                    } 
                }
            );
            toast.success(`Product status updated to ${status}`);
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update product status.");
        }
    };
    
    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (targetStatus === "APPROVED" && (!productCode || !productCode.trim())) {
            toast.error("Product code is required for approval!");
            return;
        }
        executeStatusUpdate(selectedProduct.id, targetStatus, productCode, reason);
    };

    const statusBadgeClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "badge bg-success";
            case "PENDING":
                return "badge bg-warning text-dark";
            case "REJECTED":
                return "badge bg-danger";
            case "DISABLED":
                return "badge bg-secondary";
            default:
                return "badge bg-light text-dark";
        }
    };

    return (
        <>
            <h1>Product Management</h1>

            <div className="bg-white p-4 mb-3 rounded d-flex align-items-center gap-3">
                <label htmlFor="statusFilter" className="form-label mb-0">Filter by status</label>
                <select
                    id="statusFilter"
                    className="form-select w-auto"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All</option>
                    {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="bg-white p-5 rounded">Loading products...</div>
            ) : (
                <table className="table table-striped table-bordered table-hover bg-white align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Image</th>
                            <th>Product Info</th>
                            <th>Brand / Category</th>
                            <th>Status</th>
                            <th>Change Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-4">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((prod) => (
                                <tr key={prod.id}>
                                    <td>
                                        {prod.primaryImage ? (
                                            <img 
                                                src={prod.primaryImage} 
                                                alt={prod.name} 
                                                style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                                                className="rounded"
                                            />
                                        ) : (
                                            <div className="bg-light text-muted d-flex align-items-center justify-content-center rounded" style={{ width: "50px", height: "50px", fontSize: "10px" }}>
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="fw-bold">{prod.name}</div>
                                        <small className="text-muted text-truncate d-block" style={{ maxWidth: "200px" }}>
                                            {prod.description}
                                        </small>
                                    </td>
                                    <td>
                                        <div><strong>Brand:</strong> {prod.brandName || "N/A"}</div>
                                        <small className="text-muted">
                                            {prod.categoryName} {prod.subCategoryName ? `> ${prod.subCategoryName}` : ""}
                                        </small>
                                    </td>
                                    <td>
                                        <span className={statusBadgeClass(prod.status)}>
                                            {prod.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm w-auto"
                                            value={prod.status}
                                            onChange={(e) => handleDropdownChange(prod, e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {/* Bootstrap Modal for Additional Input (Product Code / Reason) */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleModalSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {targetStatus === "APPROVED" ? "Approve Product" : "Reject Product"}
                                    </h5>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {targetStatus === "APPROVED" && (
                                        <div className="mb-3">
                                            <label className="form-label">Product Code <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={productCode}
                                                onChange={(e) => setProductCode(e.target.value)}
                                                placeholder="Enter unique product code"
                                                required
                                            />
                                        </div>
                                    )}

                                    {targetStatus === "REJECTED" && (
                                        <div className="mb-3">
                                            <label className="form-label">Rejection Reason</label>
                                            <textarea
                                                className="form-control"
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder="Provide a reason for rejection (optional)"
                                                rows="3"
                                            ></textarea>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-brand">
                                        Confirm {targetStatus}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductManagement;