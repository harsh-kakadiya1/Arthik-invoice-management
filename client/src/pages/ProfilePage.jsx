import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiImage, FiUpload, FiX } from 'react-icons/fi';
import MainLayout from '../components/Layout/MainLayout';
import api from '../lib/api';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    address: '',
    city: '',
    pinCode: '',
    logo: ''
  });
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        companyName: user.profile.companyName || '',
        phone: user.profile.phone || '',
        address: user.profile.address || '',
        city: user.profile.city || '',
        pinCode: user.profile.pinCode || '',
        logo: user.profile.logo || ''
      });
      setLogoPreview(user.profile.logo || '');
    }
  }, [user]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        setMessage('Logo size must be less than 1MB');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target.result;
        setFormData({ ...formData, logo: logoData });
        setLogoPreview(logoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: '' });
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Check logo size before sending
      if (formData.logo && formData.logo.length > 1000000) {
        setMessage('Logo is too large. Please use a smaller image (max 1MB).');
        setTimeout(() => setMessage(''), 5000);
        setLoading(false);
        return;
      }

      const response = await api.put('/auth/profile', formData);
      setUser(response.data.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error response:', error.response?.data);
      setMessage(error.response?.data?.error || error.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-text-primary">Profile Settings</h1>
          <p className="text-light-text-secondary mt-2">
            Manage your business information that will be used in invoices
          </p>
        </div>

        {/* User Info Card */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-light-text-primary mb-4 flex items-center">
            <FiUser className="mr-2" />
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="form-input w-full bg-gray-100 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-input w-full pl-10 bg-gray-100 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Profile Card */}
        <div className="card">
          <h2 className="text-xl font-semibold text-light-text-primary mb-4 flex items-center">
            <FiUser className="mr-2" />
            Business Information
          </h2>
          <p className="text-light-text-secondary mb-6">
            This information will be automatically filled in your invoices as sender details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label">Company/Business Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="form-input w-full"
                placeholder="Your company or business name"
              />
            </div>

            {/* Company Logo */}
            <div>
              <label className="form-label">Company Logo</label>
              <div className="space-y-4">
                {/* Logo Preview */}
                {logoPreview && (
                  <div className="relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Company Logo Preview"
                      className="h-20 w-auto border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {/* Upload Button */}
                <div className="flex items-center space-x-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FiUpload className="h-4 w-4" />
                    <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                  </button>
                  <span className="text-sm text-light-text-secondary">
                    Max 1MB, PNG/JPG recommended
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input w-full pl-10"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-input w-full pl-10"
                  placeholder="Your business address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="form-input w-full"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="form-label">Pin Code</label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="form-input w-full"
                  placeholder="123456"
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-white bg-brand-primary hover:bg-brand-secondary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="spinner h-4 w-4"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
