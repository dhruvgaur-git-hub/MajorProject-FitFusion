import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import axiosClient from "../../api/axiosClient";
import { decodeToken } from "../../utils/jwt";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const decoded = decodeToken(token);
      const customerId = decoded?.userId;

      if (!customerId) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get(`/api/orders/customer/${customerId}`);
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusBadgeClass = (status) => {
    switch (status) {
      case "DELIVERED": return "bg-success";
      case "SHIPPED":
      case "PARTIALLY_SHIPPED": return "bg-info text-dark";
      case "CANCELLED": return "bg-danger";
      case "RETURNED": return "bg-warning text-dark";
      case "CONFIRMED": return "bg-primary";
      default: return "bg-secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">My Orders</h2>

        {loading && <p>Loading your orders...</p>}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center mt-5">
            <p>You haven't placed any orders yet.</p>
            <button className="btn btn-primary" onClick={() => navigate("/home")}>
              Start Shopping
            </button>
          </div>
        )}

        {!loading && !error && orders.map((order) => (
          <div className="card p-3 mt-3" key={order.orderId}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5>Order #{order.orderId}</h5>
                <p className="text-muted mb-1">{formatDate(order.createdAt)}</p>
              </div>
              <span className={`badge ${statusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            {order.orderItems.map((item) => (
              <p key={item.orderItemId} className="mb-1">
                {item.productName} x {item.quantity}
              </p>
            ))}

            <div className="d-flex justify-content-between mt-2">
              <span>
                Payment:{" "}
                <span className={order.paymentStatus === "SUCCESS" ? "text-success" : "text-warning"}>
                  {order.paymentStatus}
                </span>
              </span>
              <strong>₹{order.totalAmount.toFixed(2)}</strong>
            </div>

            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate(`/customer/orderdetails/${order.orderId}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;