
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RetailerNavbar from "../../Components/Retailer/RetailerNavbar"; // Adjust import dots if needed
import axios from "axios";

function RetailerDashboard() {
    const navigate = useNavigate();
    
    // State to hold the logged-in retailer's profile details
    const [retailerProfile, setRetailerProfile] = useState(null);

/*    useEffect(() => {
        // 1. Find out WHO is logged in by checking the session token
        const activeEmail = sessionStorage.getItem('current_retailer_session');
        
        if (!activeEmail) {
            // Security Guard: If no session exists, redirect to login
            alert("Please login to access the dashboard.");
            navigate('/retailer/retailerlogin');
            return;
        }

        // 2. Use that email to fetch the full profile object we saved during registration
        const savedProfileData = sessionStorage.getItem(`retailer_${activeEmail}`);
        
        if (savedProfileData) {
            // Convert the stringified data back into a readable JavaScript object
            setRetailerProfile(JSON.parse(savedProfileData));
        }
    }, [navigate]);
*/
    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/retailer/retailerlogin");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:9091/users/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setRetailerProfile(response.data);

            } catch (error) {
                console.log(error);
                navigate("/retailer/retailerlogin");
            }

        };

        fetchProfile();

    }, [navigate]);
    return (
        <div>
            <RetailerNavbar />
            
            <div className="container mt-5">
                {/* Clean Bootstrap Jumbotron/Hero card for the welcome message */}
                <div className="p-5 mb-4 bg-light rounded-3 border shadow-sm">
                    <div className="container-fluid py-2">
                        <h1 className="display-6 fw-bold text-dark">
                            Welcome back, {retailerProfile ? retailerProfile.name : "Merchant"}!
                        </h1>
                        
                        <p className="col-md-8 fs-5 text-muted mt-2">
                            Managing Portal for: <strong className="text-success">{retailerProfile ? retailerProfile.storeName : "Loading Enterprise..."}</strong>
                        </p>
                        
                        <hr className="my-4" />
                        
                        <div className="d-flex gap-4 text-secondary fs-6">
                            <div><strong>GSTIN:</strong> {retailerProfile ? retailerProfile.gstin : "N/A"}</div>
                            <div><strong>Phone:</strong> {retailerProfile ? retailerProfile.phone : "N/A"}</div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col">
                        <h3>Your Workspace Tools</h3>
                        <p className="text-muted">Next, we will build your mandatory 3-product onboarding checker here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RetailerDashboard;
