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
      <div className="orders-page">
        <div className="container py-4" style={{ maxWidth: "820px" }}>
          <h3 className="fw-bold mb-4">My Orders</h3>

          {loading && <p className="text-muted">Loading your orders...</p>}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && orders.length === 0 && (
            <div className="orders-empty text-center">
              <p className="text-muted mb-3">You haven't placed any orders yet.</p>
              <button className="btn btn-brand" onClick={() => navigate("/home")}>
                Start Shopping
              </button>
            </div>
          )}

          {!loading && !error && orders.map((order) => (
            <div className="order-card" key={order.orderId}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="mb-1">Order #{order.orderId}</h5>
                  <p className="text-muted mb-0 small">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`badge ${statusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div className="d-flex justify-content-between" key={item.orderItemId}>
                    <span>{item.productName}</span>
                    <span className="text-muted">x {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 order-card-footer">
                <span>
                  Payment:{" "}
                  <span className={order.paymentStatus === "SUCCESS" ? "text-success fw-semibold" : "text-warning fw-semibold"}>
                    {order.paymentStatus}
                  </span>
                </span>
                <strong>₹{order.totalAmount.toFixed(2)}</strong>
              </div>

              <button
                className="btn btn-brand w-100 mt-3"
                onClick={() => navigate(`/customer/orderdetails/${order.orderId}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .orders-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }
        .order-card {
          background: #fff;
          border: 1px solid #eceef1;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
          transition: box-shadow 0.15s ease;
        }
        .order-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }
        .order-items {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.92rem;
        }
        .order-card-footer {
          border-top: 1px solid #eceef1;
        }
        .orders-empty {
          background: #fff;
          border: 1px solid #eceef1;
          border-radius: 14px;
          padding: 50px 20px;
        }
      `}</style>
    </div>
  );
}

export default MyOrders;
