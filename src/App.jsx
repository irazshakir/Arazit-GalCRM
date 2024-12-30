import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-8">
            <h1 className="text-2xl font-semibold text-gray-800">Welcome to CRM Dashboard</h1>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}
