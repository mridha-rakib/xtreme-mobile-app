/**
 * XTREME Concierge Types - Concierge Requests & Conversations
 */

export type ConciergeRequestStatus =
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
  details: string;
  startDate?: string;
  endDate?: string;
  guestCount?: number;
  budgetNotes?: string;
  status: ConciergeRequestStatus;
  createdAt: string;
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
}
