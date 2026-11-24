/**
 * XTREME Concierge Types - Concierge Requests & Conversations
 */

export type ConciergeRequestStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'PROPOSAL_READY'
  | 'ACCEPTED'
  | 'DECLINED';

export interface ConciergeRequestRecord {
  id: string;
  reference: string;
  customerId: string;
  title: string;
  type?: string;
  details: string;
  tripContext?: string;
  serviceContext?: string;
  startDate?: string;
  endDate?: string;
  guestCount?: number;
  budgetNotes?: string;
  status: ConciergeRequestStatus;
  createdAt: string;
  updatedAt?: string;
  conversationId?: string;
}

export interface ConciergeMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  isStaff: boolean;
  content: string;
  timestamp: string;
}

export interface ConciergeConversation {
  id: string;
  requestId?: string;
  subject: string;
  lastMessageSnippet: string;
  lastUpdated: string;
  unreadCount: number;
  status?: 'NEW' | 'READ';
}
