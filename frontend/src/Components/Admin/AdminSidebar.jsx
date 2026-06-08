import logo from '../../assets/logo.png';
import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();

    const sides = [
        { id: "dashboard", label: "Dashboard", path: "dashboard" }, 
        { id: "retailmng", label: "Retailer Management", path: "retailmng" },
        { id: "usersmng", label: "User Management", path: "usersmng" },
        { id: "promng", label: "Product Management", path: "promng" },
    ];   

    const handleLogout = () => {
        // Add your logout logic here (e.g., clear token)
        console.log("Logging out...");
        navigate("/"); // Redirect to home or login
    };

    return (
        <div className="d-flex flex-column h-100 bg-dark">
            <div className="p-3 text-center border-bottom border-secondary">
                <img src={logo} alt="FitFusion Logo" style={{ height: '45px', width: 'auto', borderRadius: '40px' }} />
            </div>

            <ul className="nav flex-column list-unstyled mb-0">
                {/* Render Links */}
                {sides.map((side) => (
                    <li key={side.id}>
                        <NavLink
                            to={side.path}
                            className={({ isActive }) => 
                                `nav-link px-3 py-2 text-white ${isActive ? 'bg-primary' : ''}`
                            }
                        >
                            {side.label}
                        </NavLink>
                    </li>
                ))}

                {/* Render Logout Separately */}
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