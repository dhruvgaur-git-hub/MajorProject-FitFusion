import { Link, useLocation } from "react-router-dom";
import dumbbell from "../../assets/dumbbell.png";


function RetailerNavbar() {
  const location = useLocation();

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
          FitFusion
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
                className={`nav-link ${
                  location.pathname === "/retailer/retailerdashboard"
                    ? "text-success fw-bold"
                    : "text-light"
                }`}
              >
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/retailer/retailerproducts"
                className={`nav-link ${
                  location.pathname === "/retailer/retailerproducts"
                    ? "text-success fw-bold"
                    : "text-light"
                }`}
              >
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/retailer/retailerinventory"
                className={`nav-link ${
                  location.pathname === "/retailer/retailerinventory"
                    ? "text-success fw-bold"
                    : "text-light"
                }`}
              >
                Inventory
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/retailer/retailerorders"
                className={`nav-link ${
                  location.pathname === "/retailer/retailerorders"
                    ? "text-success fw-bold"
                    : "text-light"
                }`}
              >
                Orders
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/retailer/retailerprofile"
                className={`nav-link ${
                  location.pathname === "/retailer/retailerprofile"
                    ? "text-success fw-bold"
                    : "text-light"
                }`}
              >
                Profile
              </Link>
            </li>

          </ul>

          {/* User */}
          <span className="text-white small">
            👤 Retailer
          </span>
        </div>

      </div>
    </nav>
  );
}

export default RetailerNavbar;