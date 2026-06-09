import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/dumbbell.png';
import './RetailerNavbar.css';

function RetailerNavbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link to="/retailer/retailerdashboard" className="navbar-logo">
                <img src={logo} alt="FitFusion Logo" className="navbar-logo-img" />
                FitFusion
            </Link>
            <ul className="navbar-links">
                <li><Link to="/retailer/retailerdashboard" className={location.pathname === '/retailer/retailerdashboard' ? 'active' : ''}>Dashboard</Link></li>
                <li><Link to="/retailer/retailerproducts" className={location.pathname === '/retailer/retailerproducts' ? 'active' : ''}>Products</Link></li>
                <li><Link to="/retailer/retailerorders" className={location.pathname === '/retailer/retailerorders' ? 'active' : ''}>Orders</Link></li>
                <li><Link to="/retailer/retailerprofile" className={location.pathname === '/retailer/retailerprofile' ? 'active' : ''}>Profile</Link></li>
            </ul>
            <span className="navbar-user">👤 Retailer</span>
        </nav>
    );
}

export default RetailerNavbar;
