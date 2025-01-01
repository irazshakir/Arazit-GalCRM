import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { theme } from '../../theme/theme';

const RoleModal = ({ isOpen, onClose, onSubmit, editRole = null }) => {
  const [formData, setFormData] = useState({
    role_name: '',
    role_is_active: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editRole) {
      setFormData({
        role_name: editRole.role_name || '',
        role_is_active: editRole.role_is_active ?? true
      });
    } else {
      setFormData({
        role_name: '',
        role_is_active: true
      });
    }
  }, [editRole]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.role_name.trim()) {
      newErrors.role_name = 'Role name is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        onClose();
      } catch (error) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <AiOutlineClose className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {editRole ? 'Edit Role' : 'Add New Role'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name
            </label>
            <input
              type="text"
              name="role_name"
              value={formData.role_name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.role_name
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-primary-100 focus:border-primary-500'
              }`}
              placeholder="Enter role name"
            />
            {errors.role_name && (
              <p className="mt-1 text-sm text-red-500">{errors.role_name}</p>
            )}
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  const newValue = !formData.role_is_active;
                  setFormData(prev => ({
                    ...prev,
                    role_is_active: Boolean(newValue) // Ensure true/false boolean for PostgreSQL
                  }));
                }}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${formData.role_is_active ? 'bg-green-500' : 'bg-red-500'}
                `}
                role="switch"
                aria-checked={formData.role_is_active}
              >
                <span
                  aria-hidden="true"
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${formData.role_is_active ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
              <span className={`ml-3 text-sm ${formData.role_is_active ? 'text-green-700' : 'text-red-700'}`}>
                {formData.role_is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ 
                backgroundColor: isSubmitting ? theme.colors.primary.light : theme.colors.primary.main,
              }}
              className="px-4 py-2.5 text-white rounded-lg disabled:opacity-50 transition-colors font-medium hover:opacity-90"
            >
              {isSubmitting ? 'Saving...' : editRole ? 'Save Changes' : 'Add Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
