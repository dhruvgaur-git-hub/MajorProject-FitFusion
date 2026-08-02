import {Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
function Navbar(){
    const navigate= useNavigate();
    return(
        <>
        <nav className="navbar bg-dark navbar-dark">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src={logo} alt="FitFusion Logo" style={{ height: '45px', width: 'auto', borderRadius: '40px'}} />
                </a>
                    <ul className="d-flex justify-content-center gap-5 list-unstyled mb-0">
                    <li>
                        <Link className="text-white text-decoration-none" href="#" onClick={() => navigate("/home")}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="#" onClick={() => navigate("/customer/cart")}>
                            Cart
                        </a>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="#" onClick={() => navigate("/customer/myorders")}>
                            MyOrders
                        </a>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="#" onClick={() => navigate("/customer/profile")}>
                            Profile
                        </a>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="#" onClick={() => navigate("/login") }>
                            Logout
                        </a>
                    </li>
                    <li>
                        <a
                            className="text-white text-decoration-none"
                            href="#"
                            onClick={() => navigate("/customer/assistant")}
                        >
                            AI Assistant
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        </>
    )
}
export default Navbar