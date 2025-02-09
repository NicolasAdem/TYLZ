// useInviteManagement.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export enum CollaborationRole {
  VIEWER = 'viewer',
  COMMENTATOR = 'commentator',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

interface Invite {
  _id: string;
  inviterName: string;
  projectId: {
    _id: string;
    title: string;
  };
  role: CollaborationRole;
  status: 'pending' | 'accepted' | 'rejected';
}

interface InviteResponse {
  success: boolean;
  error?: string;
  shareUrl?: string;
}

export const useInviteManagement = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No auth token found');
        setLoading(false);
        return;
      }
  
      let response: Response;
      
      try {
        response = await fetch('/api/invites/pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        // In development, return mock response
        if (process.env.NODE_ENV === 'development') {
          response = new Response(JSON.stringify([]), {
            status: 200,
            statusText: 'OK',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          });
        } else {
          throw error;
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setInvites(data);
    } catch (error) {
      console.error('Fetch invites error:', error);
      toast.error('Failed to load invites');
      setInvites([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending invites on mount
  useEffect(() => {
    fetchInvites();
    // Set up polling for new invites
    const pollInterval = setInterval(fetchInvites, 30000); // Poll every 30 seconds
    return () => clearInterval(pollInterval);
  }, []);

  const sendInvite = async (email: string, role: CollaborationRole): Promise<InviteResponse> => {
    try {
      // First check if user exists
      let checkResponse: Response;
      
      try {
        checkResponse = await fetch('/api/users/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ email })
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          checkResponse = new Response(JSON.stringify({ exists: true }), {
            status: 200,
            statusText: 'OK',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          });
        } else {
          throw error;
        }
      }

      if (!checkResponse.ok) {
        if (checkResponse.status === 404) {
          return {
            success: false,
            error: `No account found for ${email}. Please ask them to create an account first.`
          };
        }
        throw new Error('Failed to verify email');
      }

      const checkData = await checkResponse.json();

      // Send invite if user exists
      let response: Response;
      
      try {
        response = await fetch('/api/invites/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            email,
            role,
            projectId: localStorage.getItem('currentProjectId')
          })
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          response = new Response(JSON.stringify({ shareUrl: 'http://localhost:3000/mock-share-url' }), {
            status: 200,
            statusText: 'OK',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          });
        } else {
          throw error;
        }
      }

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to send invite'
        };
      }

      const data = await response.json();
      await fetchInvites(); // Refresh invites list
      
      return {
        success: true,
        shareUrl: data.shareUrl
      };
    } catch (error) {
      console.error('Send invite error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  };

  const respondToInvite = async (inviteId: string, response: 'accepted' | 'rejected') => {
    try {
      let res: Response;
      
      try {
        res = await fetch(`/api/invites/${response}/${inviteId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          res = new Response(JSON.stringify({ success: true }), {
            status: 200,
            statusText: 'OK',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          });
        } else {
          throw error;
        }
      }

      if (!res.ok) throw new Error('Failed to respond to invite');

      // Update local state
      setInvites(prevInvites => 
        prevInvites.filter(invite => invite._id !== inviteId)
      );

      toast.success(`Invite ${response} successfully`);
      
      // If accepted, you might want to refresh the projects list
      if (response === 'accepted') {
        // Emit an event that the main app can listen to
        window.dispatchEvent(new CustomEvent('projectsUpdated'));
      }
    } catch (error) {
      console.error('Respond to invite error:', error);
      toast.error(`Failed to ${response} invite`);
    }
  };

  return {
    invites,
    loading,
    sendInvite,
    respondToInvite,
    refreshInvites: fetchInvites
  };
};