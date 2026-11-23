/**
 * XTREME Concierge Types - Staff & Operational Assignments
 */

export type AssignmentStatus =
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'INCIDENT_REPORTED';

export interface StaffAssignment {
  id: string;
  bookingReference: string;
  title: string;
  customerName: string;
  customerPhone: string;
  pickupTime: string;
  pickupLocation: string;
  destination: string;
  vehicleAssigned: string;
  vehiclePlate: string;
  passengerCount: number;
  specialInstructions?: string;
  assignmentStatus: AssignmentStatus;
  bookingStatus: string;
  notes?: string[];
}

export interface StaffIssueReport {
  assignmentId: string;
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  category: 'TRAFFIC' | 'VEHICLE_ISSUE' | 'CLIENT_DELAY' | 'ROUTE_CHANGE' | 'OTHER';
  description: string;
  timestamp: string;
}
