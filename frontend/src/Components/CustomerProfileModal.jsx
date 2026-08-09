import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';

function CustomerProfileModal({ show, onClose }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);

    // Only name and mobile are editable by the customer themselves.
    // (email and role can't change here.)
    const [form, setForm] = useState({ name: '', mobile: '' });

    useEffect(() => {
        if (show) {
            setEditMode(false);
            fetchProfile();
        }
    }, [show]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/users/profile');
            setProfile(response.data);
            setForm({
                name: response.data.name || '',
                mobile: response.data.mobile || ''
            });
        } catch (error) {
            console.error('Failed to load profile', error);
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
            const response = await axiosClient.put('/api/users/editprofile', form);
            toast.success('Profile updated successfully!');
            setProfile(response.data);
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
                        <h5 className="modal-title">{editMode ? 'Edit Profile' : 'Your Profile'}</h5>
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
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleChange}
                                    />
                                </div>
                                <small className="text-muted">
                                    Email can't be changed here — contact support if it needs updating.
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
                                <div className="mb-2"><strong>Phone:</strong> {profile.mobile || 'N/A'}</div>
                                <div className="mb-2"><strong>Role:</strong> {profile.role}</div>
                                <div className="mb-0">
                                    <strong>Member Since:</strong>{' '}
                                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
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

export default CustomerProfileModal;
