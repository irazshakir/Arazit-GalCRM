import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMore, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { theme } from '../theme/theme';

const users = [
  {
    id: 1,
    name: 'Inzmam',
    email: 'inzamamulhaqoficial@gmail.com',
    role: 'Admin',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Aqeel Niazi',
    email: 'aqeel.niazi1@gmail.com',
    role: 'Member',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Ayesha',
    email: 'mmir57003@gmail.com',
    role: 'Member',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Muhammad Qasim',
    email: 'anum@indegotourism.com',
    role: 'Member',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Faraz',
    email: 'khurram.indego@gmail.com',
    role: 'Member',
    status: 'Active'
  },
  {
    id: 6,
    name: 'SAIM',
    email: 'saimshakeel178@gmail.com',
    role: 'Owner',
    status: 'Active'
  }
];

const Users = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownClick = (userId) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Users, Teams & Roles</h1>
        <button 
          className="text-white px-4 py-2 rounded-lg flex items-center"
          style={{ backgroundColor: theme.colors.primary.main, '&:hover': { backgroundColor: theme.colors.primary.hover } }}
        >
          + Add User
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <Link to="/users">
          <button 
            className="text-white px-4 py-2 rounded-lg"
            style={{ backgroundColor: theme.colors.primary.main }}
          >
            Users 6/6
          </button>
        </Link>
        <Link to="/users/invites">
          <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleDropdownClick(user.id)}
                  >
                    <AiOutlineMore className="w-5 h-5" />
                  </button>
                  {activeDropdown === user.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          onClick={() => {/* Handle edit */}}
                        >
                          <AiOutlineEdit className="mr-2" /> Edit
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                          onClick={() => {/* Handle delete */}}
                        >
                          <AiOutlineDelete className="mr-2" /> Delete
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

export default Users;
