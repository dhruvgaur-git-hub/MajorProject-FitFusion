
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RetailerNavbar from "../../Components/Retailer/RetailerNavbar"; // Adjust import dots if needed
import axiosClient from "../../api/axiosClient";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function RetailerDashboard() {
    const navigate = useNavigate();

    // State to hold the logged-in retailer's profile details
    const [retailerProfile, setRetailerProfile] = useState(null);

    // Product + inventory stats for this retailer
    const [productStats, setProductStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
    const [inventoryStats, setInventoryStats] = useState({ inStock: 0, lowStock: 0, outOfStock: 0, totalUnits: 0, inventoryValue: 0 });
    const [statsLoading, setStatsLoading] = useState(true);

    const LOW_STOCK_THRESHOLD = 5;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productRes, inventoryRes] = await Promise.all([
                    axiosClient.get("/api/products/ret-stats"),
                    axiosClient.get("/api/inventory/retailer"),
                ]);

                if (productRes.data) setProductStats(productRes.data);

                const items = inventoryRes.data || [];
                let inStock = 0, lowStock = 0, outOfStock = 0, totalUnits = 0, inventoryValue = 0;

                items.forEach((item) => {
                    const qty = item.quantity ?? 0;
                    totalUnits += qty;
                    inventoryValue += qty * (item.retailerQuotedPrice ?? 0);

                    if (qty === 0) outOfStock += 1;
                    else if (qty <= LOW_STOCK_THRESHOLD) lowStock += 1;
                    else inStock += 1;
                });

                setInventoryStats({ inStock, lowStock, outOfStock, totalUnits, inventoryValue });
            } catch (error) {
                console.error("Failed to load retailer dashboard statistics", error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const productChartData = {
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [{
            data: [productStats.approved, productStats.pending, productStats.rejected],
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
        }],
    };

    const stockChartData = {
        labels: ["In Stock", "Low Stock", "Out of Stock"],
        datasets: [{
            data: [inventoryStats.inStock, inventoryStats.lowStock, inventoryStats.outOfStock],
            backgroundColor: ["#17a2b8", "#ffc107", "#dc3545"],
        }],
    };

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
                    navigate("/login");
                    return;
                }

                const response = await axiosClient.get("/api/users/profile");
                const userId = response.data.userId;

                // /api/users/profile only has name/email/mobile — the store
                // details (storeName, gstinNo, pickupAddress...) live on the
                // retailer-specific profile endpoint.
                const retailerRes = await axiosClient.get(`/api/retailers/profile/${userId}`);
                setRetailerProfile(retailerRes.data);

            } catch (error) {
                console.log(error);
                navigate("/login");
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
                            Managing Portal for: <strong className="text-brand">{retailerProfile ? retailerProfile.storeName : "Loading Enterprise..."}</strong>
                        </p>
                        
                        <hr className="my-4" />
                        
                        <div className="d-flex gap-4 text-secondary fs-6">
                            <div><strong>GSTIN:</strong> {retailerProfile ? retailerProfile.gstinNo : "N/A"}</div>
                            <div><strong>Phone:</strong> {retailerProfile ? retailerProfile.mobile : "N/A"}</div>
                            <div><strong>Pickup Address:</strong> {retailerProfile ? retailerProfile.pickupAddress : "N/A"}</div>
                        </div>
                    </div>
                </div>

                {statsLoading ? (
                    <div style={{ padding: "30px", textAlign: "center" }}>Loading dashboard analytics...</div>
                ) : (
                    <>
                        {/* Top Quick Summary KPI Cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", margin: "20px 0" }}>
                            <div className="bg-white p-3 shadow-sm rounded border">
                                <p className="mb-1 text-muted">Total Products</p>
                                <h3>{productStats.total}</h3>
                                <small className="text-success">{productStats.approved} Approved</small>
                            </div>
                            <div className="bg-white p-3 shadow-sm rounded border">
                                <p className="mb-1 text-muted">Total Stock Units</p>
                                <h3>{inventoryStats.totalUnits}</h3>
                                <small className="text-info">Across all listed variants</small>
                            </div>
                            <div className="bg-white p-3 shadow-sm rounded border">
                                <p className="mb-1 text-muted">Inventory Value</p>
                                <h3>₹{inventoryStats.inventoryValue.toLocaleString("en-IN")}</h3>
                                <small className="text-muted">At your quoted prices</small>
                            </div>
                            <div className="bg-white p-3 shadow-sm rounded border">
                                <p className="mb-1 text-muted">Low / Out of Stock</p>
                                <h3>{inventoryStats.lowStock + inventoryStats.outOfStock}</h3>
                                <small className="text-danger">{inventoryStats.outOfStock} out of stock</small>
                            </div>
                        </div>

                        {/* Diagrammatic Section: Side-by-Side Doughnut Charts */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "30px" }}>
                            <div className="bg-white p-4 shadow-sm rounded border text-center">
                                <h5>Product Approval Status</h5>
                                <div style={{ width: "200px", height: "200px", margin: "15px auto" }}>
                                    <Doughnut data={productChartData} options={{ maintainAspectRatio: false }} />
                                </div>
                            </div>
                            <div className="bg-white p-4 shadow-sm rounded border text-center">
                                <h5>Stock Health</h5>
                                <div style={{ width: "200px", height: "200px", margin: "15px auto" }}>
                                    <Doughnut data={stockChartData} options={{ maintainAspectRatio: false }} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default RetailerDashboard;
