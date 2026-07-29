
function Card({url, name}) {

  return (
    <div className="card" style={{ width: "14rem" }}>
      <img
        src={url}
        className="card-img-top"
        alt="Sports T-Shirt"
      />

      <div className="card-body">
        <h5 className="card-title">{name}</h5>

        <button className="btn btn-primary me-2">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Card;