import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";

function MyOrders() {
  const navigate = useNavigate();

  const orders = [
    {
      id: 1,
      product: "Protein Powder",
      date: "10 June 2026",
      amount: 2999,
      status: "Delivered",
    },
    {
      id: 2,
      product: "Whey Isolate",
      date: "5 June 2026",
      amount: 2499,
      status: "Shipped",
    },
  ];

  return (
    <div>
        <Navbar />
    
    <div className="container mt-5">
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div className="card p-3 mt-3" key={order.id}>
          <h5>{order.product}</h5>

          <p>Date : {order.date}</p>
          <p>Amount : ₹{order.amount}</p>
          <p>Status : {order.status}</p>

          <button className="btn btn-primary" onClick={() =>navigate(`/customer/orderdetails/${order.id}`)}>
            View Details
          </button>
        </div>
      ))}
    </div>
    </div>
  );
}

export default MyOrders;