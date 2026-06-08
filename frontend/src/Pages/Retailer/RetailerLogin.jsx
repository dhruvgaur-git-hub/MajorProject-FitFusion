import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RetailerNavbar from "../../Components/Retailer/RetailerNavbar";

function RetailerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Fix: Invoke useNavigate correctly
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!email || !password) {
            alert("Please enter both credentials");
            return;
        }

        // Try getting data from Local Storage
        const savedData = sessionStorage.getItem(`retailer_${email}`);
        
        if (savedData) {
            const parsedRetailer = JSON.parse(savedData);
            
            // Validate stored credentials
            if (parsedRetailer.password === password) {
                alert(`Welcome back to FitFusion, ${parsedRetailer.storeName || 'Retailer'}!`);
                // Track currently active session user
                sessionStorage.setItem('current_retailer_session', email);
                navigate('/retailer/retailerdashboard');
                return;
            } else {
                alert("Incorrect password");
                return;
            }
        } 
        
        // Fallback option for your static validation credentials
        if (email === "varsha@gmail.com" && password === "123") {
            sessionStorage.setItem('current_retailer_session', email);
            navigate('/retailer/retailerdashboard');
        } else {
            alert("Account not found. Please register first.");
        }
    };

    return (
        <>  
            <RetailerNavbar />
            <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
                <div className="container w-50 pt-5">
                    <h2 className="mb-3">Retailer Portal Login</h2>
                    <div className="mb-3">
                        <label htmlFor='email' className="form-label">Email</label>
                        <input type="email" className='form-control' id="email" placeholder='Enter email' onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input type="password" className='form-control' id="password" placeholder='Enter Password' onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className='mb-3'>
                        <button className='btn btn-success' onClick={handleLogin}>Login</button>
                    </div>
                    <div className='mb-3 mt-4'>
                        <label className="text-muted">Need a merchant account for your inventory?</label>
                        <br />
                        <Link to="/retailer/retailerregister" className="fw-semibold text-decoration-none">
                            Register as a Retailer
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
export default RetailerLogin;