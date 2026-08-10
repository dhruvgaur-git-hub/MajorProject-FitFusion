import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
    const [brandStats, setBrandStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [categoryStats, setCategoryStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [productStats, setProductStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                // Fetching from your exact backend stats endpoints in parallel
                const [brandRes, categoryRes, productRes] = await Promise.all([
                    axiosClient.get('/api/brands/stats'),
                    axiosClient.get('/api/categories/stats'),
                    axiosClient.get('/api/products/stats')
                ]);

                if (brandRes.data) setBrandStats(brandRes.data);
                if (categoryRes.data) setCategoryStats(categoryRes.data);
                if (productRes.data) setProductStats(productRes.data);
            } catch (error) {
                console.error("Failed to load dashboard statistics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    // Chart Data Configuration for Brands
    const brandChartData = {
        labels: ['Active', 'Inactive'],
        datasets: [{
            data: [brandStats.active, brandStats.inactive],
            backgroundColor: ['#28a745', '#dc3545'],
        }]
    };

    // Chart Data Configuration for Categories
    const categoryChartData = {
        labels: ['Active', 'Inactive'],
        datasets: [{
            data: [categoryStats.active, categoryStats.inactive],
            backgroundColor: ['#007bff', '#6c757d'],
        }]
    };

    // Chart Data Configuration for Products (Approved vs Pending/Rejected)
    const productChartData = {
        labels: ['Approved (Active)', 'Pending / Other (Inactive)'],
        datasets: [{
            data: [productStats.active, productStats.inactive],
            backgroundColor: ['#17a2b8', '#ffc107'],
        }]
    };

    if (loading) {
        return <div style={{ padding: '30px', textAlign: 'center' }}>Loading dashboard analytics...</div>;
    }

    return (
        <div className="dashboard-content" style={{ padding: '20px' }}>
            <h2>Dashboard Overview</h2>
            <p className="text-muted">Welcome back, Admin! Here is the live status of your platform catalog.</p>

            {/* Top Quick Summary KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', margin: '20px 0' }}>
                <div className="bg-white p-3 shadow-sm rounded border">
                    <p className="mb-1 text-muted">Total Brands</p>
                    <h3>{brandStats.total}</h3>
                    <small className="text-success">{brandStats.active} Active</small>
                </div>
                <div className="bg-white p-3 shadow-sm rounded border">
                    <p className="mb-1 text-muted">Total Categories</p>
                    <h3>{categoryStats.total}</h3>
                    <small className="text-brand">{categoryStats.active} Active</small>
                </div>
                <div className="bg-white p-3 shadow-sm rounded border">
                    <p className="mb-1 text-muted">Total Products</p>
                    <h3>{productStats.total}</h3>
                    <small className="text-info">{productStats.active} Approved</small>
                </div>
            </div>

            {/* Diagrammatic Section: Side-by-Side Doughnut Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
                
                {/* Brand Breakdown Chart */}
                <div className="bg-white p-4 shadow-sm rounded border text-center">
                    <h5>Brands Distribution</h5>
                    <div style={{ width: '200px', height: '200px', margin: '15px auto' }}>
                        <Doughnut data={brandChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                {/* Category Breakdown Chart */}
                <div className="bg-white p-4 shadow-sm rounded border text-center">
                    <h5>Categories Distribution</h5>
                    <div style={{ width: '200px', height: '200px', margin: '15px auto' }}>
                        <Doughnut data={categoryChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                {/* Product Status Breakdown Chart */}
                <div className="bg-white p-4 shadow-sm rounded border text-center">
                    <h5>Products Status Breakdown</h5>
                    <div style={{ width: '200px', height: '200px', margin: '15px auto' }}>
                        <Doughnut data={productChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;