import {useNavigate} from "react-router-dom"
function Card({url, price, name}) {
  const navigate= useNavigate();
  return (
    <div className="card" style={{ width: "14rem" }}>
      <img
        src={url}
        className="card-img-top"
        alt="Sports T-Shirt"
      />

      <div className="card-body">
        <h5 className="card-title">{name}</h5>



        <h6 className="mb-3">₹{price}</h6>

        <button onClick={()=>navigate("/customer/cart")} className="btn btn-primary me-2">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default Card;