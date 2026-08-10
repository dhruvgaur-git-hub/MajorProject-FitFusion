import { useNavigate } from 'react-router-dom';
import dumbbell from '../assets/dumbbell.png';
function Navbar1(){
    const navigate = useNavigate();
    return(
        <>
        <nav className="navbar bg-dark navbar-dark">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" href="#" onClick={() => navigate("/home")}>
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
                    <ul className="d-flex justify-content-center gap-5 list-unstyled mb-0">
                    {/* <li>
                        <a className="text-white text-decoration-none" href="#">
                            Admin Login
                        </a>
                    </li> */}
                    <li>
                        <a className="text-white text-decoration-none" href="#" onClick={() => navigate("/aboutus")}>
                            About Us
                        </a>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="#" onClick={() => navigate("/register")}>
                            Register
                        </a>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="#" onClick={() => navigate("/login")}>
                            Login
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        </>
    )
}
export default Navbar1

