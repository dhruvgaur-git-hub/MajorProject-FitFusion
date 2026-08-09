import { useNavigate } from "react-router-dom";

function Card({url, name}) {
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

        <button className="btn btn-primary me-2"
        onClick={()=>navigate("/edit-profile")}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Card;