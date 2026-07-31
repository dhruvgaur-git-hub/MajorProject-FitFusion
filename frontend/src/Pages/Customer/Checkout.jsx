import { useState } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axiosClient from "../../api/axiosClient";
import { decodeToken } from "../../utils/jwt";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    addresstype: "HOME",
  });

  const subtotal = getSubtotal();
  const delivery = cartItems.length > 0 ? 50 : 0;
  const gst = subtotal * 0.03;
  const total = subtotal + delivery + gst;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const token = localStorage.getItem("token");
    const decoded = decodeToken(token);
    const customerId = decoded?.userId;

    if (!customerId) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const orderRequest = {
      customerId: customerId,
      shippingAddress: {
        name: formData.fullName,
        mobile: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        addresstype: formData.addresstype,
      },
      items: cartItems.map((item) => ({
        productId: item.productId,
        categoryId: item.categoryId,
        variantId: item.variantId,
        sku: item.sku,
        productName: item.productName,
        retailerId: item.retailerId,
        quantity: item.quantity,
        mrp: item.mrp,
      })),
    };

    setSubmitting(true);
    try {
      const response = await axiosClient.post("/api/orders", orderRequest);
      clearCart();
      navigate("/customer/payment", { state: { orderResponse: response.data } });
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(
        error.response?.data?.message ||
        "Failed to place order. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Checkout</h2>

        <div className="row">
          <div className="col-md-8">
            <div className="card p-4 shadow-sm">
              <h4 className="mb-3">Shipping Details</h4>

              <input type="text" name="fullName" placeholder="Full Name" className="form-control mb-3"
                value={formData.fullName} onChange={handleChange} />

              <input type="text" name="phone" placeholder="Phone Number" className="form-control mb-3"
                value={formData.phone} onChange={handleChange} />

              <textarea name="addressLine1" placeholder="Address Line 1" rows="2" className="form-control mb-3"
                value={formData.addressLine1} onChange={handleChange} />

              <textarea name="addressLine2" placeholder="Address Line 2 (optional)" rows="2" className="form-control mb-3"
                value={formData.addressLine2} onChange={handleChange} />

              <div className="row">
                <div className="col-md-4">
                  <input type="text" name="city" placeholder="City" className="form-control mb-3"
                    value={formData.city} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <input type="text" name="state" placeholder="State" className="form-control mb-3"
                    value={formData.state} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <input type="text" name="pincode" placeholder="Pincode" className="form-control mb-3"
                    value={formData.pincode} onChange={handleChange} />
                </div>
              </div>

              <select name="addresstype" className="form-control mb-3"
                value={formData.addresstype} onChange={handleChange}>
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 shadow-sm">
              <h4>Order Summary</h4>
              <hr />

              {cartItems.map((item) => (
                <p key={item.variantId}>
                  {item.productName} x {item.quantity}
                </p>
              ))}

              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Delivery</span>
                <span>₹{delivery.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>GST (3%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total (estimated)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <small className="text-muted d-block mb-3">
                Final price confirmed by server at checkout
              </small>

              <button
                className="btn btn-success w-100"
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;