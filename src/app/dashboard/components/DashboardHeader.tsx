import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LogOut, 
  Moon, 
  Sun, 
  Menu, 
  UserPlus, 
  Bell,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useInviteManagement, CollaborationRole } from './useInviteManagement';
import { toast } from 'sonner';

interface NavigationProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaborationRole>(CollaborationRole.VIEWER);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const { 
    invites, 
    sendInvite, 
    respondToInvite, 
    loading: invitesLoading 
  } = useInviteManagement();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.replace('/account');
  };

  const handleInvite = async () => {
    try {
      const result = await sendInvite(inviteEmail, inviteRole);
      
      if (result.success) {
        // Optional: Copy share URL to clipboard
        if (result.shareUrl) {
          navigator.clipboard.writeText(result.shareUrl);
          toast.success('Invite sent! Share URL copied to clipboard.');
        }
        
        setInviteEmail('');
        setInviteRole(CollaborationRole.VIEWER);
        setShowInviteModal(false);
        setInviteError(null);
        setIsOpen(false);
      } else {
        setInviteError(result.error || 'Failed to send invite');
      }
    } catch (error) {
      setInviteError('An unexpected error occurred');
      console.error('Invite error:', error);
    }
  };

  const handleInviteResponse = async (inviteId: string, response: 'accepted' | 'rejected') => {
    try {
      await respondToInvite(inviteId, response);
      
      // Close notifications after responding
      setShowNotifications(false);
    } catch (error) {
      toast.error('Failed to process invite');
    }
  };

  return (
    <div className="fixed top-0 right-0 p-4 z-50">
      <div className="flex items-center space-x-2">
        {/* Notifications Bell */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {invites.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
              {invites.length}
            </span>
          )}
        </button>

        {/* Main Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Invites
            </h3>
          </div>
          
          {invitesLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading invites...
            </div>
          ) : invites.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No pending invites
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {invites.map((invite) => (
                <div 
                  key={invite._id} 
                  className="p-4 border-b last:border-b-0 dark:border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {invite.inviterName} invited you to {invite.projectId.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Role: {invite.role}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInviteResponse(invite._id, 'rejected')}
                      className="text-red-500 hover:bg-red-100 rounded-full p-1"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleInviteResponse(invite._id, 'accepted')}
                      className="text-green-500 hover:bg-green-100 rounded-full p-1"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 border-b dark:border-gray-700">
            <div className="font-medium">Settings</div>
          </div>

          <button
            onClick={() => {
              setShowInviteModal(true);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <UserPlus className="w-4 h-4 mr-3" />
            Invite Collaborators
          </button>

          <Link 
            href="/invites" 
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bell className="w-4 h-4 mr-3" />
            View Invites
          </Link>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 mr-3" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-3" />
                Dark Mode
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowInviteModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Invite Collaborator
            </h2>
            
            {inviteError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                {inviteError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  setInviteError(null);
                }}
                placeholder="Enter collaborator's email"
                className="w-full px-3 py-2 border rounded-lg 
                  text-gray-900 dark:text-white 
                  bg-white dark:bg-gray-700 
                  border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Collaboration Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as CollaborationRole)}
                className="w-full px-3 py-2 border rounded-lg 
                  text-gray-900 dark:text-white 
                  bg-white dark:bg-gray-700 
                  border-gray-300 dark:border-gray-600"
              >
                <option value={CollaborationRole.VIEWER}>Viewer</option>
                <option value={CollaborationRole.COMMENTATOR}>Commentator</option>
                <option value={CollaborationRole.EDITOR}>Editor</option>
                <option value={CollaborationRole.ADMIN}>Admin</option>
              </select>
            </div>

            <button 
              onClick={handleInvite}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 
                dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Send Invite
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;