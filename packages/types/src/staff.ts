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
  | 'INCIDENT_REPORTED'
  | 'UNABLE_TO_COMPLETE';

export interface StaffAssignment {
  id: string;
  bookingReference: string;
  title: string;
  serviceName?: string;
  customerName: string;
  customerPhone: string;
  pickupTime: string;
  schedule?: string;
  pickupLocation: string;
  destination: string;
  vehicleAssigned: string;
  vehiclePlate: string;
  passengerCount: number;
  flightNumber?: string;
  driverName?: string;
  driverId?: string;
  specialInstructions?: string;
  assignmentStatus: AssignmentStatus;
  bookingStatus: string;
  notes?: string[];
  date?: string;
  isToday?: boolean;
  isUpcoming?: boolean;
  isHistory?: boolean;
}

export type StaffIssueCategory =
  | 'TRAFFIC'
  | 'VEHICLE_ISSUE'
  | 'CLIENT_DELAY'
  | 'ROUTE_CHANGE'
  | 'WEATHER_CONDITIONS'
  | 'SECURITY_CONCERN'
  | 'OTHER';

export type StaffIssueVisibilityScope = 'OPERATIONS_ONLY' | 'CLIENT_VISIBLE' | 'DISPATCH_PROTOCOL';

export type StaffIssueOutcome =
  | 'CONTINUE_AS_PLANNED'
  | 'DELAY_ANTICIPATED'
  | 'REROUTE_REQUIRED'
  | 'UNABLE_TO_COMPLETE';

export interface StaffIssueReport {
  id: string;
  assignmentId: string;
  category?: StaffIssueCategory;
  severity?: 'LOW' | 'MEDIUM' | 'CRITICAL';
  issueContext?: string;
  visibilityScope?: StaffIssueVisibilityScope | string;
  assignmentOutcome?: StaffIssueOutcome | string;
  description: string;
  timestamp: string;
  reportedBy?: string;
}
