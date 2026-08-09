import { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axiosClient from "../../api/axiosClient";
import { decodeToken } from "../../utils/jwt";

const ADDRESS_TYPE_LABELS = { HOME: "Home", WORK: "Work", OTHER: "Other" };

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // number | "new"
  const [settingDefaultId, setSettingDefaultId] = useState(null);

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
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosClient.get("/api/addresses");
        const list = response.data || [];
        setAddresses(list);

        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr.addressId);
        } else {
          setSelectedAddressId("new");
        }
      } catch (error) {
        console.error("Failed to load saved addresses:", error);
        setSelectedAddressId("new");
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const subtotal = getSubtotal();
  const delivery = cartItems.length > 0 ? 50 : 0;
  const gst = subtotal * 0.03;
  // Delivery and GST are shown struck-through — the payment gateway only
  // ever charges the subtotal, so that's what the actual total reflects.
  const total = subtotal;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSetDefault = async (addressId) => {
    setSettingDefaultId(addressId);
    try {
      await axiosClient.put(`/api/addresses/${addressId}/default`);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.addressId === addressId }))
      );
    } catch (error) {
      console.error("Failed to set default address:", error);
      alert("Couldn't set that as your default address. Please try again.");
    } finally {
      setSettingDefaultId(null);
    }
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

    setSubmitting(true);
    try {
      let shippingAddress;

      if (selectedAddressId === "new") {
        if (
          !formData.fullName || !formData.phone || !formData.addressLine1 ||
          !formData.city || !formData.state || !formData.pincode
        ) {
          alert("Please fill in all required address fields.");
          setSubmitting(false);
          return;
        }

        // Save it to the customer's address book, then use it for this order.
        const saveResponse = await axiosClient.post("/api/addresses", {
          name: formData.fullName,
          mobile: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          addressType: formData.addresstype,
          isDefault: saveAsDefault,
        });

        const saved = saveResponse?.data;
        shippingAddress = {
          name: formData.fullName,
          mobile: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          addresstype: formData.addresstype,
        };

        if (saved?.addressId) {
          setAddresses((prev) => [...prev, saved]);
        }
      } else {
        const addr = addresses.find((a) => a.addressId === selectedAddressId);
        if (!addr) {
          alert("Please select a shipping address.");
          setSubmitting(false);
          return;
        }

        shippingAddress = {
          name: addr.name,
          mobile: addr.mobile,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2,
          city: addr.city,
          state: addr.state,
          country: addr.country,
          pincode: addr.pincode,
          addresstype: addr.addressType,
        };
      }

      const orderRequest = {
        customerId: customerId,
        shippingAddress,
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

      const response = await axiosClient.post("/api/orders/createNewOrder", orderRequest);
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

  const showNewForm = selectedAddressId === "new";

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Checkout</h2>

        <div className="row">
          <div className="col-md-8">
            <div className="card p-4 shadow-sm">
              <h4 className="mb-3">Shipping Details</h4>

              {loadingAddresses ? (
                <p className="text-muted">Loading your saved addresses...</p>
              ) : (
                <>
                  {addresses.length > 0 && (
                    <div className="mb-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.addressId}
                          className={`address-card ${selectedAddressId === addr.addressId ? "address-card-selected" : ""}`}
                          onClick={() => setSelectedAddressId(addr.addressId)}
                        >
                          <div className="d-flex align-items-start gap-2">
                            <input
                              type="radio"
                              className="mt-1"
                              checked={selectedAddressId === addr.addressId}
                              onChange={() => setSelectedAddressId(addr.addressId)}
                            />
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <strong>{addr.name}</strong>
                                <span className="address-type-badge">
                                  {ADDRESS_TYPE_LABELS[addr.addressType] || addr.addressType}
                                </span>
                                {addr.isDefault && (
                                  <span className="address-default-badge">Default</span>
                                )}
                              </div>
                              <div className="text-muted small">
                                {addr.addressLine1}
                                {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city},{" "}
                                {addr.state} - {addr.pincode}
                              </div>
                              <div className="text-muted small">Phone: {addr.mobile}</div>

                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  className="address-set-default-btn"
                                  disabled={settingDefaultId === addr.addressId}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetDefault(addr.addressId);
                                  }}
                                >
                                  {settingDefaultId === addr.addressId ? "Setting..." : "Set as Default"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {!showNewForm && (
                        <button
                          type="button"
                          className="address-add-new-link"
                          onClick={() => setSelectedAddressId("new")}
                        >
                          + Add a new address
                        </button>
                      )}
                    </div>
                  )}

                  {showNewForm && (
                    <div className={addresses.length > 0 ? "address-new-form" : ""}>
                      {addresses.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">New Address</h6>
                          <button
                            type="button"
                            className="btn btn-sm btn-link"
                            onClick={() => setSelectedAddressId(addresses.find((a) => a.isDefault)?.addressId || addresses[0].addressId)}
                          >
                            Use a saved address instead
                          </button>
                        </div>
                      )}

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

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="saveAsDefault"
                          checked={saveAsDefault}
                          onChange={(e) => setSaveAsDefault(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="saveAsDefault">
                          Set as my default address
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}
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
                <span className="checkout-waived">₹{delivery.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>GST (3%)</span>
                <span className="checkout-waived">₹{gst.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <small className="text-muted d-block mb-3">
                Delivery and GST are on us — you only pay the subtotal.
              </small>

              <button
                className="btn btn-brand w-100"
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-waived {
          text-decoration: line-through;
          color: #adb5bd;
        }
        .address-card {
          border: 1px solid #e2e5e9;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .address-card:hover {
          border-color: #ff6b35;
        }
        .address-card-selected {
          border-color: #ff6b35;
          background: #fff8f5;
        }
        .address-type-badge {
          background: #f1f3f5;
          color: #495057;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .address-default-badge {
          background: #ffede5;
          color: #ff6b35;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .address-set-default-btn {
          border: none;
          background: none;
          color: #ff6b35;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 4px 0;
          margin-top: 4px;
        }
        .address-set-default-btn:hover {
          text-decoration: underline;
        }
        .address-add-new-link {
          border: 1px dashed #ced4da;
          background: none;
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          color: #ff6b35;
          font-weight: 500;
        }
        .address-add-new-link:hover {
          background: #fff8f5;
        }
        .address-new-form {
          border: 1px solid #e2e5e9;
          border-radius: 10px;
          padding: 14px;
        }
      `}</style>
    </div>
  );
}

export default Checkout;
