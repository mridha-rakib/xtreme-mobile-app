/**
 * XTREME Concierge Types - Bookings & Payments
 *
 * Compliance: Final SRS v1.1 & Booking State Machine Authority:
 * - Approved Mobile MVP Payment Model: Exclusively Stripe (Credit/Debit Card via Stripe Payment Sheet).
 * - Independent Booking & Payment States: Payment authorization does not authoritatively mutate vendor operational state.
 */

import type { BookingMode, CurrencyCode } from './services';

export type BookingStatus =
  | 'DRAFT'
  | 'PENDING_VENDOR'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

/** Approved payment method for Mobile MVP under Final SRS v1.1 */
export type PaymentMethodType = 'STRIPE_CARD';

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'REQUIRES_ACTION'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export type PaymentPurpose = 'FULL' | 'DEPOSIT' | 'BALANCE';

export type RequestResolutionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

export interface BookingModificationRecord {
  id: string;
  bookingId: string;
  requestedChanges: string;
  reason?: string;
  status: RequestResolutionStatus;
  createdAt: string;
}

export interface BookingCancellationRecord {
  id: string;
  bookingId: string;
  reason?: string;
  status: RequestResolutionStatus;
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  reference: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  bookingMode: BookingMode;
  status: BookingStatus;
  date: string;
  time?: string;
  schedule?: string;
  pickupLocation: string;
  dropoffLocation?: string;
  passengers: number;
  quantity?: number;
  luggageCount?: number;
  currency: CurrencyCode;
  amount: number;
  depositAmount?: number;
  remainingBalance?: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethodType;
  paymentPurpose?: PaymentPurpose;
  paymentReference?: string;
  assignedStaffId?: string;
  notes?: string;
  modificationRequest?: BookingModificationRecord;
  cancellationRequest?: BookingCancellationRecord;
  createdAt: string;
}

export interface BookingModificationRequest {
  bookingId: string;
  requestedDate?: string;
  requestedTime?: string;
  requestedPickup?: string;
  requestedChanges?: string;
  reason?: string;
}

export interface BookingCancellationRequest {
  bookingId: string;
  reason?: string;
  agreedToPolicy?: boolean;
}

/**
 * Shared in-flight booking draft preserved across the booking journey
 */
export interface BookingDraft {
  id?: string;
  serviceId: string;
  serviceName: string;
  bookingMode: BookingMode;
  category?: string;
  location?: string;
  pickupLocation: string;
  dropoffLocation?: string;
  passengers: number;
  quantity?: number;
  luggageCount?: number;
  date: string;
  time: string;
  schedule?: string;
  reference: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  currency: CurrencyCode;
  amount: number;
  depositAmount?: number;
  remainingBalance?: number;
  notes?: string;
  configuredFields?: Record<string, string>;
}
