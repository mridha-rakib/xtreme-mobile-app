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

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

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
  pickupLocation: string;
  dropoffLocation?: string;
  passengers: number;
  luggageCount?: number;
  currency: CurrencyCode;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethodType;
  assignedStaffId?: string;
  notes?: string;
  createdAt: string;
}

export interface BookingModificationRequest {
  bookingId: string;
  requestedDate?: string;
  requestedTime?: string;
  requestedPickup?: string;
  reason: string;
}

export interface BookingCancellationRequest {
  bookingId: string;
  reason: string;
  agreedToPolicy: boolean;
}

/**
 * Shared in-flight booking draft preserved across the 5-screen booking journey
 * (CUS-BKG-01 -> CUS-BKG-02 -> CUS-BKG-03 -> CUS-BKG-04 -> CUS-BKG-05 / CUS-BKG-06)
 */
export interface BookingDraft {
  serviceId: string;
  serviceName: string;
  bookingMode: BookingMode;
  category: string;
  location: string;
  pickupLocation: string;
  dropoffLocation?: string;
  passengers: number;
  luggageCount: number;
  date: string;
  time: string;
  reference: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  currency: CurrencyCode;
  amount: number;
  notes?: string;
}
