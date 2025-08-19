import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Minus, Calendar, Users } from 'lucide-react';
import api from "../../api";

const CreateElection = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [
      { name: '', party: '' },
      { name: '', party: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...formData.candidates];
    updatedCandidates[index][field] = value;
    setFormData(prev => ({
      ...prev,
      candidates: updatedCandidates
    }));
  };

  const addCandidate = () => {
    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, { name: '', party: '' }]
    }));
  };

  const removeCandidate = (index) => {
    if (formData.candidates.length <= 2) {
      toast.error('At least 2 candidates are required');
      return;
    }
    
    const updatedCandidates = formData.candidates.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      candidates: updatedCandidates
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    const validCandidates = formData.candidates.filter(c => c.name.trim() && c.party.trim());
    if (validCandidates.length < 2) {
      toast.error('At least 2 candidates with names and parties are required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/elections', {
        ...formData,
        candidates: validCandidates
      });

      toast.success('Election created successfully!');
      navigate('/admin/elections');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Create New Election</h2>
          <p className="text-gray-400 mt-1">Set up a new election with candidates and voting period</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Election Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Election Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter election title"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter election description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Candidates */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Candidates
              </h3>
              <button
                type="button"
                onClick={addCandidate}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Candidate
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.candidates.map((candidate, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                      placeholder="Candidate name"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={candidate.party}
                      onChange={(e) => handleCandidateChange(index, 'party', e.target.value)}
                      placeholder="Party/Affiliation"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCandidate(index)}
                    disabled={formData.candidates.length <= 2}
                    className="p-2 text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/elections')}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Election'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateElection;