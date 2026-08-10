import { useState } from "react"
import {Link, useNavigate } from "react-router-dom"
import Navbar1 from "../Components/Navbar1"
import axiosClient from "../api/axiosClient"
import { toast } from "react-toastify"

function Register(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    

    const navigate = useNavigate()

    const handleSignupClick = async () => {
        try{
            await axiosClient.post("/api/users/register/customer", {name, email, password, mobile:phone});
            toast.success("Registration Successful");
            navigate('/');

        }
        catch (error) {
            console.error(error);

            if (error.response) {
                toast.error(error.response.data.message || "Registration failed");
            } else {
                toast.error("Unable to connect to the server.");
            }
        }


        


/*     if (!name || !email || !password || !phone) {
        alert("Please fill all fields");
        return; 
    }
        */


};


    return (
        <div className="auth-page">
            <Navbar1 />
            <div className="container">
                <div className="auth-card">
                    <h3 className="fw-bold mb-1">Create your account</h3>
                    <p className="text-muted mb-4">Join FitFusion and start shopping</p>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Name</label>
                        <input type="text" className="form-control auth-input" id="username" placeholder="Enter name" onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control auth-input" id="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control auth-input" id="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="tel" className="form-control auth-input" id="phone" placeholder="Enter mobile no" onChange={e => setPhone(e.target.value)} />
                    </div>

                    <button className="btn btn-brand w-100 mb-4" onClick={handleSignupClick}>Signup</button>

                    <p className="text-muted mb-2">
                        Already have an account? <Link to='/login' className="text-brand fw-semibold text-decoration-none">Sign in</Link>
                    </p>
                    <p className="text-muted mb-0">
                        Want to register as a retailer? <Link to='/retailer/retailerregister' className="text-brand fw-semibold text-decoration-none">Click here</Link>
                    </p>
                </div>
            </div>

            <style>{`
                .auth-page {
                    min-height: 100vh;
                    background: #f8f9fa;
                }
                .auth-card {
                    background: #fff;
                    border: 1px solid #eceef1;
                    border-radius: 16px;
                    box-shadow: 0 6px 24px rgba(0,0,0,0.05);
                    padding: 40px;
                    max-width: 440px;
                    margin: 50px auto;
                }
                .auth-input:focus {
                    border-color: #ff6b35;
                    box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.15);
                }
            `}</style>
        </div>
    )
}

export default Register