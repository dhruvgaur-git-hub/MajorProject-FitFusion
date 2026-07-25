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
        console.log("Logging out...");
        navigate("/admin/login");
    };

    return (
        <div className="d-flex flex-column h-100 bg-dark">
            <div className="p-3 text-center border-bottom border-secondary">
                <img src={logo} alt="FitFusion Logo" style={{ height: '45px', width: 'auto', borderRadius: '40px' }} />
            </div>

            <ul className="nav flex-column list-unstyled mb-0">
                {sides.map((side) => (
                    <li key={side.id}>
                        <NavLink
                            to={side.path}
                            className="nav-link px-3 py-2 text-white"
                            style={
                                ({ isActive }) => ({
                                    backgroundColor: isActive ? "#0d6efd" : "transparent",
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