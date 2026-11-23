/**
 * XTREME Concierge Types - Authentication & User Profile
 */

export type UserRole = 'customer' | 'driver' | 'operations' | 'admin';

export type LanguageCode = 'fr' | 'en';

export interface UserProfile {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredLanguage: LanguageCode;
  city: string;
  avatarUrl?: string;
  vipTier?: 'STANDARD' | 'PREMIUM' | 'BLACK_CARD';
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  authToken: string | null;
}

/** Configurable OTP verification parameters - not hardcoded to fixed length */
export interface OtpConfig {
  minLength: number;
  maxLength: number;
  allowAlphanumeric?: boolean;
}

export const DEFAULT_OTP_CONFIG: OtpConfig = {
  minLength: 4,
  maxLength: 8,
  allowAlphanumeric: false,
};

export interface PhoneOtpVerificationRequest {
  phone: string;
  countryCode: string; // e.g. +221
  otpCode: string;
}

export interface PasswordResetRequest {
  method: 'phone' | 'email';
  destination: string;
}

export type DemoPersona = 'customer' | 'driver' | 'operations';

export type DemoScenario = 'success' | 'failure' | 'pending' | 'cancelled';

export interface DemoState {
  isDemoMode: boolean;
  activePersona: DemoPersona;
  scenario: DemoScenario;
  selectedResourceIds: {
    bookingId: string;
    tripId: string;
    serviceId: string;
    conversationId: string;
    assignmentId: string;
  };
}
