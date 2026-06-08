import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
function Navbar1(){
    const navigate = useNavigate();
    return(
        <>
        <nav className="navbar bg-dark navbar-dark">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src={logo} alt="FitFusion Logo" style={{ height: '45px', width: 'auto', borderRadius: '40px'}} />
                </a>
                    <ul className="d-flex justify-content-center gap-5 list-unstyled mb-0">
                    {/* <li>
                        <a className="text-white text-decoration-none" href="#">
                            Admin Login
                        </a>
                    </li> */}
                    <li>
                        <a className="text-white text-decoration-none" href="#" onClick={() => navigate("/aboutus")}>
                            AboutUs
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

