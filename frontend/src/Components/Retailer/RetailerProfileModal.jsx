import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';

function RetailerProfileModal({ show, onClose }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);

    // Only these fields are editable by the retailer themselves.
    // (gstinNo and status are set by Admin / at registration and can't change here.)
    const [form, setForm] = useState({
        storeName: '',
        pickupAddress: '',
        accountNumber: '',
        ifscCode: '',
        bankName: ''
    });

    useEffect(() => {
        if (show) {
            setEditMode(false);
            fetchProfile();
        }
    }, [show]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const userRes = await axiosClient.get('/api/users/profile');
            const userId = userRes.data.userId;

            const retailerRes = await axiosClient.get(`/api/retailers/profile/${userId}`);
            setProfile(retailerRes.data);
            setForm({
                storeName: retailerRes.data.storeName || '',
                pickupAddress: retailerRes.data.pickupAddress || '',
                accountNumber: retailerRes.data.accountNumber || '',
                ifscCode: retailerRes.data.ifscCode || '',
                bankName: retailerRes.data.bankName || ''
            });
        } catch (error) {
            console.error('Failed to load retailer profile', error);
            toast.error('Failed to load your profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axiosClient.put(`/api/retailers/profile/${profile.retailerId}`, form);
            toast.success('Profile updated successfully!');
            setProfile({ ...profile, ...form });
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update profile', error);
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{editMode ? 'Edit Profile' : 'Retailer Profile'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {loading ? (
                        <div className="modal-body text-center py-4">Loading profile...</div>
                    ) : !profile ? (
                        <div className="modal-body text-center py-4 text-muted">Unable to load profile.</div>
                    ) : editMode ? (
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Store Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="storeName"
                                        value={form.storeName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Pickup Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="pickupAddress"
                                        value={form.pickupAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Bank Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="bankName"
                                        value={form.bankName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Account Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="accountNumber"
                                        value={form.accountNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">IFSC Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="ifscCode"
                                        value={form.ifscCode}
                                        onChange={handleChange}
                                    />
                                </div>
                                <small className="text-muted">
                                    GSTIN and account status can't be changed here — contact an admin if these need updating.
                                </small>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-brand" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="modal-body">
                                <div className="mb-2"><strong>Name:</strong> {profile.name}</div>
                                <div className="mb-2"><strong>Email:</strong> {profile.email}</div>
                                <div className="mb-2"><strong>Phone:</strong> {profile.mobile}</div>
                                <div className="mb-2"><strong>Store Name:</strong> {profile.storeName || 'N/A'}</div>
                                <div className="mb-2"><strong>GSTIN:</strong> {profile.gstinNo || 'N/A'}</div>
                                <div className="mb-2"><strong>Pickup Address:</strong> {profile.pickupAddress || 'N/A'}</div>
                                <div className="mb-2"><strong>Bank Name:</strong> {profile.bankName || 'N/A'}</div>
                                <div className="mb-2"><strong>Account Number:</strong> {profile.accountNumber || 'N/A'}</div>
                                <div className="mb-2"><strong>IFSC Code:</strong> {profile.ifscCode || 'N/A'}</div>
                                <div className="mb-0"><strong>Status:</strong> {profile.status || 'N/A'}</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                                <button type="button" className="btn btn-brand" onClick={() => setEditMode(true)}>
                                    Edit Profile
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RetailerProfileModal;
