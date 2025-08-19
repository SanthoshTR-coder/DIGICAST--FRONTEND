import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from "../../api";
import VotingModal from '../Voting/VotingModal';

const ElectionList = ({ isAdmin }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [showVotingModal, setShowVotingModal] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await api.get('/api/elections');
      setElections(response.data);
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  const deleteElection = async (electionId) => {
    if (!window.confirm('Are you sure you want to delete this election?')) {
      return;
    }

    try {
      await api.delete(`/api/elections/${electionId}`);
      toast.success('Election deleted successfully');
      fetchElections();
    } catch (error) {
      toast.error('Failed to delete election');
    }
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (now < start) return { status: 'upcoming', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' };
    if (now >= start && now <= end && election.isActive) return { status: 'active', color: 'text-green-400', bgColor: 'bg-green-400/10' };
    return { status: 'ended', color: 'text-red-400', bgColor: 'bg-red-400/10' };
  };

  const canVote = (election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);
    return now >= start && now <= end && election.isActive;
  };

  const ElectionCard = ({ election }) => {
    const statusInfo = getElectionStatus(election);
    
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{election.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{election.description}</p>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              <Clock className="w-3 h-3 mr-1" />
              {statusInfo.status.charAt(0).toUpperCase() + statusInfo.status.slice(1)}
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => {/* Handle edit */}}
                className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteElection(election._id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-xs">Start Date</p>
            <p className="text-white text-sm">{new Date(election.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">End Date</p>
            <p className="text-white text-sm">{new Date(election.endDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{election.candidates?.length || 0} candidates</span>
          </div>
          <div className="text-gray-400 text-sm">
            {election.totalVotes} votes cast
          </div>
        </div>

        {!isAdmin && canVote(election) && (
          <button
            onClick={() => {
              setSelectedElection(election);
              setShowVotingModal(true);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Cast Vote
          </button>
        )}

        {!isAdmin && !canVote(election) && statusInfo.status === 'ended' && (
          <div className="text-center text-gray-400 text-sm py-2">
            Voting has ended
          </div>
        )}

        {!isAdmin && statusInfo.status === 'upcoming' && (
          <div className="text-center text-gray-400 text-sm py-2">
            Voting starts on {new Date(election.startDate).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          {isAdmin ? 'Manage Elections' : 'Available Elections'}
        </h2>
        <p className="text-gray-400 mt-1">
          {isAdmin 
            ? 'Create, edit, and monitor your elections'
            : 'Participate in active elections'
          }
        </p>
      </div>

      {elections.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No elections found</h3>
          <p className="text-gray-500">
            {isAdmin 
              ? 'Create your first election to get started.'
              : 'Check back later for new elections.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {elections.map((election) => (
            <ElectionCard key={election._id} election={election} />
          ))}
        </div>
      )}

      {showVotingModal && (
        <VotingModal
          election={selectedElection}
          onClose={() => {
            setShowVotingModal(false);
            setSelectedElection(null);
          }}
          onVoteSuccess={() => {
            fetchElections();
            setShowVotingModal(false);
            setSelectedElection(null);
          }}
        />
      )}
    </div>
  );
};

export default ElectionList;