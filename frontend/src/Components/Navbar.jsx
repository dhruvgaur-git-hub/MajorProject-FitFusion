import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dumbbell from '../assets/dumbbell.png';
import CustomerProfileModal from './CustomerProfileModal';
import { useCart } from '../context/CartContext';

function Navbar(){
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/login");
    };

    const linkClass = (path) =>
        `nav-link ${location.pathname === path ? "text-brand fw-bold" : "text-light"}`;

    return(
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 shadow-sm">
            <div className="container-fluid">

                {/* Logo */}
                <a
                    className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4"
                    href="#"
                    onClick={() => navigate("/aboutus")}
                >
                    <img
                        src={dumbbell}
                        alt="FitFusion Logo"
                        width="36"
                        height="36"
                        className="img-fluid"
                        style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    <span><span className="text-brand">Fit</span>Fusion</span>
                </a>

                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#customerNavbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="customerNavbarNav">
                    {/* Center Links */}
                    <ul className="navbar-nav mx-auto gap-lg-3">
                        <li className="nav-item">
                            <a className={linkClass("/home")} href="#" onClick={() => navigate("/home")}>
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={linkClass("/customer/myorders")} href="#" onClick={() => navigate("/customer/myorders")}>
                                My Orders
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={linkClass("/customer/assistant")} href="#" onClick={() => navigate("/customer/assistant")}>
                                AI Assistant
                            </a>
                        </li>
                    </ul>

                    {/* Right side: Cart, Profile, Logout */}
                    <div className="d-flex align-items-center gap-3">
                        <button
                            type="button"
                            className="cart-icon-btn"
                            onClick={() => navigate("/customer/cart")}
                            aria-label="Cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </button>

                        <span className="vr text-light opacity-25" style={{ height: "22px" }}></span>

                        <button
                            type="button"
                            className="retailer-chip"
                            onClick={() => setShowProfileModal(true)}
                        >
                            <span>👤</span> Profile
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
                .cart-icon-btn {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    color: #fff;
                    padding: 6px;
                    border-radius: 50%;
                    transition: background 0.2s ease;
                }
                .cart-icon-btn:hover {
                    background: rgba(255, 255, 255, 0.12);
                }
                .cart-badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    background: #dc3545;
                    color: #fff;
                    font-size: 0.65rem;
                    font-weight: bold;
                    min-width: 16px;
                    height: 16px;
                    border-radius: 999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 3px;
                    line-height: 1;
                }
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
        </nav>

        <CustomerProfileModal show={showProfileModal} onClose={() => setShowProfileModal(false)} />
        </>
    )
}
export default Navbar