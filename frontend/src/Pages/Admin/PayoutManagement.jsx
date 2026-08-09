import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["PENDING", "PROCESSED", "FAILED"];

function statusBadgeClass(status) {
    switch (status) {
        case "PROCESSED":
            return "badge bg-success";
        case "PENDING":
            return "badge bg-warning text-dark";
        case "FAILED":
            return "badge bg-danger";
        default:
            return "badge bg-light text-dark";
    }
}

function PayoutManagement() {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/api/payouts");
            setPayouts(response.data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load payouts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, []);

    const handleStatusChange = async (payoutId, newStatus) => {
        try {
            await axiosClient.put(`/api/payouts/${payoutId}/status`, null, {
                params: { status: newStatus },
            });
            toast.success(`Payout status updated to ${newStatus}`);
            fetchPayouts();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update payout status.");
        }
    };

    const visiblePayouts = filterStatus
        ? payouts.filter((p) => p.status === filterStatus)
        : payouts;

    return (
        <>
            <h1>Payouts</h1>

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
                <div className="bg-white p-5 rounded">Loading payouts...</div>
            ) : (
                <table className="table table-striped table-bordered table-hover bg-white">
                    <thead className="table-dark">
                        <tr>
                            <th>Payout ID</th>
                            <th>Retailer ID</th>
                            <th>Amount</th>
                            <th>Commission</th>
                            <th>Net Amount</th>
                            <th>Status</th>
                            <th>Change Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visiblePayouts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-muted py-4">
                                    No payouts found.
                                </td>
                            </tr>
                        ) : (
                            visiblePayouts.map((payout) => (
                                <tr key={payout.payoutId}>
                                    <td>{payout.payoutId}</td>
                                    <td>{payout.retailerId}</td>
                                    <td>₹{payout.amount?.toFixed(2)}</td>
                                    <td>₹{payout.commissionAmount?.toFixed(2)}</td>
                                    <td>₹{payout.netAmount?.toFixed(2)}</td>
                                    <td>
                                        <span className={statusBadgeClass(payout.status)}>
                                            {payout.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm w-auto"
                                            value={payout.status}
                                            onChange={(e) => handleStatusChange(payout.payoutId, e.target.value)}
                                            disabled={payout.status !== "PENDING"}
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

export default PayoutManagement;