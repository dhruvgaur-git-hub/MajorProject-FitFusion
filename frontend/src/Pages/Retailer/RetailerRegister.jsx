import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RetailerRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    // New specific retailer fields
    const [storeName, setStoreName] = useState('');
    const [gstin, setGstin] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    const handleSignupClick = (e) => {
        e.preventDefault();

        // Validation check
        if (!name || !email || !password || !phone || !storeName || !gstin || !address) {
            alert("Please fill all mandatory business fields");
            return;
        }

        // Structure the payload
        const retailerData = {
            name,
            email,
            password,
            phone,
            storeName,
            gstin,
            address,
            status: "PENDING_ONBOARDING", // Will tracking 3 mandatory products next
            balance: 0
        };

        // Store inside localStorage using email as the unique key prefix
        sessionStorage.setItem(`retailer_${email}`, JSON.stringify(retailerData));
        
        alert("Registration Successful! Please login to complete onboarding.");
        navigate('/retailer/retailerlogin');
    };

    return (
        <>
            <div className="container w-50 my-5">    
                <h2 className="mb-4 text-primary">Retailer Registration</h2> 
                <form onSubmit={handleSignupClick}>
                    {/* Personal details */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label font-weight-bold">Owner Name</label>
                        <input type="text" className="form-control" id="username" placeholder="Enter owner name" onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Business Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter business email" onChange={e => setEmail(e.target.value)} />            
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>   
                        <input type="password" className="form-control" id="password" placeholder="Create password" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Contact Number</label>
                        <input type="tel" className="form-control" id="phone" placeholder="Enter mobile no" onChange={e => setPhone(e.target.value)} />
                    </div>

                    <hr className="my-4"/>
                    <h4 className="mb-3 text-secondary">Store Information</h4>

                    {/* Business specific details */}
                    <div className="mb-3">
                        <label htmlFor="storeName" className="form-label">Fitness Store / Enterprise Name</label>
                        <input type="text" className="form-control" id="storeName" placeholder="e.g., Balaji Fitness Solutions" onChange={e => setStoreName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gstin" className="form-label">GSTIN / Tax Identification Number</label>
                        <input type="text" className="form-control" id="gstin" placeholder="Enter 15-digit GSTIN" onChange={e => setGstin(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Warehouse / Store Pickup Address</label>
                        <textarea className="form-control" id="address" rows="3" placeholder="Enter full dispatch location address" onChange={e => setAddress(e.target.value)}></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-text text-muted">Already have an account? </label>
                        <Link to='/retailer/retailerlogin' className="ms-2">Click Here To Signin</Link>
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