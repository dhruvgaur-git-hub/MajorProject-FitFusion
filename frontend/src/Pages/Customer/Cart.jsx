import React from "react";
import { useNavigate } from "react-router-dom";
import Checkout from "./Checkout";
import image from '../../assets/image.png';
import Navbar from "../../Components/Navbar";

function Cart() {
    const navigate = useNavigate();
  return (
    <div>
        <Navbar />
    <div className="container mt-5">
        
      <h2 className="mb-4">Shopping Cart</h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-3 p-3">
            <div className="row align-items-center">
              <div className="col-md-2">
                <img
                  src={image}
                  className="img-fluid"
                />
              </div>

              <div className="col-md-4">
                <h5>MB Protein Powder 1kg</h5>
                <p>₹2999</p>
              </div>

              <div className="col-md-3">
                <button className="btn btn-secondary">
                    -
                </button>
                <span className="mx-3">
                  1
                </span>
                <button className="btn btn-secondary">
                  +
                </button>
              </div>

              <div className="col-md-3">
                <button className="btn btn-danger">
                  Remove
                </button>
              </div>

            </div>
          </div>

        </div>

        <div className="col-lg-4">
          <div className="card p-4">
            <h4>Order Summary</h4>
            <hr/>
            <p>Subtotal : ₹2999</p>
            <p>Delivery : ₹100</p>
            <p>GST : ₹360</p>
            <hr/>
            <h5>Total : ₹3459</h5>
            <button className="btn btn-success w-100 mt-3" onClick={() => navigate("/customer/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}
export default Cart;