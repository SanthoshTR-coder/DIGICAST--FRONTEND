import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Vote, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Calendar,
  Trophy
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from "../../api";
import { useAuth } from '../../contexts/AuthContext';

import ElectionList from '../Elections/ElectionList';
import CreateElection from '../Elections/CreateElection';
import ElectionResults from '../Elections/ElectionResults';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    totalVotes: 0,
    totalVoters: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const electionsRes = await api.get('/api/elections');
      const elections = electionsRes.data;
      
      const totalElections = elections.length;
      const activeElections = elections.filter(e => e.isActive).length;
      const totalVotes = elections.reduce((sum, e) => sum + e.totalVotes, 0);

      setStats({
        totalElections,
        activeElections,
        totalVotes,
        totalVoters: 0 // This would require a separate endpoint
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{loading ? '...' : value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome, {user?.name}</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link
              to="/admin"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/admin') 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <Link
              to="/admin/elections"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/admin/elections') 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Vote className="mr-3 h-5 w-5" />
              Elections
            </Link>
            
            <Link
              to="/admin/create-election"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/admin/create-election') 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Plus className="mr-3 h-5 w-5" />
              Create Election
            </Link>
            
            <Link
              to="/admin/results"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/admin/results') 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Trophy className="mr-3 h-5 w-5" />
              Results
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 px-4">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-gray-400 mt-1">Manage your elections and monitor voting activity</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Elections"
                  value={stats.totalElections}
                  icon={Calendar}
                  color="bg-blue-600"
                />
                <StatCard
                  title="Active Elections"
                  value={stats.activeElections}
                  icon={Vote}
                  color="bg-green-600"
                />
                <StatCard
                  title="Total Votes"
                  value={stats.totalVotes}
                  icon={BarChart3}
                  color="bg-purple-600"
                />
                <StatCard
                  title="Registered Voters"
                  value={stats.totalVoters}
                  icon={Users}
                  color="bg-orange-600"
                />
              </div>
              
              {/* Quick Actions */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/admin/create-election"
                    className="flex items-center p-4 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="mr-3 h-5 w-5" />
                    Create New Election
                  </Link>
                  <Link
                    to="/admin/elections"
                    className="flex items-center p-4 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    <Vote className="mr-3 h-5 w-5" />
                    Manage Elections
                  </Link>
                  <Link
                    to="/admin/results"
                    className="flex items-center p-4 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    <Trophy className="mr-3 h-5 w-5" />
                    View Results
                  </Link>
                </div>
              </div>
            </div>
          } />
          <Route path="/elections" element={<ElectionList isAdmin={true} />} />
          <Route path="/create-election" element={<CreateElection />} />
          <Route path="/results" element={<ElectionResults />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;