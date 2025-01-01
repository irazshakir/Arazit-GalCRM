import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMore, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { theme } from '../theme/theme';
import teamService from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import Pagination from '../components/common/Pagination';
import TeamModal from '../components/teams/TeamModal';

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user, currentPage, pageSize]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeams();
      setTotalItems(data.length);
      
      // Calculate pagination
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setTeams(data.slice(startIndex, endIndex));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownClick = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleEditClick = (team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await teamService.deleteTeam(teamId);
      await fetchTeams();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingTeam) {
        await teamService.updateTeam(editingTeam.id, formData);
      } else {
        await teamService.createTeam(formData);
      }
      setIsModalOpen(false);
      setEditingTeam(null);
      await fetchTeams();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Users, Teams & Roles</h1>
        <button 
          onClick={() => {
            setEditingTeam(null);
            setIsModalOpen(true);
          }}
          className="text-white px-4 py-2 rounded-lg flex items-center hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.colors.primary.main }}
        >
          + Add Team
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        <Link to="/users">
          <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            Users
          </button>
        </Link>
        <Link to="/users/invites">
          <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            Invites
          </button>
        </Link>
        <Link to="/users/inactive">
          <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            Inactive Users
          </button>
        </Link>
        <Link to="/users/teams">
          <button 
            className="text-white px-4 py-2 rounded-lg"
            style={{ backgroundColor: theme.colors.primary.main }}
          >
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {team.team_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{team.team_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {team.manager?.name || 'No manager'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {team.team_members?.length || 0} members
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => handleDropdownClick(team.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <AiOutlineMore className="w-5 h-5" />
                    </button>
                    {activeDropdown === team.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleEditClick(team)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <AiOutlineEdit className="mr-2" /> Edit Team
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                          >
                            <AiOutlineDelete className="mr-2" /> Delete Team
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Team Modal */}
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTeam(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingTeam}
      />
    </div>
  );
};

export default Teams;
