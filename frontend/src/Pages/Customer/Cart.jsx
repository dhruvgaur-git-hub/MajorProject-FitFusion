import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useCart } from "../../context/CartContext";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getSubtotal } = useCart();

  const subtotal = getSubtotal();
  const delivery = cartItems.length > 0 ? 50 : 0;
  const gst = subtotal * 0.03;
  const total = subtotal + delivery + gst;

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>Your cart is empty</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/home")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Shopping Cart</h2>

        <div className="row">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <div className="card mb-3 p-3" key={item.variantId}>
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={item.primaryImage}
                      className="img-fluid"
                      alt={item.productName}
                    />
                  </div>

                  <div className="col-md-4">
                    <h5>{item.productName}</h5>
                    <p className="mb-1 text-muted">
                      {Object.entries(item.attributes || {})
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")}
                    </p>
                    <p className="mb-0">₹{item.sellingPrice.toFixed(2)}</p>
                  </div>

                  <div className="col-md-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() => updateQuantity(item.variantId, -1)}
                    >
                      -
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      className="btn btn-secondary"
                      onClick={() => updateQuantity(item.variantId, 1)}
                      disabled={item.quantity >= item.availableStock}
                    >
                      +
                    </button>
                    {item.quantity >= item.availableStock && (
                      <small className="text-muted d-block mt-1">
                        Max available stock reached
                      </small>
                    )}
                  </div>

                  <div className="col-md-3">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(item.variantId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card p-4">
              <h4>Order Summary</h4>
              <hr />
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
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-success w-100 mt-3"
                onClick={() => navigate("/customer/checkout")}
              >
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