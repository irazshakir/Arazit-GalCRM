import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Users from './pages/Users';
import Teams from './pages/Teams';
import Roles from './pages/Roles';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Sidebar from './components/Sidebar/Sidebar';
import Invites from './pages/Invites';
import InactiveUsers from './pages/InactiveUsers';
import Conversations from './pages/Conversations/Conversations';
import './styles/global.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Protected Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-grow overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Users />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/invites" element={<Invites />} />
                  <Route path="/users/inactive" element={<InactiveUsers />} />
                  <Route path="/users/teams" element={<Teams />} />
                  <Route path="/users/roles" element={<Roles />} />
                  {/* Duplicate routes for direct access */}
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/roles" element={<Roles />} />
                  <Route path="/invites" element={<Invites />} />
                  <Route path="/inactive" element={<InactiveUsers />} />
                  <Route path="/conversations" element={<Conversations />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;
