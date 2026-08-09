import { useEffect, useState } from 'react';
import RetailerNavbar from '../../Components/Retailer/RetailerNavbar';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import { decodeToken } from '../../utils/jwt';
import './RetailerProducts.css';

function statusBadgeClass(status) {
    if (status === 'PROCESSED') return 'badge badge-active';
    if (status === 'FAILED') return 'badge badge-out';
    return 'badge badge-low';
}

function RetailerPayouts() {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const decoded = decodeToken(token);
            const retailerId = decoded?.userId;

            if (!retailerId) {
                toast.error('Session expired. Please log in again.');
                return;
            }

            const response = await axiosClient.get(`/api/payouts/retailer/${retailerId}`);
            setPayouts(response.data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to load payouts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, []);

    return (
        <div className="products-page">
            <RetailerNavbar />

            <div className="products-container">
                <div className="page-header">
                    <div>
                        <h1>My Payouts</h1>
                    </div>
                </div>

                <div className="table-card">
                    <div className="toolbar">
                        <h3>Payouts ({payouts.length})</h3>
                    </div>

                    {loading ? (
                        <p style={{ color: '#888' }}>Loading payouts...</p>
                    ) : (
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Payout ID</th>
                                    <th>Amount</th>
                                    <th>Commission</th>
                                    <th>Net Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#888', padding: '24px' }}>
                                            No payouts yet.
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.map((payout) => (
                                        <tr key={payout.payoutId}>
                                            <td>{payout.payoutId}</td>
                                            <td>₹{payout.amount?.toFixed(2)}</td>
                                            <td>₹{payout.commissionAmount?.toFixed(2)}</td>
                                            <td>₹{payout.netAmount?.toFixed(2)}</td>
                                            <td>
                                                <span className={statusBadgeClass(payout.status)}>{payout.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RetailerPayouts;