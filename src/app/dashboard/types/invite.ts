import { toast } from 'sonner';

export enum CollaborationRole {
  VIEWER = 'viewer',
  COMMENTATOR = 'commentator',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface Invite {
  _id: string;
  inviterId: string;
  inviteeEmail: string;
  projectId: {
    title: string;
    _id: string;
  };
  status: InviteStatus;
  role: CollaborationRole;
  inviterName: string;
}

export interface InviteData {
  inviteeEmail?: string;
  inviteeUsername?: string;
  role?: CollaborationRole;
}
