import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RetailerNavbar from "../../Components/Retailer/RetailerNavbar";
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
        <>  
            <RetailerNavbar />
            <div className="container w-50 my-5">    
                <h2 className="mb-4 text-primary">Retailer Registration</h2> 
                <form onSubmit={handleSignupClick}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label font-weight-bold">Owner Name</label>
                        <input type="text" className="form-control" id="username" placeholder="Enter owner name" onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Business Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter business email" onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Create password" onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Contact Number</label>
                        <input type="tel" className="form-control" id="phone" placeholder="Enter mobile no" onChange={e => setPhone(e.target.value)} required />
                    </div>

                    <hr className="my-4"/>
                    <h4 className="mb-3 text-secondary">Store Information</h4>

                    <div className="mb-3">
                        <label htmlFor="storeName" className="form-label">Fitness Store / Enterprise Name</label>
                        <input type="text" className="form-control" id="storeName" placeholder="e.g., Balaji Fitness Solutions" onChange={e => setStoreName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gstin" className="form-label">GSTIN / Tax Identification Number</label>
                        <input type="text" className="form-control" id="gstin" placeholder="Enter 15-digit GSTIN" onChange={e => setGstin(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Warehouse / Store Pickup Address</label>
                        <textarea className="form-control" id="address" rows="3" placeholder="Enter full dispatch location address" onChange={e => setAddress(e.target.value)} required></textarea>
                    </div>

                    <hr className="my-4"/>
                    <h4 className="mb-3 text-secondary">Bank Details</h4>

                    <div className="mb-3">
                        <label htmlFor="accountNumber" className="form-label">Bank Account Number</label>
                        <input type="text" className="form-control" id="accountNumber" placeholder="Enter bank account number" onChange={e => setAccountNumber(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
                        <input type="text" className="form-control" id="ifscCode" placeholder="Enter IFSC code" onChange={e => setIfscCode(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="bankName" className="form-label">Bank Name</label>
                        <input type="text" className="form-control" id="bankName" placeholder="Enter bank name" onChange={e => setBankName(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-text text-muted">Already have an account? </label>
                        <Link to='/login' className="ms-2">Click Here To Signin</Link>
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-success w-100 py-2">Complete Signup</button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default RetailerRegister;