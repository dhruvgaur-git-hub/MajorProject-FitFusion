import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "BLOCKED", "CLOSED"];

function RetailerManagement() {
    const [retailers, setRetailers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");

    const fetchRetailers = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/api/admin/retailers", {
                params: filterStatus ? { status: filterStatus } : {},
            });
            setRetailers(response.data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load retailers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRetailers();
    }, [filterStatus]);

    const handleStatusChange = async (retailerId, newStatus) => {
        try {
            await axiosClient.patch(
                `/api/admin/retailers/${retailerId}/status`,
                null,
                { params: { status: newStatus } }
            );
            toast.success(`Retailer status updated to ${newStatus}`);
            fetchRetailers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update status.");
        }
    };

    const statusBadgeClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "badge bg-success";
            case "PENDING":
                return "badge bg-warning text-dark";
            case "REJECTED":
                return "badge bg-danger";
            case "BLOCKED":
                return "badge bg-dark";
            case "CLOSED":
                return "badge bg-secondary";
            default:
                return "badge bg-light text-dark";
        }
    };

    return (
        <>
            <h1>Retailer Management</h1>

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
                <div className="bg-white p-5 rounded">Loading retailers...</div>
            ) : (
                <table className="table table-striped table-bordered table-hover bg-white">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Store</th>
                            <th>GSTIN</th>
                            <th>Status</th>
                            <th>Change Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {retailers.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center text-muted py-4">
                                    No retailers found.
                                </td>
                            </tr>
                        ) : (
                            retailers.map((retailer) => (
                                <tr key={retailer.retailerId}>
                                    <td>{retailer.retailerId}</td>
                                    <td>{retailer.name}</td>
                                    <td>{retailer.email}</td>
                                    <td>{retailer.mobile}</td>
                                    <td>{retailer.storeName}</td>
                                    <td>{retailer.gstinNo}</td>
                                    <td>
                                        <span className={statusBadgeClass(retailer.status)}>
                                            {retailer.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm w-auto"
                                            value={retailer.status}
                                            onChange={(e) => handleStatusChange(retailer.retailerId, e.target.value)}
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
        </>
    );
}

export default RetailerManagement;
