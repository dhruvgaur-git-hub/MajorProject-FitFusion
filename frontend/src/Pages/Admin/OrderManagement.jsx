import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "PARTIALLY_SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
];

function statusBadgeClass(status) {
    switch (status) {
        case "DELIVERED":
            return "badge bg-success";
        case "PENDING":
            return "badge bg-warning text-dark";
        case "CONFIRMED":
        case "PROCESSING":
        case "SHIPPED":
        case "PARTIALLY_SHIPPED":
            return "badge bg-info text-dark";
        case "CANCELLED":
        case "RETURNED":
            return "badge bg-danger";
        default:
            return "badge bg-light text-dark";
    }
}

function paymentBadgeClass(status) {
    switch (status) {
        case "SUCCESS":
            return "badge bg-success";
        case "PENDING":
            return "badge bg-warning text-dark";
        case "FAILED":
            return "badge bg-danger";
        case "REFUNDED":
            return "badge bg-secondary";
        default:
            return "badge bg-light text-dark";
    }
}

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/api/orders");
            setOrders(response.data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosClient.put(`/api/orders/${orderId}/status`, null, {
                params: { status: newStatus },
            });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update order status.");
        }
    };

    const visibleOrders = filterStatus
        ? orders.filter((o) => o.status === filterStatus)
        : orders;

    return (
        <>
            <h1>Order Management</h1>

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
                <div className="bg-white p-5 rounded">Loading orders...</div>
            ) : (
                <table className="table table-striped table-bordered table-hover bg-white">
                    <thead className="table-dark">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer ID</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Placed On</th>
                            <th>Status</th>
                            <th>Change Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleOrders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center text-muted py-4">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            visibleOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.customerId}</td>
                                    <td>
                                        {order.orderItems && order.orderItems.length > 0
                                            ? order.orderItems.map((item) => (
                                                  <div key={item.orderItemId} style={{ fontSize: "13px" }}>
                                                      {item.productName} x {item.quantity}
                                                  </div>
                                              ))
                                            : "-"}
                                    </td>
                                    <td>₹{order.totalAmount?.toFixed(2)}</td>
                                    <td>
                                        <span className={paymentBadgeClass(order.paymentStatus)}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                                    <td>
                                        <span className={statusBadgeClass(order.status)}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm w-auto"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
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

export default OrderManagement;
