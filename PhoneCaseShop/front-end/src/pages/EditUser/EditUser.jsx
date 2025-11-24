import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserDetails, useUpdateUser } from '../../hook/useUser';
import './EditUser.css';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: user, isLoading, error } = useUserDetails(id);
    const updateUserMutation = useUpdateUser();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserMutation.mutate(
            { userId: id, userData: formData },
            {
                onSuccess: () => {
                    alert('User updated successfully!');
                    navigate(`/user/${id}`);
                },
                onError: (err) => {
                    alert(`Failed to update user: ${err.message}`);
                }
            }
        );
    };

    if (isLoading) return <div className="edit-user-loading">Loading...</div>;
    if (error) return <div className="edit-user-error">Error: {error.message}</div>;

    return (
        <div className="edit-user-container">
            <h1 className="edit-user-title">Edit User</h1>
            <form className="edit-user-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate(`/user/${id}`)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-save" disabled={updateUserMutation.isPending}>
                        {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
