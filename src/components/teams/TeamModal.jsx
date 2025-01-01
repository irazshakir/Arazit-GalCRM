import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { theme } from '../../theme/theme';
import userService from '../../services/userService';

const TeamModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    team_name: '',
    team_manager: '',
    team_members: []
  });
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchActiveUsers();
      if (initialData) {
        setFormData({
          team_name: initialData.team_name,
          team_manager: initialData.team_manager,
          team_members: initialData.team_members || []
        });
      } else {
        setFormData({
          team_name: '',
          team_manager: '',
          team_members: []
        });
      }
    }
  }, [isOpen, initialData]);

  const fetchActiveUsers = async () => {
    try {
      setLoading(true);
      const users = await userService.getUsers();
      setActiveUsers(users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.includes(userId)
        ? prev.team_members.filter(id => id !== userId)
        : [...prev.team_members, userId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Edit Team' : 'Add New Team'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              required
              value={formData.team_name}
              onChange={(e) => setFormData(prev => ({ ...prev, team_name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Manager *
            </label>
            <select
              required
              value={formData.team_manager}
              onChange={(e) => setFormData(prev => ({ ...prev, team_manager: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a manager</option>
              {activeUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div className="border rounded-lg max-h-48 overflow-y-auto p-2">
              {activeUsers.map(user => (
                <label key={user.id} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.team_members.includes(user.id)}
                    onChange={() => handleMemberToggle(user.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    {user.name} ({user.email})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: theme.colors.primary.main }}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Loading...' : initialData ? 'Update Team' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
