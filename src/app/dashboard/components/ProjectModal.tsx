import React from 'react';
import { Duration } from '../types/project';
import Loader from '../../components/Loader';
import VoiceInput from '../../components/VoiceInput';
import { getMaxValueForUnit } from '../utils';

interface ProjectModalProps {
    showModal: boolean;
    isLoading: boolean;
    newProjectDescription: string;
    deadline: Duration;
    setShowModal: (show: boolean) => void;
    setNewProjectDescription: (description: string) => void;  // Updated type
    setDeadline: (deadline: Duration) => void;
    handleCreateProject: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
    showModal,
    isLoading,
    newProjectDescription,
    deadline,
    setShowModal,
    setNewProjectDescription,
    setDeadline,
    handleCreateProject,
}) => {
    if (!showModal) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full transition-colors duration-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New AI Project</h3>
          <form onSubmit={handleCreateProject}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Description
              </label>
              <div className="flex items-center gap-2">
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  rows={4}
                  placeholder="Describe your project in detail..."
                  required
                />
                <VoiceInput 
                onTranscriptComplete={(transcript) => setNewProjectDescription(`${newProjectDescription} ${transcript}`.trim())}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Deadline
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max={getMaxValueForUnit(deadline.unit)}
                  value={deadline.value}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    const maxValue = getMaxValueForUnit(deadline.unit);
                    setDeadline({
                      ...deadline,
                      value: Math.min(Math.max(1, newValue), maxValue)
                    });
                  }}
                  className="w-20 px-3 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  required
                />
                <select
                  value={deadline.unit}
                  onChange={(e) => setDeadline({...deadline, unit: e.target.value as Duration['unit']})}
                  className="px-3 py-2 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
  
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-colors duration-200"
                disabled={isLoading}
              >
                Generate AI Plan
              </button>
            </div>
          </form>
          {isLoading && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg flex items-center justify-center transition-colors duration-200">
              <Loader />
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ProjectModal;
  