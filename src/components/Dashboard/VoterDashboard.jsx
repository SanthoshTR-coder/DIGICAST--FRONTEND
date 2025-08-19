import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Vote, 
  History, 
  Trophy, 
  LogOut,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from "../../api";
import { useAuth } from '../../contexts/AuthContext';

import ElectionList from '../Elections/ElectionList';
import VotingHistory from '../Voting/VotingHistory';
import ElectionResults from '../Elections/ElectionResults';

const VoterDashboard = () => {
  const [stats, setStats] = useState({
    availableElections: 0,
    votedElections: 0,
    upcomingElections: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [electionsRes, historyRes] = await Promise.all([
        api.get('/api/elections'),
        api.get('/api/votes/history')
      ]);
      
      const elections = electionsRes.data;
      const votingHistory = historyRes.data;
      
      const now = new Date();
      const availableElections = elections.filter(e => 
        e.isActive && new Date(e.startDate) <= now && new Date(e.endDate) >= now
      ).length;
      
      const upcomingElections = elections.filter(e => 
        e.isActive && new Date(e.startDate) > now
      ).length;

      setStats({
        availableElections,
        votedElections: votingHistory.length,
        upcomingElections
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
          <p className="text-xl text-white">Voter Panel</p>
          <p className="text-yellow-400 font-bold text-sm mt-1">Welcome, {user?.name}</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link
              to="/voter"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/voter') 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Vote className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <Link
              to="/voter/elections"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/voter/elections') 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Available Elections
            </Link>
            
            <Link
              to="/voter/history"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/voter/history') 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <History className="mr-3 h-5 w-5" />
              Voting History
            </Link>
            
            <Link
              to="/voter/results"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/voter/results') 
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
                <h2 className="text-2xl font-bold text-white">Voter Dashboard</h2>
                <p className="text-gray-400 mt-1">Participate in elections and track your voting activity</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  title="Available Elections"
                  value={stats.availableElections}
                  icon={Calendar}
                  color="bg-green-600"
                />
                <StatCard
                  title="Voted Elections"
                  value={stats.votedElections}
                  icon={CheckCircle}
                  color="bg-blue-600"
                />
                <StatCard
                  title="Upcoming Elections"
                  value={stats.upcomingElections}
                  icon={Vote}
                  color="bg-purple-600"
                />
              </div>
              
              {/* Quick Actions */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/voter/elections"
                    className="flex items-center p-4 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors"
                  >
                    <Vote className="mr-3 h-5 w-5" />
                    Cast Your Vote
                  </Link>
                  <Link
                    to="/voter/history"
                    className="flex items-center p-4 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    <History className="mr-3 h-5 w-5" />
                    View History
                  </Link>
                  <Link
                    to="/voter/results"
                    className="flex items-center p-4 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    <Trophy className="mr-3 h-5 w-5" />
                    Election Results
                  </Link>
                </div>
              </div>
            </div>
          } />
          <Route path="/elections" element={<ElectionList isAdmin={false} />} />
          <Route path="/history" element={<VotingHistory />} />
          <Route path="/results" element={<ElectionResults />} />
        </Routes>
      </div>
    </div>
  );
};

export default VoterDashboard;