import React, { useState, useEffect } from 'react';
import { Trophy, Users, BarChart3, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import api from "../../api";

const ElectionResults = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await api.get('/api/elections');
      const completedElections = response.data.filter(election => 
        new Date(election.endDate) < new Date() || !election.isActive
      );
      setElections(completedElections);
      
      if (completedElections.length > 0) {
        setSelectedElection(completedElections[0]);
        fetchResults(completedElections[0]._id);
      }
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (electionId) => {
    try {
      const response = await api.get(`/api/elections/${electionId}/results`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load election results');
    }
  };

  const handleElectionSelect = (election) => {
    setSelectedElection(election);
    fetchResults(election._id);
    setResults(null);
  };

  const getWinner = () => {
    if (!results || !results.candidates) return null;
    return results.candidates.reduce((prev, current) => 
      (prev.votes > current.votes) ? prev : current
    );
  };

  const ResultCard = ({ candidate, isWinner, totalVotes }) => (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      isWinner 
        ? 'border-yellow-400 bg-yellow-400/10' 
        : 'border-gray-600 bg-gray-700'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className={`font-semibold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
            {candidate.name}
            {isWinner && <span className="ml-2 text-xs">👑 WINNER</span>}
          </h4>
          <p className="text-gray-400 text-sm">{candidate.party}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
            {candidate.votes}
          </p>
          <p className="text-gray-400 text-xs">votes</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="bg-gray-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isWinner ? 'bg-yellow-400' : 'bg-indigo-500'
            }`}
            style={{ 
              width: `${totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0}%` 
            }}
          />
        </div>
        <p className={`text-right mt-1 text-sm ${isWinner ? 'text-yellow-400' : 'text-gray-400'}`}>
          {candidate.percentage}%
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No completed elections</h3>
          <p className="text-gray-500">Results will appear here once elections are completed.</p>
        </div>
      </div>
    );
  }

  const winner = getWinner();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Election Results</h2>
        <p className="text-gray-400 mt-1">View results for completed elections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Election Selection */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Select Election</h3>
            <div className="space-y-2">
              {elections.map((election) => (
                <button
                  key={election._id}
                  onClick={() => handleElectionSelect(election)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedElection?._id === election._id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{election.title}</div>
                  <div className="text-sm opacity-75">
                    {new Date(election.endDate).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2">
          {selectedElection && (
            <div className="space-y-6">
              {/* Election Overview */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">{selectedElection.title}</h3>
                <p className="text-gray-400 mb-4">{selectedElection.description}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-2">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedElection.totalVotes}</p>
                    <p className="text-gray-400 text-sm">Total Votes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mx-auto mb-2">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedElection.candidates?.length || 0}</p>
                    <p className="text-gray-400 text-sm">Candidates</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-2">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {Math.ceil((new Date(selectedElection.endDate) - new Date(selectedElection.startDate)) / (1000 * 60 * 60 * 24))}
                    </p>
                    <p className="text-gray-400 text-sm">Days Duration</p>
                  </div>
                </div>
              </div>

              {/* Winner Announcement */}
              {winner && (
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-6 border-2 border-yellow-400/50">
                  <div className="flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
                    <h3 className="text-2xl font-bold text-yellow-400">Winner</h3>
                  </div>
                  <div className="text-center">
                    <h4 className="text-3xl font-bold text-white mb-2">{winner.name}</h4>
                    <p className="text-xl text-gray-300 mb-2">{winner.party}</p>
                    <p className="text-lg text-yellow-400">
                      {winner.votes} votes ({winner.percentage}%)
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Results */}
              {results && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Detailed Results</h3>
                  <div className="space-y-4">
                    {results.candidates
                      .sort((a, b) => b.votes - a.votes)
                      .map((candidate, index) => (
                        <ResultCard
                          key={candidate._id}
                          candidate={candidate}
                          isWinner={index === 0}
                          totalVotes={results.totalVotes}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionResults;