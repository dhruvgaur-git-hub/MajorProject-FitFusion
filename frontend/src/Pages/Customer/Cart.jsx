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
        <div className="cart-page">
          <div className="container py-5 text-center">
            <div className="cart-empty">
              <h4 className="fw-bold mb-2">Your cart is empty</h4>
              <p className="text-muted mb-4">Browse the catalog and add something you'll love.</p>
              <button className="btn btn-brand" onClick={() => navigate("/home")}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <div className="container py-4">
          <h3 className="fw-bold mb-4">Shopping Cart</h3>

          <div className="row">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div className="cart-item-card" key={item.variantId}>
                  <div className="row align-items-center g-3">
                    <div className="col-md-2">
                      <img
                        src={item.primaryImage}
                        className="img-fluid rounded"
                        alt={item.productName}
                      />
                    </div>

                    <div className="col-md-4">
                      <h6 className="mb-1">{item.productName}</h6>
                      <p className="mb-1 text-muted small">
                        {Object.entries(item.attributes || {})
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </p>
                      <p className="mb-0 fw-semibold">₹{item.sellingPrice.toFixed(2)}</p>
                    </div>

                    <div className="col-md-3">
                      <div className="cart-qty-control">
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.variantId, -1)}
                        >
                          −
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.variantId, 1)}
                          disabled={item.quantity >= item.availableStock}
                        >
                          +
                        </button>
                      </div>
                      {item.quantity >= item.availableStock && (
                        <small className="text-muted d-block mt-1">
                          Max available stock reached
                        </small>
                      )}
                    </div>

                    <div className="col-md-3 text-md-end">
                      <button
                        className="cart-remove-btn"
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
              <div className="cart-summary-card">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery</span>
                  <span>₹{delivery.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>GST (3%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-brand w-100"
                  onClick={() => navigate("/customer/checkout")}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }
        .cart-empty {
          background: #fff;
          border: 1px solid #eceef1;
          border-radius: 14px;
          padding: 50px 20px;
          max-width: 420px;
          margin: 0 auto;
        }
        .cart-item-card {
          background: #fff;
          border: 1px solid #eceef1;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 14px;
        }
        .cart-qty-control {
          display: inline-flex;
          align-items: center;
        }
        .cart-qty-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ced4da;
          background: #fff;
          font-weight: 600;
          line-height: 1;
        }
        .cart-qty-btn:hover:not(:disabled) {
          border-color: #ff6b35;
          color: #ff6b35;
        }
        .cart-qty-btn:disabled {
          opacity: 0.5;
        }
        .cart-remove-btn {
          border: none;
          background: none;
          color: #dc3545;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .cart-remove-btn:hover {
          text-decoration: underline;
        }
        .cart-summary-card {
          background: #fff;
          border: 1px solid #eceef1;
          border-radius: 14px;
          padding: 22px;
        }
      `}</style>
    </div>
  );
}

export default Cart;