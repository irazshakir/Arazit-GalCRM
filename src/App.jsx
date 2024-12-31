import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Conversations from './pages/Conversations/Conversations';
import Users from './pages/Users';
import Invites from './pages/Invites';
import InactiveUsers from './pages/InactiveUsers';
import Teams from './pages/Teams';
import Roles from './pages/Roles';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-grow">
          <Routes>
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/invites" element={<Invites />} />
            <Route path="/users/inactive" element={<InactiveUsers />} />
            <Route path="/users/teams" element={<Teams />} />
            <Route path="/users/roles" element={<Roles />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
