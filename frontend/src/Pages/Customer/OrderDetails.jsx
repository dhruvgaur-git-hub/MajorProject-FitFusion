import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../Components/Navbar";
import axiosClient from "../../api/axiosClient";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosClient.get(`/api/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);
    try {
      const response = await axiosClient.get(`/api/orders/${id}/invoice`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download invoice:", err);
      // Since responseType is "blob", a JSON error body from the server
      // arrives as a Blob too — decode it to surface the real message
      // instead of a generic one.
      let message = "Failed to generate invoice. Please try again.";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          message = JSON.parse(text)?.message || message;
        } catch {
          // response body wasn't JSON — fall back to the generic message
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      toast.error(message);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5"><p>Loading order details...</p></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-danger">{error || "Order not found."}</div>
          <button className="btn btn-secondary" onClick={() => navigate("/customer/myorders")}>
            &larr; Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate("/customer/myorders")}
        >
          &larr; Back to My Orders
        </button>

        <h2>Order Details</h2>

        <div className="card p-4 mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Order #{order.orderId}</h4>
            <span className="badge bg-primary">{order.status}</span>
          </div>
          <p className="text-muted">Placed on {formatDate(order.createdAt)}</p>

          <button
            className="btn btn-brand btn-sm"
            onClick={handleDownloadInvoice}
            disabled={downloadingInvoice}
          >
            {downloadingInvoice ? "Generating Invoice..." : "Download Invoice"}
          </button>

          <hr />

          <h5>Items</h5>
          {order.orderItems.map((item) => (
            <div key={item.orderItemId} className="d-flex justify-content-between border-bottom py-2">
              <div>
                <p className="mb-0">{item.productName}</p>
                <small className="text-muted">SKU: {item.sku} · Qty: {item.quantity}</small>
              </div>
              <div className="text-end">
                <p className="mb-0">₹{item.sellingPrice.toFixed(2)} each</p>
                <strong>₹{item.subtotal.toFixed(2)}</strong>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-3">
            <strong>Total Amount</strong>
            <strong>₹{order.totalAmount.toFixed(2)}</strong>
          </div>

          <div className="mt-2">
            Payment Status:{" "}
            <span className={order.paymentStatus === "SUCCESS" ? "text-success fw-bold" : "text-warning fw-bold"}>
              {order.paymentStatus}
            </span>
          </div>

          <hr />
          <h5>Shipping Address</h5>
          <p className="mb-0">
            {order.shippingAddress.name}<br />
            {order.shippingAddress.mobile}<br />
            {order.shippingAddress.addressLine1}
            {order.shippingAddress.addressLine2 && <>, {order.shippingAddress.addressLine2}</>}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
            {order.shippingAddress.country} - {order.shippingAddress.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;