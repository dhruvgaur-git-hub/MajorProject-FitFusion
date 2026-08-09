import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Card({ id, url, price, mrp, name }) {
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="product-card">
      <div className="product-card-image">
        {url && !imgFailed ? (
          <img
            src={url}
            alt={name}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="product-card-placeholder">
            <span>{name?.charAt(0)?.toUpperCase() || "?"}</span>
          </div>
        )}
      </div>

      <div className="product-card-body">
        <h6 className="product-card-title">{name}</h6>
        <div className="product-card-price">
          ₹{price}
          {mrp != null && Number(mrp) > Number(price) && (
            <span className="product-card-mrp">₹{mrp.toFixed ? mrp.toFixed(2) : mrp}</span>
          )}
        </div>

        <button
          onClick={() => navigate(`/products/${id}`)}
          className="product-card-btn"
        >
          View Details
        </button>
      </div>

      <style>{`
        .product-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #eceef1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
        }
        .product-card-image {
          aspect-ratio: 1 / 1;
          background: #f4f6f8;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .product-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-card-placeholder {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #ffede5;
          color: #ff6b35;
          font-size: 1.6rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-card-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-card-title {
          font-weight: 600;
          margin-bottom: 4px;
          line-height: 1.3;
          min-height: 2.6em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .product-card-price {
          font-weight: 700;
          color: #198754;
          margin-bottom: 12px;
        }
        .product-card-mrp {
          color: #adb5bd;
          font-weight: 400;
          font-size: 0.85rem;
          text-decoration: line-through;
          margin-left: 6px;
        }
        .product-card-btn {
          margin-top: auto;
          border: none;
          border-radius: 999px;
          background: #ff6b35;
          color: #fff;
          padding: 8px 0;
          font-weight: 500;
          transition: background 0.15s ease;
        }
        .product-card-btn:hover {
          background: #e8552b;
        }
      `}</style>
    </div>
  );
}

export default Card;