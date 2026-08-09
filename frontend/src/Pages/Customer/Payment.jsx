import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import axiosClient from "../../api/axiosClient";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = location.state?.orderResponse?.orderId
    ?? location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      setError("No order found. Please place an order first.");
      setLoading(false);
      return;
    }

    const initiatePayment = async () => {
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError("Failed to load payment gateway. Check your internet connection.");
          setLoading(false);
          return;
        }

        const response = await axiosClient.post(
          `/api/payments/razorpay/createOrder/${orderId}`
        );
        const { razorpayOrderId, amountInPaise, currency, razorpayKeyId } = response.data;

        setLoading(false);

        const options = {
          key: razorpayKeyId,
          amount: amountInPaise,
          currency: currency,
          name: "FitFusion",
          description: `Payment for Order #${orderId}`,
          order_id: razorpayOrderId,
          handler: async function (razorpayResponse) {
            try {
              await axiosClient.post("/api/payments/razorpay/verify", {
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
              });
              navigate("/customer/myorders", {
                state: { paymentSuccess: true, orderId: orderId },
              });
            } catch (verifyError) {
              console.error("Payment verification failed:", verifyError);
              setError("Payment succeeded but verification failed. Please contact support.");
            }
          },
          modal: {
            ondismiss: function () {
              setError("Payment was cancelled.");
            },
          },
          theme: {
            color: "#198754",
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } catch (err) {
        console.error("Failed to initiate payment:", err);
        setError(
          err.response?.data?.message || "Failed to initiate payment. Please try again."
        );
        setLoading(false);
      }
    };

    initiatePayment();
  }, [orderId, navigate]);

  return (
    <div>
      <Navbar />
      <div className="container mt-5 text-center">
        <h2 className="mb-4">Payment</h2>

        {loading && <p>Preparing your payment...</p>}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            <div className="mt-3">
              <button
                className="btn btn-outline-danger"
                onClick={() => navigate("/customer/cart")}
              >
                Back to Cart
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <p>Complete your payment in the Razorpay window.</p>
        )}
      </div>
    </div>
  );
}

export default Payment;