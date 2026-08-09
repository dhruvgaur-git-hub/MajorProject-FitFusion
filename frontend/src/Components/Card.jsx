import { useNavigate } from "react-router-dom";

function Card({ id, url, price, name }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ width: "14rem" }}>
      <img
        src={url}
        className="card-img-top"
        alt={name}
      />

      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <h6 className="mb-3">₹{price}</h6>

        <button
          onClick={() => navigate(`/products/${id}`)}
          className="btn btn-primary me-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default Card;