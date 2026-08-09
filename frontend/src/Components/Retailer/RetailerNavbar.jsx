import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import dumbbell from "../../assets/dumbbell.png";
import RetailerProfileModal from "./RetailerProfileModal";


function RetailerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 shadow-sm">
      <div className="container-fluid">

        {/* Logo */}
        <Link
          to="/retailer/retailerdashboard"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4"
        >
          <img
            src={dumbbell}
            alt="FitFusion Logo"
            width="36"
            height="36"
            className="img-fluid"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span><span className="text-brand">Fit</span>Fusion</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-lg-3">

            <li className="nav-item">
              <Link
                to="/retailer/retailerdashboard"
                className={`nav-link ${location.pathname === "/retailer/retailerdashboard"
                    ? "text-brand fw-bold"
                    : "text-light"
                  }`}
              >
                Dashboard
              </Link>
            </li>

            <li className="nav-item dropdown">
            <a 
              className={`nav-link dropdown-toggle ${location.pathname.includes("/retailer/retailerproducts") ? "text-brand fw-bold" : "text-light"}`}
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              Products
            </a>
            <ul className="dropdown-menu dropdown-menu-dark">
              <li>
                <Link className="dropdown-item" to="/retailer/retailerproducts?tab=catalog">
                  Global Catalog
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/retailer/retailerproducts?tab=my-products">
                  My Submissions
                </Link>
              </li>
            </ul>
          </li>

            <li className="nav-item">
              <Link
                to="/retailer/retailerinventory"
                className={`nav-link ${location.pathname === "/retailer/retailerinventory"
                    ? "text-brand fw-bold"
                    : "text-light"
                  }`}
              >
                Inventory
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/retailer/retailerpayouts"
                className={`nav-link ${location.pathname === "/retailer/retailerpayouts"
                    ? "text-brand fw-bold"
                    : "text-light"
                  }`}
              >
                Payouts
              </Link>
            </li>

          </ul>

          {/* User */}
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="retailer-chip"
              onClick={() => setShowProfileModal(true)}
            >
              <span>👤</span> Retailer
            </button>
            <span className="vr text-light opacity-25" style={{ height: "22px" }}></span>
            <button
              type="button"
              className="retailer-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .retailer-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #fff;
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 0.9rem;
          transition: background 0.2s ease;
        }
        .retailer-chip:hover {
          background: rgba(255, 255, 255, 0.18);
        }
        .retailer-logout {
          background: transparent;
          border: none;
          color: #dee2e6;
          font-size: 0.9rem;
          padding: 6px 4px;
          transition: color 0.2s ease;
        }
        .retailer-logout:hover {
          color: #dc3545;
        }
      `}</style>

      <RetailerProfileModal show={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </nav>
  );
}

export default RetailerNavbar;