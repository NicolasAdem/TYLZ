import React from 'react';
import { useInviteManagement } from '../dashboard/components/useInviteManagement';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Check, X, AlertTriangle } from 'lucide-react';
import { CollaborationRole, InviteStatus } from '../dashboard/types/invite';

const InvitesPage: React.FC = () => {
  const { invites, respondToInvite, loading } = useInviteManagement();

  const renderRoleBadge = (role: CollaborationRole) => {
    const roleVariants: Record<CollaborationRole, string> = {
      viewer: 'secondary',
      commentator: 'outline',
      editor: 'default',
      admin: 'destructive'
    };

    return (
      <Badge variant={roleVariants[role] as any}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="animate-spin">
          <AlertTriangle className="w-8 h-8 text-gray-500" />
        </div>
        <span className="ml-2 text-gray-600">Loading invites...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Project Invites
      </h1>

      {invites.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <AlertTriangle className="mx-auto w-12 h-12 mb-4 text-gray-400 dark:text-gray-600" />
          <p>No pending invites at the moment</p>
          <p className="text-sm mt-2">Check back later or ask your team to invite you</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div 
              key={invite._id} 
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center justify-between border dark:border-gray-700"
            >
              <div className="flex-grow">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {invite.inviterName} invited you to 
                      <span className="ml-2 text-blue-600 dark:text-blue-400">
                        {invite.projectId.title}
                      </span>
                    </p>
                    <div className="mt-2">
                      {renderRoleBadge(invite.role)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => respondToInvite(invite._id, 'rejected')}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon"
                  onClick={() => respondToInvite(invite._id, 'accepted')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvitesPage;