/**
 * XTREME Concierge Types - Services & Catalog
 */

export type CurrencyCode = 'XOF' | 'EUR' | 'USD';

export type BookingMode = 'INSTANT' | 'REQUEST_TO_BOOK' | 'CONCIERGE_REQUEST';

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface ServiceLocation {
  id: string;
  city: string;
  region: string;
  country: string;
  airportCode?: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  tagline: string;
  description: string;
  destination: string;
  currency: CurrencyCode;
  displayPrice: number | null; // null for concierge quotes
  priceUnit: 'PER_TRIP' | 'PER_DAY' | 'PER_HOUR' | 'CUSTOM_QUOTE';
  bookingMode: BookingMode;
  imageUrl?: string;
  features: string[];
  vehicleModel?: string;
  capacity?: number;
}
