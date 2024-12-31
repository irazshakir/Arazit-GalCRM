import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMore, AiOutlineDelete } from 'react-icons/ai';
import { theme } from '../theme/theme';

const invites = [
  {
    id: 1,
    email: 'john.doe@example.com',
    role: 'Member',
    status: 'Pending',
    sentAt: '2023-12-30'
  }
];

const Invites = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownClick = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Users, Teams & Roles</h1>
        <button 
          className="text-white px-4 py-2 rounded-lg flex items-center"
          style={{ backgroundColor: theme.colors.primary.main }}
        >
          + Add User
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <Link to="/users">
          <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            Users 6/6
          </button>
        </Link>
        <Link to="/users/invites">
          <button 
            className="text-white px-4 py-2 rounded-lg"
            style={{ backgroundColor: theme.colors.primary.main }}
          >
            Invites 0
          </button>
        </Link>
        <Link to="/users/inactive">
          <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            Inactive Users
          </button>
        </Link>
        <Link to="/users/teams">
          <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            Teams
          </button>
        </Link>
        <Link to="/users/roles">
          <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            Roles
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invites.map((invite) => (
              <tr key={invite.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{invite.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{invite.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {invite.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{invite.sentAt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleDropdownClick(invite.id)}
                  >
                    <AiOutlineMore className="w-5 h-5" />
                  </button>
                  {activeDropdown === invite.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                          onClick={() => {/* Handle delete */}}
                        >
                          <AiOutlineDelete className="mr-2" /> Cancel Invite
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invites;
