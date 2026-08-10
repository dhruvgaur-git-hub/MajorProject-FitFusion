import dumbbell from '../../assets/dumbbell.png';
import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();

    const sides = [
        { id: "dashboard", label: "Dashboard", path: "dashboard" }, 
        { id: "retailmng", label: "Retailer Management", path: "retailmng" },
        { id: "promng", label: "Product Management", path: "promng" },
        { id: "catalogsettings", label: "Catalog Settings", path: "catalogsettings" },
        { id: "ordermng", label: "Order Management", path: "ordermng" },
        { id: "payoutmng", label: "Payouts", path: "payoutmng" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/login");
    };

    return (
        <div className="d-flex flex-column h-100 bg-dark">
            <div className="p-3 d-flex align-items-center justify-content-center gap-2 fw-bold fs-4 text-white border-bottom border-secondary">
                <img
                    src={dumbbell}
                    alt="FitFusion Logo"
                    width="36"
                    height="36"
                    className="img-fluid"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span><span className="text-brand">Fit</span>Fusion</span>
            </div>

            <ul className="nav flex-column list-unstyled mb-0">
                {sides.map((side) => (
                    <li key={side.id}>
                        <NavLink
                            to={side.path}
                            className="nav-link px-3 py-2 text-white"
                            style={
                                ({ isActive }) => ({
                                    backgroundColor: isActive ? "#ff6b35" : "transparent",
                                })
                            }
                        >
                            {side.label}
                        </NavLink>
                    </li>
                ))}

                <li>
                    <button 
                        onClick={handleLogout}
                        className="nav-link px-3 py-2 text-white bg-transparent border-0 text-start w-100"
                        style={{ cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default AdminSidebar;   