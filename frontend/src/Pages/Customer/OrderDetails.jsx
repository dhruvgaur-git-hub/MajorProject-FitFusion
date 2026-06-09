import { useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";

function OrderDetails() {
  const { id } = useParams();

  return (
    <div>
        <Navbar />
    
    <div className="container mt-5">
      <h2>Order Details</h2>

      <div className="card p-4 mt-4">
        <h4>Order ID : {id}</h4>
        <hr />
        <p>Product : MB Protein Powder 1kg</p>
        <p>Quantity : 1</p>
        <p>Amount : ₹2999</p>
        <p>Status : Delivered</p><hr />
        <h5>Shipping Address</h5>

        <p>
          Kunal Sharma<br />
          Bhopal<br />
          Madhya Pradesh<br />
          462026
        </p>
      </div>
    </div>
    </div>
  );
}

export default OrderDetails;