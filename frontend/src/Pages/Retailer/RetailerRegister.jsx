import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar1 from "../../Components/Navbar1";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

function RetailerRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [storeName, setStoreName] = useState('');
    const [gstin, setGstin] = useState('');
    const [address, setAddress] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankName, setBankName] = useState('');

    const navigate = useNavigate();

    const handleSignupClick = async (e) => {
        e.preventDefault();

        try {
            await axiosClient.post("/api/users/register/retailer", {
                name,
                email,
                password,
                mobile: phone,
                storeName,
                pickupAddress: address,
                gstinNo: gstin,
                accountNumber,
                ifscCode,
                bankName
            });

            toast.success("Registration Successful! Please login to complete onboarding.");
            navigate('/login');
        }
        catch (error) {
            console.error(error);

            if (error.response) {
                toast.error(error.response.data.message || "Registration failed");
            } else {
                toast.error("Unable to connect to the server.");
            }
        }
    };

    return (
        <div className="retailer-register-page">
            <Navbar1 />
            <div className="container">
                <div className="retailer-register-card">
                    <h3 className="fw-bold mb-1">Retailer Registration</h3>
                    <p className="text-muted mb-4">Start selling on FitFusion's multi-retailer marketplace.</p>

                    <form onSubmit={handleSignupClick}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Owner Name</label>
                            <input type="text" className="form-control reg-input" id="username" placeholder="Enter owner name" onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Business Email</label>
                            <input type="email" className="form-control reg-input" id="email" placeholder="Enter business email" onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control reg-input" id="password" placeholder="Create password" onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Contact Number</label>
                            <input type="tel" className="form-control reg-input" id="phone" placeholder="Enter mobile no" onChange={e => setPhone(e.target.value)} required />
                        </div>

                        <h6 className="reg-section-heading">Store Information</h6>

                        <div className="mb-3">
                            <label htmlFor="storeName" className="form-label">Fitness Store / Enterprise Name</label>
                            <input type="text" className="form-control reg-input" id="storeName" placeholder="e.g., Balaji Fitness Solutions" onChange={e => setStoreName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="gstin" className="form-label">GSTIN / Tax Identification Number</label>
                            <input type="text" className="form-control reg-input" id="gstin" placeholder="Enter 15-digit GSTIN" onChange={e => setGstin(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Warehouse / Store Pickup Address</label>
                            <textarea className="form-control reg-input" id="address" rows="3" placeholder="Enter full dispatch location address" onChange={e => setAddress(e.target.value)} required></textarea>
                        </div>

                        <h6 className="reg-section-heading">Bank Details</h6>

                        <div className="mb-3">
                            <label htmlFor="accountNumber" className="form-label">Bank Account Number</label>
                            <input type="text" className="form-control reg-input" id="accountNumber" placeholder="Enter bank account number" onChange={e => setAccountNumber(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
                            <input type="text" className="form-control reg-input" id="ifscCode" placeholder="Enter IFSC code" onChange={e => setIfscCode(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bankName" className="form-label">Bank Name</label>
                            <input type="text" className="form-control reg-input" id="bankName" placeholder="Enter bank name" onChange={e => setBankName(e.target.value)} required />
                        </div>

                        <button type="submit" className="btn btn-brand w-100 py-2 mb-3">Complete Signup</button>

                        <p className="text-muted text-center mb-0">
                            Already have an account? <Link to='/login' className="text-brand fw-semibold text-decoration-none">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>

            <style>{`
                .retailer-register-page {
                    min-height: 100vh;
                    background: #f8f9fa;
                }
                .retailer-register-card {
                    background: #fff;
                    border: 1px solid #eceef1;
                    border-radius: 16px;
                    box-shadow: 0 6px 24px rgba(0,0,0,0.05);
                    padding: 40px;
                    max-width: 560px;
                    margin: 50px auto;
                }
                .reg-input:focus {
                    border-color: #ff6b35;
                    box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.15);
                }
                .reg-section-heading {
                    color: #312e81;
                    font-weight: 700;
                    padding-top: 14px;
                    margin-bottom: 16px;
                    border-top: 1px solid #eceef1;
                    padding-top: 20px;
                }
            `}</style>
        </div>
    );
}
export default RetailerRegister;