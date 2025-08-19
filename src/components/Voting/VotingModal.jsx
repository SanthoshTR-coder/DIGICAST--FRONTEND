import React, { useState, useEffect } from 'react';
import { X, CheckCircle, User } from 'lucide-react';
import { toast } from 'react-toastify';
import api from "../../api";

const VotingModal = ({ election, onClose, onVoteSuccess }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    checkVotingStatus();
  }, [election]);

  const checkVotingStatus = async () => {
    try {
      const response = await api.get(`/api/votes/check/${election._id}`);
      setHasVoted(response.data.hasVoted);
    } catch (error) {
      console.error('Error checking voting status:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/votes', {
        electionId: election._id,
        candidateId: selectedCandidate._id
      });

      toast.success('Your vote has been cast successfully!');
      onVoteSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Already Voted</h3>
            <p className="text-gray-400 mb-6">
              You have already cast your vote in this election.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Cast Your Vote</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-white mb-2">{election.title}</h4>
          <p className="text-gray-400">{election.description}</p>
        </div>

        <div className="space-y-4 mb-6">
          <h5 className="text-lg font-medium text-white">Select a candidate:</h5>
          {election.candidates.map((candidate) => (
            <div
              key={candidate._id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedCandidate?._id === candidate._id
                  ? 'border-indigo-500 bg-indigo-500/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <h6 className="font-medium text-white">{candidate.name}</h6>
                  </div>
                  <p className="text-gray-400 text-sm ml-8">{candidate.party}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedCandidate?._id === candidate._id
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-gray-500'
                }`}>
                  {selectedCandidate?._id === candidate._id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-600 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleVote}
            disabled={!selectedCandidate || loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Casting Vote...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Cast Vote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;