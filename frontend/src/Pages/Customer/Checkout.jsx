import { useState } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
function Checkout() {
    const navigate= useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
        <Navbar />
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        {/* shipping-details */}
        <div className="col-md-8">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Shipping Details</h4>

            <input type="text" name="fullName" placeholder="Full Name" className="form-control mb-3"
              value={formData.fullName} onChange={handleChange} />

            <input type="text" name="phone" placeholder="Phone Number" className="form-control mb-3"
              value={formData.phone} onChange={handleChange} />

            <textarea name="address" placeholder="Address" rows="3" className="form-control mb-3"
              value={formData.address} onChange={handleChange} />

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
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h4>Order Summary</h4>
            <hr />

            <p>MB Protein Powder(1kg) x 1</p>

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹2999</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Delivery</span>
              <span>₹100</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>GST</span>
              <span>₹360</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹3459</span>
            </div>

            <button className="btn btn-success w-100 mt-4" onClick={()=> navigate("/customer/payment")}>
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Checkout;