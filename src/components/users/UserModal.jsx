import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineClose, AiOutlineUpload, AiOutlineUser } from 'react-icons/ai';
import { theme } from '../../theme/theme';
import { supabase } from '../../config/supabase';
import axios from 'axios';

const UserModal = ({ isOpen, onClose, onSubmit, editUser = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    branch_id: '',
    user_is_active: true,
    image: null,
    imageUrl: ''
  });

  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRolesAndBranches();
  }, []);

  useEffect(() => {
    if (editUser) {
      setFormData({
        name: editUser.name || '',
        email: editUser.email || '',
        password: '', // Don't show existing password
        role_id: editUser.role_id || '',
        branch_id: editUser.branch_id || '',
        user_is_active: editUser.user_is_active ?? true,
        image: null,
        imageUrl: editUser.image || ''
      });
      if (editUser.image) {
        setImagePreview(editUser.image);
      }
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role_id: '',
        branch_id: '',
        user_is_active: true,
        image: null,
        imageUrl: ''
      });
      setImagePreview(null);
    }
  }, [editUser]);

  const fetchRolesAndBranches = async () => {
    try {
      const [{ data: rolesData }, { data: branchesData }] = await Promise.all([
        supabase.from('roles').select('id, role_name').eq('role_is_active', true),
        supabase.from('branches').select('id, branch_name')
      ]);
      
      setRoles(rolesData || []);
      setBranches(branchesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    } catch (error) {
      console.error('Error handling image:', error);
      setErrors(prev => ({ ...prev, image: 'Error processing image' }));
    }
  };

  const saveImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!editUser && !formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.role_id) newErrors.role_id = 'Role is required';
    if (!formData.branch_id) newErrors.branch_id = 'Branch is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation (only for new users or if password is being changed)
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        let imageUrl = formData.imageUrl;

        // Upload new image if selected
        if (formData.image) {
          imageUrl = await saveImage(formData.image);
        }

        // Prepare submission data
        const submissionData = {
          name: formData.name,
          role_id: formData.role_id,
          branch_id: formData.branch_id,
          user_is_active: formData.user_is_active,
          imageUrl
        };

        // Only include email and password for new users
        if (!editUser) {
          submissionData.email = formData.email;
          submissionData.password = formData.password;
        }

        // Submit form with image URL
        await onSubmit(submissionData);
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: error.message });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? 'visible' : 'invisible'
      }`}
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editUser ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <AiOutlineUser className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <AiOutlineUpload className="w-4 h-4 mr-2" />
                    Upload Image
                  </button>
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'
                }`}
                placeholder="Enter user's name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editUser ? 'New Password (leave blank to keep current)' : 'Password'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.role_id
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'
                }`}
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              {errors.role_id && (
                <p className="mt-1 text-sm text-red-500">{errors.role_id}</p>
              )}
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <select
                name="branch_id"
                value={formData.branch_id}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.branch_id
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'
                }`}
              >
                <option value="">Select a branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
              {errors.branch_id && (
                <p className="mt-1 text-sm text-red-500">{errors.branch_id}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, user_is_active: !prev.user_is_active }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.user_is_active ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.user_is_active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm text-gray-600">
                {formData.user_is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Error message */}
            {errors.submit && (
              <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}
          </form>
        </div>

        <div className="border-t p-4 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            style={{ backgroundColor: theme.colors.primary.main }}
          >
            {isSubmitting ? 'Saving...' : editUser ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
