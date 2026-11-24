/**
 * XTREME Concierge - Realistic Fictional Senegal Mock Data
 *
 * MANDATORY PRIVACY NOTICE:
 * All records, identities, phone numbers, and addresses are completely fictional
 * and strictly for prototype/demo purposes. Never use real client data.
 */

import type {
  AssignmentStatus,
  BookingDraft,
  BookingRecord,
  CommandCenterRole,
  CommandCenterUser,
  ConciergeConversation,
  ConciergeMessage,
  ConciergeRequestRecord,
  CurrencyCode,
  ServiceCategory,
  ServiceItem,
  ServiceLocation,
  StaffAssignment,
  StaffIssueReport,
  TripItinerary,
  UserProfile,
} from '@xtreme/types';

export const sampleCustomer: UserProfile = {
  id: 'demo-cus-001',
  role: 'customer',
  firstName: 'Amadou',
  lastName: 'Diop',
  email: 'amadou.diop.demo@example.com',
  phone: '+221 77 000 1234',
  preferredLanguage: 'fr',
  city: 'Dakar',
  vipTier: 'BLACK_CARD',
  createdAt: '2026-01-15T09:00:00Z',
};

export const sampleStaffUser: UserProfile = {
  id: 'demo-stf-001',
  role: 'driver',
  firstName: 'Moussa',
  lastName: 'Camara',
  email: 'moussa.camara.staff@example.com',
  phone: '+221 78 999 5678',
  preferredLanguage: 'fr',
  city: 'Dakar',
  createdAt: '2025-11-01T10:00:00Z',
};

export const sampleDriver: UserProfile = sampleStaffUser;

export const sampleOperationsUser: UserProfile = {
  id: 'demo-stf-ops-001',
  role: 'operations',
  firstName: 'Fatou',
  lastName: 'Sall',
  email: 'fatou.sall.ops@example.com',
  phone: '+221 76 555 8899',
  preferredLanguage: 'fr',
  city: 'Dakar',
  createdAt: '2025-10-15T08:00:00Z',
};

export const samplePersonas = {
  customer: sampleCustomer,
  driver: sampleDriver,
  operations: sampleOperationsUser,
} as const;

export const DEFAULT_DEMO_IDS = {
  bookingId: 'bkg-demo-001',
  tripId: 'trip-demo-001',
  serviceId: 'svc-airport-fasttrack',
  conversationId: 'conv-demo-001',
  assignmentId: 'demo-asg-001',
} as const;

export const sampleLocations: ServiceLocation[] = [
  { id: 'loc-dkr-aibd', city: 'Dakar', region: 'Diass', country: 'Senegal', airportCode: 'DSS' },
  { id: 'loc-dkr-alm', city: 'Dakar', region: 'Almadies', country: 'Senegal' },
  { id: 'loc-dkr-plt', city: 'Dakar', region: 'Plateau', country: 'Senegal' },
  { id: 'loc-saly', city: 'Saly Portudal', region: 'Thiès', country: 'Senegal' },
  { id: 'loc-somone', city: 'Somone', region: 'Petite-Côte', country: 'Senegal' },
  { id: 'loc-stl', city: 'Saint-Louis', region: 'Saint-Louis', country: 'Senegal' },
  {
    id: 'loc-cap',
    city: 'Cap Skirring',
    region: 'Ziguinchor',
    country: 'Senegal',
    airportCode: 'CSK',
  },
];

export const sampleCategories: ServiceCategory[] = [
  {
    id: 'cat-airport',
    slug: 'airport-transfer',
    name: 'Airport Transfer',
    description: 'Comfortable & reliable transfers',
    iconName: 'plane-car',
    displayOrder: 1,
  },
  {
    id: 'cat-luxury-cars',
    slug: 'luxury-cars',
    name: 'Luxury Cars',
    description: 'Premium vehicles for every occasion',
    iconName: 'car-luxury',
    displayOrder: 2,
  },
  {
    id: 'cat-villas',
    slug: 'villas',
    name: 'Villas',
    description: 'Handpicked stays around the world',
    iconName: 'villa',
    displayOrder: 3,
  },
  {
    id: 'cat-yachts',
    slug: 'yachts',
    name: 'Yachts',
    description: 'Private charters & unforgettable time',
    iconName: 'yacht',
    displayOrder: 4,
  },
  {
    id: 'cat-activities',
    slug: 'activities',
    name: 'Activities',
    description: 'Curated experiences and local adventures',
    iconName: 'compass',
    displayOrder: 5,
  },
  {
    id: 'cat-nightlife',
    slug: 'nightlife',
    name: 'Nightlife',
    description: 'Top venues & exclusive access',
    iconName: 'glass',
    displayOrder: 6,
  },
];

export const sampleServices: ServiceItem[] = [
  {
    id: 'svc-airport-fasttrack',
    categoryId: 'cat-airport',
    name: 'Blaise Diagne VIP Fast-Track & Chauffeur',
    tagline: 'VIP lounge access, tarmac escort, and Mercedes S-Class transfer',
    description:
      'Skip all lines at DSS Blaise Diagne International Airport. Our protocol officer meets you upon exit, manages customs and luggage, and seats you directly into your waiting luxury vehicle.',
    destination: 'Blaise Diagne (DSS) → Dakar Almadies/Plateau',
    currency: 'XOF',
    displayPrice: 95000,
    priceUnit: 'PER_TRIP',
    bookingMode: 'INSTANT',
    vehicleModel: 'Mercedes-Benz S-Class S580',
    capacity: 3,
    features: [
      'Fast-track customs & immigration',
      'VIP lounge access',
      'Bottled mineral water & Wi-Fi',
      'Bilingual English/French chauffeur',
    ],
  },
  {
    id: 'svc-chauffeur-daily',
    categoryId: 'cat-luxury-cars',
    name: 'Executive Chauffeur Full-Day (Dakar)',
    tagline: 'Dedicated Range Rover Autobiography at your disposal (10h)',
    description:
      'Enjoy complete flexibility throughout Dakar, Almadies, Ngor, and Plateau with an executive chauffeur committed exclusively to your schedule.',
    destination: 'Dakar & Environs',
    currency: 'XOF',
    displayPrice: 220000,
    priceUnit: 'PER_DAY',
    bookingMode: 'INSTANT',
    vehicleModel: 'Range Rover Autobiography',
    capacity: 4,
    features: [
      '10 hours dedicated chauffeur service',
      'Unlimited mileage within Dakar',
      'Fuel and parking included',
      'Mineral water & refreshments',
    ],
  },
  {
    id: 'svc-villa-almadies',
    categoryId: 'cat-villas',
    name: 'Villa Teranga Waterfront Estate',
    tagline: 'Private oceanfront villa with infinity pool & dedicated staff',
    description:
      'Spectacular modernist villa directly overlooking the Atlantic Ocean in Les Almadies. Features private chef service, 24/7 security, butler, and lush tropical gardens.',
    destination: 'Les Almadies, Dakar',
    currency: 'XOF',
    displayPrice: 650000,
    priceUnit: 'PER_DAY',
    bookingMode: 'REQUEST_TO_BOOK',
    capacity: 8,
    features: [
      '5 Ocean-view master suites',
      'Dedicated private chef & housekeeping',
      'Heated oceanfront infinity pool',
      'Private security team on-site',
    ],
  },
  {
    id: 'svc-yacht-madeleine',
    categoryId: 'cat-yachts',
    name: 'Private Yacht Charter - Îles de la Madeleine',
    tagline: 'Half-day private luxury cruise along the Dakar coastline',
    description:
      'Set sail from the Marina of Dakar toward the volcanic archipelago of Îles de la Madeleine with private crew, champagne, and fresh seafood tasting.',
    destination: 'Dakar Marina / Îles de la Madeleine',
    currency: 'XOF',
    displayPrice: 450000,
    priceUnit: 'PER_TRIP',
    bookingMode: 'REQUEST_TO_BOOK',
    capacity: 8,
    features: [
      'Professional skipper & host',
      'Champagne & curated appetizers',
      'Snorkeling equipment',
      'Bespoke music sound system',
    ],
  },
  {
    id: 'svc-curated-goree',
    categoryId: 'cat-activities',
    name: 'Exclusive Gorée Island Cultural Odyssey',
    tagline: 'Private boat crossing & master historian guided walkthrough',
    description:
      'Experience the solemn depth and vibrant artisan life of Gorée Island with exclusive access to private artist workshops, historical archives, and sea-view dining.',
    destination: 'Gorée Island, Dakar',
    currency: 'XOF',
    displayPrice: 160000,
    priceUnit: 'PER_TRIP',
    bookingMode: 'INSTANT',
    capacity: 6,
    features: [
      'Private motorboat crossing (avoid ferry queues)',
      'Certified master historian guide',
      'Artisan studio private tasting',
      'Bilingual French/English service',
    ],
  },
  {
    id: 'svc-nightlife-almadies',
    categoryId: 'cat-nightlife',
    name: 'VIP Almadies Lounge & Private Table Access',
    tagline: 'Guaranteed premium table, bottle service & priority escort',
    description:
      'Experience premier nightlife at Dakar’s top beachfront venues with reserved VIP booth seating, dedicated security escort, and personalized bottle service.',
    destination: 'Corniche des Almadies, Dakar',
    currency: 'XOF',
    displayPrice: 300000,
    priceUnit: 'PER_TRIP',
    bookingMode: 'REQUEST_TO_BOOK',
    capacity: 6,
    features: [
      'Direct VIP entry without waiting',
      'Prime ocean-terrace table placement',
      'Dedicated host & bottle presentation',
      'Private security vehicle escort upon departure',
    ],
  },
  {
    id: 'svc-trip-bespoke',
    categoryId: 'cat-activities',
    name: 'Plan My Entire Trip (Senegal Grand Luxury)',
    tagline: 'Custom multi-day curation by senior destination concierge',
    description:
      'Let our executive concierge orchestrate your full itinerary across Dakar, Saint-Louis, and the Petite-Côte with luxury stays, private security, aviation, and culinary bookings.',
    destination: 'Senegal Nationwide',
    currency: 'XOF',
    displayPrice: null,
    priceUnit: 'CUSTOM_QUOTE',
    bookingMode: 'CONCIERGE_REQUEST',
    features: [
      'Dedicated 24/7 concierge direct line',
      'Custom itinerary proposal within 24h',
      'Priority access to VIP partners',
      'Personal operational lead on-site',
    ],
  },
];

export const sampleBookings: BookingRecord[] = [
  {
    id: 'bkg-demo-001',
    reference: 'XT-DKR-2026-081',
    customerId: 'demo-cus-001',
    serviceId: 'svc-airport-fasttrack',
    serviceName: 'Blaise Diagne VIP Fast-Track & Chauffeur',
    bookingMode: 'INSTANT',
    status: 'CONFIRMED',
    date: '2026-12-05',
    time: '14:30',
    pickupLocation: 'Blaise Diagne Airport (DSS)',
    dropoffLocation: 'Radisson Blu Hotel, Dakar Sea Plaza',
    passengers: 2,
    luggageCount: 3,
    currency: 'XOF',
    amount: 95000,
    paymentStatus: 'SUCCEEDED',
    paymentMethod: 'STRIPE_CARD',
    assignedStaffId: 'demo-stf-001',
    notes: 'Flight Air France AF718 arrival at 14:15. VIP passenger with 3 priority bags.',
    createdAt: '2026-11-20T10:14:00Z',
  },
  {
    id: 'bkg-demo-002',
    reference: 'XT-DKR-2026-082',
    customerId: 'demo-cus-001',
    serviceId: 'svc-yacht-madeleine',
    serviceName: 'Private Yacht Charter - Îles de la Madeleine',
    bookingMode: 'REQUEST_TO_BOOK',
    status: 'PENDING_VENDOR',
    date: '2026-12-07',
    time: '11:00',
    pickupLocation: 'Marina de Dakar',
    dropoffLocation: 'Marina de Dakar',
    passengers: 6,
    currency: 'XOF',
    amount: 450000,
    paymentStatus: 'PENDING',
    paymentMethod: 'STRIPE_CARD',
    notes: 'Requested champagne selection: Laurent-Perrier Cuvée Rosé.',
    createdAt: '2026-11-22T16:45:00Z',
  },
  {
    id: 'bkg-demo-003',
    reference: 'XT-DKR-2026-079',
    customerId: 'demo-cus-001',
    serviceId: 'svc-chauffeur-daily',
    serviceName: 'Executive Chauffeur Full-Day (Dakar)',
    bookingMode: 'INSTANT',
    status: 'COMPLETED',
    date: '2026-11-18',
    time: '08:00',
    pickupLocation: 'Almadies, Villa 14',
    dropoffLocation: 'Plateau Financial District',
    passengers: 1,
    currency: 'XOF',
    amount: 220000,
    paymentStatus: 'SUCCEEDED',
    paymentMethod: 'STRIPE_CARD',
    assignedStaffId: 'demo-stf-001',
    createdAt: '2026-11-15T11:20:00Z',
  },
  {
    id: 'bkg-demo-004',
    reference: 'XT-DKR-2026-080',
    customerId: 'demo-cus-001',
    serviceId: 'svc-chauffeur-daily',
    serviceName: 'Almadies Presidential Chauffeur Escort',
    bookingMode: 'INSTANT',
    status: 'IN_PROGRESS',
    date: '2026-11-24',
    time: '09:00',
    pickupLocation: 'Villa des Almadies, Route de la Corniche',
    dropoffLocation: 'Plateau Diplomatic Enclave',
    passengers: 2,
    luggageCount: 1,
    currency: 'XOF',
    amount: 180000,
    paymentStatus: 'SUCCEEDED',
    paymentMethod: 'STRIPE_CARD',
    assignedStaffId: 'demo-stf-001',
    notes: 'Diplomatic delegation transit with priority police escort.',
    createdAt: '2026-11-23T18:00:00Z',
  },
  {
    id: 'bkg-demo-005',
    reference: 'XT-DKR-2026-078',
    customerId: 'demo-cus-001',
    serviceId: 'svc-villa-almadies',
    serviceName: 'Villa Somone Private Chef & Concierge',
    bookingMode: 'REQUEST_TO_BOOK',
    status: 'CANCELLED',
    date: '2026-11-10',
    time: '12:00',
    pickupLocation: 'Somone Lagoon Waterfront Villa',
    passengers: 4,
    currency: 'XOF',
    amount: 320000,
    paymentStatus: 'REFUNDED',
    paymentMethod: 'STRIPE_CARD',
    notes: 'Cancelled within approved policy window. Full refund executed.',
    createdAt: '2026-11-05T09:30:00Z',
  },
];

/**
 * Shared in-flight booking draft store across the continuous booking journey
 */
const INITIAL_BOOKING_DRAFT: BookingDraft = {
  serviceId: 'svc-airport-fasttrack',
  serviceName: 'Blaise Diagne VIP Fast-Track & Chauffeur',
  bookingMode: 'INSTANT',
  category: 'Airport Transfer',
  location: 'Blaise Diagne (DSS) → Almadies',
  pickupLocation: 'Blaise Diagne Airport, VIP Terminal',
  dropoffLocation: 'Almadies / Ngor Beach, Dakar',
  passengers: 2,
  quantity: 2,
  luggageCount: 2,
  date: '2026-12-05',
  time: '14:30 GMT',
  schedule: '2026-12-05 • 14:30 GMT',
  reference: 'XT-DKR-2026-081',
  status: 'CONFIRMED',
  paymentStatus: 'PENDING',
  currency: 'XOF',
  amount: 95000,
  depositAmount: 47500,
  remainingBalance: 47500,
  notes: '',
};

let currentBookingDraft: BookingDraft = { ...INITIAL_BOOKING_DRAFT };

export function getBookingDraft(): BookingDraft {
  return { ...currentBookingDraft };
}

export function updateBookingDraft(partial: Partial<BookingDraft>): BookingDraft {
  currentBookingDraft = {
    ...currentBookingDraft,
    ...partial,
  };
  return { ...currentBookingDraft };
}

export function resetBookingDraft(): BookingDraft {
  currentBookingDraft = { ...INITIAL_BOOKING_DRAFT };
  return { ...currentBookingDraft };
}

/**
 * Live Frontend Booking Repository
 * Allows submitted mock bookings to immediately appear in My Bookings,
 * resolve by exact ID in Booking Detail, and undergo modification/cancellation.
 */
let liveBookings: BookingRecord[] = [...sampleBookings];
let bookingReferenceSequence = 85;

export function getAllBookings(): BookingRecord[] {
  return [...liveBookings];
}

export function getBookingById(idOrRef: string): BookingRecord | undefined {
  return liveBookings.find((b) => b.id === idOrRef || b.reference === idOrRef);
}

export function generateBookingReference(customSeq?: number): string {
  const seq = customSeq ?? ++bookingReferenceSequence;
  return `XT-DKR-2026-${String(seq).padStart(3, '0')}`;
}

export function addBooking(booking: BookingRecord): BookingRecord {
  liveBookings = [booking, ...liveBookings.filter((b) => b.id !== booking.id)];
  return booking;
}

export function updateBooking(
  idOrRef: string,
  partial: Partial<BookingRecord>,
): BookingRecord | undefined {
  const index = liveBookings.findIndex((b) => b.id === idOrRef || b.reference === idOrRef);
  if (index === -1) return undefined;
  liveBookings[index] = { ...liveBookings[index], ...partial };
  return liveBookings[index];
}

export function resolveCancellationRequest(
  bookingId: string,
  resolution: 'APPROVED' | 'REJECTED',
): BookingRecord | undefined {
  const booking = getBookingById(bookingId);
  if (!booking?.cancellationRequest) return undefined;

  const updatedCancellation = {
    ...booking.cancellationRequest,
    status: resolution,
  };

  const updatedStatus = resolution === 'APPROVED' ? 'CANCELLED' : booking.status;
  return updateBooking(bookingId, {
    status: updatedStatus,
    cancellationRequest: updatedCancellation,
  });
}

export function resolveModificationRequest(
  bookingId: string,
  resolution: 'APPROVED' | 'REJECTED',
): BookingRecord | undefined {
  const booking = getBookingById(bookingId);
  if (!booking?.modificationRequest) return undefined;

  const updatedMod = {
    ...booking.modificationRequest,
    status: resolution,
  };

  return updateBooking(bookingId, {
    modificationRequest: updatedMod,
  });
}

export const EXCHANGE_RATES_TO_XOF = {
  XOF: 1,
  EUR: 655.957,
  USD: 610.0,
} as const;

export function convertFromBaseXof(
  baseAmountXof: number,
  targetCurrency: CurrencyCode,
): { amount: number; rate: number; isConverted: boolean } {
  if (targetCurrency === 'XOF') {
    return { amount: baseAmountXof, rate: 1, isConverted: false };
  }
  const rate = EXCHANGE_RATES_TO_XOF[targetCurrency as keyof typeof EXCHANGE_RATES_TO_XOF] || 1;
  return {
    amount: Math.round(baseAmountXof / rate),
    rate,
    isConverted: true,
  };
}

export function resetBookings(): void {
  liveBookings = [...sampleBookings];
  bookingReferenceSequence = 85;
  currentBookingDraft = { ...INITIAL_BOOKING_DRAFT };
}

export const sampleTrips: TripItinerary[] = [
  {
    id: 'trip-demo-001',
    reference: 'TRIP-SN-2026-001',
    title: 'Senegal Atlantic Heritage & Luxury Retreat',
    destination: 'Dakar • Gorée • Somone • Saly',
    startDate: '2026-12-05',
    endDate: '2026-12-09',
    status: 'ACTIVE',
    days: [
      {
        dayNumber: 1,
        date: '2026-12-05',
        title: 'VIP Arrival & Oceanfront Check-in',
        stops: [
          {
            id: 'stop-1-1',
            time: '14:30',
            title: 'Blaise Diagne VIP Fast-Track & Transfer',
            location: 'Blaise Diagne Airport (DSS)',
            description: 'Tarmac reception and S-Class transfer to Almadies luxury residence',
            category: 'TRANSFER',
          },
          {
            id: 'stop-1-2',
            time: '20:00',
            title: 'Private Welcome Dinner',
            location: 'L’Alkimia, Almadies',
            description: 'Curated tasting menu with ocean view',
            category: 'DINING',
          },
        ],
      },
      {
        dayNumber: 2,
        date: '2026-12-06',
        title: 'Gorée Island Private Heritage Tour',
        stops: [
          {
            id: 'stop-2-1',
            time: '09:30',
            title: 'Private Boat to Gorée Island',
            location: 'Embarcadère de Dakar',
            description: 'Exclusive private crossing with expert historian guide',
            category: 'EXCURSION',
          },
        ],
      },
    ],
  },
  {
    id: 'trip-demo-002',
    reference: 'TRIP-SN-2026-002',
    title: 'Lac Rose & Desert Safari Expedition',
    destination: 'Dakar • Lac Rose • Lompoul',
    startDate: '2026-12-12',
    endDate: '2026-12-14',
    status: 'ACTIVE',
    days: [
      {
        dayNumber: 1,
        date: '2026-12-12',
        title: 'Helicopter Transfer & Pink Lake Quad Safari',
        stops: [
          {
            id: 'stop-2-1',
            time: '10:30',
            title: 'Helicopter Departure from DSS',
            location: 'Blaise Diagne VIP Pavilion',
            description: 'Airbus H130 flight to private helipad near Lac Rose',
            category: 'TRANSFER',
          },
          {
            id: 'stop-2-2',
            time: '14:00',
            title: 'Dunes & Salt Lake Quad Safari',
            location: 'Lac Rose Sand Dunes',
            description: 'Private guided quad ride over historic Paris-Dakar dunes',
            category: 'EXCURSION',
          },
        ],
      },
      {
        dayNumber: 2,
        date: '2026-12-13',
        title: 'Lompoul Desert Luxury Bivouac',
        stops: [
          {
            id: 'stop-2-3',
            time: '11:00',
            title: 'Lompoul Desert Oasis Arrival',
            location: 'Lompoul Desert Lodge',
            description: 'Luxury tented camp check-in with Berber hospitality',
            category: 'ACCOMMODATION',
          },
          {
            id: 'stop-2-4',
            time: '19:30',
            title: 'Stargazing Dinner & Traditional Music',
            location: 'Desert Camp Amphitheatre',
            description: 'Candlelit Saharan dining under the Sahel stars',
            category: 'DINING',
          },
        ],
      },
      {
        dayNumber: 3,
        date: '2026-12-14',
        title: 'Chauffeur Return to Dakar',
        stops: [
          {
            id: 'stop-2-5',
            time: '10:00',
            title: 'VIP Chauffeur Transfer to Plateau',
            location: 'Dakar Plateau Residence',
            description: 'Comfortable Range Rover return transfer via coastal highway',
            category: 'TRANSFER',
          },
        ],
      },
    ],
  },
  {
    id: 'trip-demo-003',
    reference: 'TRIP-SN-2026-003',
    title: 'Cap Skirring Coastal Getaway',
    destination: 'Casamance • Cap Skirring',
    startDate: '2026-11-10',
    endDate: '2026-11-15',
    status: 'COMPLETED',
    days: [
      {
        dayNumber: 1,
        date: '2026-11-10',
        title: 'Private Flight to Cap Skirring',
        stops: [
          {
            id: 'stop-3-1',
            time: '11:00',
            title: 'Executive Air Charter Arrival',
            location: 'Cap Skirring Airport (CSK)',
            description: 'VIP tarmac welcome and private villa transfer',
            category: 'TRANSFER',
          },
          {
            id: 'stop-3-2',
            time: '14:00',
            title: 'Beachfront Villa Check-in',
            location: 'Cap Skirring Ocean Villa',
            description: 'Private Atlantic oceanfront villa with butler service',
            category: 'ACCOMMODATION',
          },
        ],
      },
      {
        dayNumber: 2,
        date: '2026-11-11',
        title: 'Casamance Mangrove Pirogue Tour',
        stops: [
          {
            id: 'stop-3-3',
            time: '09:30',
            title: 'Bolongs Mangrove Guided Cruise',
            location: 'Karabane Island Estuary',
            description: 'Scenic exploration of Casamance river channels and bird sanctuary',
            category: 'EXCURSION',
          },
          {
            id: 'stop-3-4',
            time: '13:00',
            title: 'Fresh Seafood Tasting Lunch',
            location: 'Island Fisherman Pavilion',
            description: 'Grilled local oysters and fresh Atlantic barracuda tasting',
            category: 'DINING',
          },
        ],
      },
      {
        dayNumber: 3,
        date: '2026-11-12',
        title: 'Return Executive Flight to Dakar',
        stops: [
          {
            id: 'stop-3-5',
            time: '16:00',
            title: 'Executive Air Charter Departure',
            location: 'Cap Skirring Airport (CSK)',
            description: 'Private charter flight back to Blaise Diagne VIP Terminal',
            category: 'TRANSFER',
          },
        ],
      },
    ],
  },
];

/**
 * Live Frontend Trips Repository
 */
let liveTrips: TripItinerary[] = [...sampleTrips];

export function getAllTrips(): TripItinerary[] {
  return [...liveTrips];
}

export function getTripById(id: string): TripItinerary | undefined {
  return liveTrips.find((t) => t.id === id || t.reference === id);
}

export function resetTrips(): void {
  liveTrips = [...sampleTrips];
}

/**
 * Live Frontend Customer Profile Store
 */
let liveCustomerProfile: UserProfile = { ...sampleCustomer };
type ProfileListener = (profile: UserProfile) => void;
const profileListeners: Set<ProfileListener> = new Set();

export function getCustomerProfile(): UserProfile {
  return { ...liveCustomerProfile };
}

export function updateCustomerProfile(partial: Partial<UserProfile>): UserProfile {
  liveCustomerProfile = { ...liveCustomerProfile, ...partial };
  profileListeners.forEach((fn) => {
    fn({ ...liveCustomerProfile });
  });
  return { ...liveCustomerProfile };
}

export function subscribeCustomerProfile(listener: ProfileListener): () => void {
  profileListeners.add(listener);
  return () => profileListeners.delete(listener);
}

export function resetCustomerProfile(): void {
  liveCustomerProfile = { ...sampleCustomer };
  profileListeners.forEach((fn) => {
    fn({ ...liveCustomerProfile });
  });
}

export const sampleConciergeRequests: ConciergeRequestRecord[] = [
  {
    id: 'req-con-001',
    reference: 'CR-2026-9042',
    customerId: 'demo-cus-001',
    title: 'Concierge Request 1',
    type: 'PLAN_TRIP',
    details:
      'VIP helicopter flight over Lake Retba (Lac Rose) and Atlantic coastline dunes with champagne lunch reception.',
    tripContext: 'Senegal Atlantic Heritage',
    serviceContext: 'Air Charter & Excursions',
    startDate: '2026-12-08',
    guestCount: 3,
    budgetNotes: 'Flexible, premium luxury tier',
    status: 'OPEN',
    createdAt: '2026-11-24T09:30:00Z',
    updatedAt: '2026-11-24T09:30:00Z',
    conversationId: 'conv-demo-001',
  },
  {
    id: 'req-con-002',
    reference: 'CR-2026-9043',
    customerId: 'demo-cus-001',
    title: 'Concierge Request 2',
    type: 'VIP_TRANSPORT',
    details:
      'Executive armored escort and presidential protocol motorcade from Blaise Diagne VIP Terminal to Dakar Plateau.',
    tripContext: 'Dakar Business Summit',
    serviceContext: 'Diplomatic & Close Protection',
    startDate: '2026-12-05',
    guestCount: 2,
    budgetNotes: 'Full executive security package',
    status: 'IN_PROGRESS',
    createdAt: '2026-11-23T14:15:00Z',
    updatedAt: '2026-11-24T08:00:00Z',
    conversationId: 'conv-demo-002',
  },
  {
    id: 'req-con-003',
    reference: 'CR-2026-9044',
    customerId: 'demo-cus-001',
    title: 'Concierge Request 3',
    type: 'VILLA_BOOKING',
    details:
      'Private 5-bedroom waterfront villa reservation in Somone Lagoon with private chef, butler, and oceanfront infinity pool.',
    tripContext: 'Somone Lagoon Retreat',
    serviceContext: 'Private Villa & Lifestyle',
    startDate: '2026-11-18',
    endDate: '2026-11-22',
    guestCount: 6,
    budgetNotes: 'Bespoke estate booking',
    status: 'COMPLETED',
    createdAt: '2026-11-18T11:00:00Z',
    updatedAt: '2026-11-22T17:00:00Z',
    conversationId: 'conv-demo-003',
  },
  {
    id: 'req-con-004',
    reference: 'CR-2026-9045',
    customerId: 'demo-cus-001',
    title: 'Concierge Request 4',
    type: 'EVENT_PLANNING',
    details:
      'Sunset catamaran yacht charter around Île de Gorée with acoustic live kora performance and tasting menu.',
    tripContext: 'Gorée Cultural Evening',
    serviceContext: 'Private Yacht Charter',
    startDate: '2026-11-15',
    guestCount: 4,
    budgetNotes: 'Private charter budget',
    status: 'CANCELLED',
    createdAt: '2026-11-15T16:20:00Z',
    updatedAt: '2026-11-16T10:00:00Z',
    conversationId: 'conv-demo-004',
  },
];

export const sampleConversations: ConciergeConversation[] = [
  {
    id: 'conv-demo-001',
    requestId: 'req-con-001',
    subject: 'Concierge Conversation',
    lastMessageSnippet:
      'Bonjour Monsieur Diop, the flight clearance for Lac Rose is confirmed for 10:30 AM.',
    lastUpdated: '10:24',
    unreadCount: 1,
    status: 'NEW',
  },
  {
    id: 'conv-demo-002',
    requestId: 'req-con-002',
    subject: 'Concierge Conversation',
    lastMessageSnippet:
      'Diplomatic protocol clearance granted. Close protection officers assigned.',
    lastUpdated: '09:15',
    unreadCount: 1,
    status: 'NEW',
  },
  {
    id: 'conv-demo-003',
    requestId: 'req-con-003',
    subject: 'Concierge Conversation',
    lastMessageSnippet: 'Chef menu approved. Butler awaiting your arrival at Somone Lagoon Villa.',
    lastUpdated: 'Yesterday',
    unreadCount: 0,
    status: 'READ',
  },
  {
    id: 'conv-demo-004',
    requestId: 'req-con-004',
    subject: 'Concierge Conversation',
    lastMessageSnippet:
      'Catamaran booking cancelled per your instruction. Deposit refund processed.',
    lastUpdated: 'Nov 16',
    unreadCount: 0,
    status: 'READ',
  },
  {
    id: 'conv-demo-005',
    subject: 'Concierge Conversation',
    lastMessageSnippet: 'Front row VIP lounge passes secured for Dakar Fashion Gala.',
    lastUpdated: 'Nov 14',
    unreadCount: 0,
    status: 'READ',
  },
  {
    id: 'conv-demo-006',
    subject: 'Concierge Conversation',
    lastMessageSnippet: 'Oceanfront sunset terrace table confirmed at L’Alkimia Almadies.',
    lastUpdated: 'Nov 12',
    unreadCount: 0,
    status: 'READ',
  },
];

export const sampleMessages: ConciergeMessage[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-demo-001',
    senderId: 'staff-ops-001',
    senderName: 'Concierge',
    isStaff: true,
    content:
      'Bonjour! How can our lifestyle management team assist with your upcoming itinerary in Dakar?',
    timestamp: '10:20',
  },
  {
    id: 'msg-002',
    conversationId: 'conv-demo-001',
    senderId: 'demo-cus-001',
    senderName: 'You',
    isStaff: false,
    content:
      'Could you arrange a private helicopter flight to Lac Rose and desert dunes this weekend?',
    timestamp: '10:21',
  },
  {
    id: 'msg-003',
    conversationId: 'conv-demo-001',
    senderId: 'staff-ops-001',
    senderName: 'Concierge',
    isStaff: true,
    content:
      'Certainly. We have Airbus H130 availability departing directly from DSS VIP Pavilion.',
    timestamp: '10:22',
  },
  {
    id: 'msg-004',
    conversationId: 'conv-demo-001',
    senderId: 'demo-cus-001',
    senderName: 'You',
    isStaff: false,
    content: 'Perfect, please include champagne lunch on the private dunes for 3 guests.',
    timestamp: '10:23',
  },
  {
    id: 'msg-005',
    conversationId: 'conv-demo-001',
    senderId: 'staff-ops-001',
    senderName: 'Concierge',
    isStaff: true,
    content: 'Noted with pleasure! Flight clearance for Lac Rose is confirmed for 10:30 AM.',
    timestamp: '10:24',
  },
];

/**
 * Live Frontend Concierge Repositories
 */
let liveConciergeRequests: ConciergeRequestRecord[] = [...sampleConciergeRequests];
let liveConversations: ConciergeConversation[] = [...sampleConversations];
let liveMessages: ConciergeMessage[] = [...sampleMessages];
let conciergeRefSeq = 45;

type ConciergeListener = () => void;
const conciergeListeners: Set<ConciergeListener> = new Set();

export function subscribeConcierge(listener: ConciergeListener): () => void {
  conciergeListeners.add(listener);
  return () => conciergeListeners.delete(listener);
}

function notifyConcierge(): void {
  conciergeListeners.forEach((fn) => {
    fn();
  });
}

export function getAllConciergeRequests(): ConciergeRequestRecord[] {
  return [...liveConciergeRequests];
}

export function getConciergeRequestById(idOrRef: string): ConciergeRequestRecord | undefined {
  return liveConciergeRequests.find((r) => r.id === idOrRef || r.reference === idOrRef);
}

export function generateConciergeReference(): string {
  const seq = ++conciergeRefSeq;
  return `CR-2026-${String(seq).padStart(4, '0')}`;
}

export function addConciergeRequest(request: ConciergeRequestRecord): ConciergeRequestRecord {
  liveConciergeRequests = [request, ...liveConciergeRequests.filter((r) => r.id !== request.id)];
  notifyConcierge();
  return request;
}

export function updateConciergeRequest(
  idOrRef: string,
  partial: Partial<ConciergeRequestRecord>,
): ConciergeRequestRecord | undefined {
  const index = liveConciergeRequests.findIndex((r) => r.id === idOrRef || r.reference === idOrRef);
  if (index === -1) return undefined;
  liveConciergeRequests[index] = { ...liveConciergeRequests[index], ...partial };
  notifyConcierge();
  return liveConciergeRequests[index];
}

export function getAllConversations(): ConciergeConversation[] {
  return [...liveConversations];
}

export function getConversationById(id: string): ConciergeConversation | undefined {
  return liveConversations.find((c) => c.id === id);
}

export function addConversation(conv: ConciergeConversation): ConciergeConversation {
  liveConversations = [conv, ...liveConversations.filter((c) => c.id !== conv.id)];
  notifyConcierge();
  return conv;
}

export function updateConversation(
  id: string,
  partial: Partial<ConciergeConversation>,
): ConciergeConversation | undefined {
  const index = liveConversations.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  liveConversations[index] = { ...liveConversations[index], ...partial };
  notifyConcierge();
  return liveConversations[index];
}

export function markConversationAsRead(id: string): ConciergeConversation | undefined {
  const conv = liveConversations.find((c) => c.id === id);
  if (conv) {
    conv.unreadCount = 0;
    conv.status = 'READ';
    notifyConcierge();
  }
  return conv;
}

export function getMessagesByConversationId(conversationId: string): ConciergeMessage[] {
  return liveMessages.filter((m) => m.conversationId === conversationId);
}

export function addMessage(msg: ConciergeMessage): ConciergeMessage {
  liveMessages = [...liveMessages, msg];
  // update parent conversation snippet & timestamp
  const conv = liveConversations.find((c) => c.id === msg.conversationId);
  if (conv) {
    conv.lastMessageSnippet = msg.content;
    conv.lastUpdated = msg.timestamp;
  }
  notifyConcierge();
  return msg;
}

export function resetConciergeState(): void {
  liveConciergeRequests = [...sampleConciergeRequests];
  liveConversations = [...sampleConversations];
  liveMessages = [...sampleMessages];
  conciergeRefSeq = 45;
  notifyConcierge();
}

export const sampleStaffAssignments: StaffAssignment[] = [
  {
    id: 'demo-asg-001',
    bookingReference: 'XT-DKR-2026-081',
    title: 'Blaise Diagne VIP Arrival Transfer',
    serviceName: 'Airport Transfer / VIP Protocol',
    customerName: 'Amadou Diop',
    customerPhone: '+221 77 000 1234',
    pickupTime: '14:30',
    schedule: '14:30 - 15:30',
    pickupLocation: 'Blaise Diagne Airport (DSS) VIP Pavilion',
    destination: 'Radisson Blu Hotel, Dakar Sea Plaza',
    vehicleAssigned: 'Mercedes-Benz S-Class S580 (Black Obsidian)',
    vehiclePlate: 'DK-2026-XT',
    passengerCount: 2,
    flightNumber: 'AF718 (Air France VIP Protocol)',
    specialInstructions:
      'Client traveling on AF718. Priority customs assistance already coordinated with protocol.',
    assignmentStatus: 'ASSIGNED',
    bookingStatus: 'CONFIRMED',
    notes: ['Flight tracked on radar', 'Chauffeur in protocol uniform'],
    date: '2026-11-24',
    isToday: true,
  },
  {
    id: 'demo-asg-002',
    bookingReference: 'XT-DKR-2026-083',
    title: 'Almadies Executive Diplomatic Transfer',
    serviceName: 'Executive Chauffeur Service',
    customerName: 'Madame Marie Ndiaye',
    customerPhone: '+221 78 111 2233',
    pickupTime: '18:00',
    schedule: '18:00 - 19:30',
    pickupLocation: 'Villa des Almadies, Route de la Corniche',
    destination: 'Palais Présidentiel / Plateau',
    vehicleAssigned: 'Range Rover Autobiography (Santorini Black)',
    vehiclePlate: 'DK-7788-AZ',
    passengerCount: 1,
    specialInstructions: 'Close protection escort protocol requested.',
    assignmentStatus: 'ACCEPTED',
    bookingStatus: 'CONFIRMED',
    date: '2026-11-24',
    isToday: true,
  },
  {
    id: 'demo-asg-003',
    bookingReference: 'XT-DKR-2026-085',
    title: 'Somone Lagoon Coastal Chauffeur',
    serviceName: 'Inter-City Luxury Transfer',
    customerName: 'Omar Sy',
    customerPhone: '+221 76 222 3344',
    pickupTime: '11:15',
    schedule: '11:15 - 13:00',
    pickupLocation: 'Plateau Financial District, Immeuble Horizon',
    destination: 'Somone Waterfront Lagoon Estate',
    vehicleAssigned: 'Mercedes-Benz V-Class VIP Edition',
    vehiclePlate: 'DK-5544-XT',
    passengerCount: 4,
    assignmentStatus: 'EN_ROUTE',
    bookingStatus: 'CONFIRMED',
    date: '2026-11-24',
    isToday: true,
  },
  {
    id: 'demo-asg-004',
    bookingReference: 'XT-DKR-2026-087',
    title: 'Dakar Financial Summit Motorcade',
    serviceName: 'Close Protection Motorcade',
    customerName: 'Cheikh Anta Diop',
    customerPhone: '+221 77 333 4455',
    pickupTime: '09:30',
    schedule: '09:30 - 17:00',
    pickupLocation: 'King Fahd Palace VIP Suite',
    destination: 'BCEAO Headquarters / Plateau',
    vehicleAssigned: 'Cadillac Escalade ESV Armored',
    vehiclePlate: 'DK-1010-XT',
    passengerCount: 2,
    assignmentStatus: 'IN_PROGRESS',
    bookingStatus: 'CONFIRMED',
    date: '2026-11-24',
    isToday: true,
  },
  {
    id: 'demo-asg-005',
    bookingReference: 'XT-DKR-2026-090',
    title: 'Lac Rose Safari Private Excursion',
    serviceName: 'Safari Expedition Chauffeur',
    customerName: 'Dr. Babacar Ndiaye',
    customerPhone: '+221 77 444 5566',
    pickupTime: 'Tomorrow, 08:30',
    schedule: '08:30 - 16:00',
    pickupLocation: 'Terrou-Bi Resort VIP Pier',
    destination: 'Lac Rose Dunes & Salt Lake Safari Camp',
    vehicleAssigned: 'Toyota Land Cruiser 300 VXR',
    vehiclePlate: 'DK-9900-XT',
    passengerCount: 3,
    assignmentStatus: 'ASSIGNED',
    bookingStatus: 'CONFIRMED',
    date: '2026-11-25',
    isUpcoming: true,
  },
  {
    id: 'demo-asg-006',
    bookingReference: 'XT-DKR-2026-092',
    title: 'Saly Golf Resort Weekend Transfer',
    serviceName: 'Luxury Resort Transfer',
    customerName: 'Sophie Martin',
    customerPhone: '+221 78 555 6677',
    pickupTime: 'Nov 26, 15:00',
    schedule: '15:00 - 17:00',
    pickupLocation: 'Radisson Blu Hotel, Dakar Sea Plaza',
    destination: 'The Rhino Resort Hotel & Spa, Saly',
    vehicleAssigned: 'Mercedes-Benz S-Class S580',
    vehiclePlate: 'DK-2026-XT',
    passengerCount: 2,
    assignmentStatus: 'ACCEPTED',
    bookingStatus: 'CONFIRMED',
    date: '2026-11-26',
    isUpcoming: true,
  },
  {
    id: 'demo-asg-007',
    bookingReference: 'XT-DKR-2026-079',
    title: 'Gorée Ferry VIP Protocol Transfer',
    serviceName: 'Port Protocol Escort',
    customerName: 'Awa Fall',
    customerPhone: '+221 77 666 7788',
    pickupTime: 'Nov 22, 10:00',
    schedule: '10:00 - 11:30',
    pickupLocation: 'Radisson Blu Hotel',
    destination: 'Embarcadère de Dakar',
    vehicleAssigned: 'Mercedes-Benz V-Class VIP Edition',
    vehiclePlate: 'DK-5544-XT',
    passengerCount: 2,
    assignmentStatus: 'COMPLETED',
    bookingStatus: 'COMPLETED',
    date: '2026-11-22',
    isHistory: true,
    notes: ['VIP escort completed on time', 'Luggage transferred to private launch'],
  },
  {
    id: 'demo-asg-008',
    bookingReference: 'XT-DKR-2026-075',
    title: 'Desert Dune Sunset Transfer',
    serviceName: 'Desert Excursion Chauffeur',
    customerName: 'Jean-Luc Dupont',
    customerPhone: '+221 78 777 8899',
    pickupTime: 'Nov 20, 16:00',
    schedule: '16:00 - 19:30',
    pickupLocation: 'Almadies Residence',
    destination: 'Lompoul Desert Dunes',
    vehicleAssigned: 'Range Rover Autobiography',
    vehiclePlate: 'DK-7788-AZ',
    passengerCount: 2,
    assignmentStatus: 'UNABLE_TO_COMPLETE',
    bookingStatus: 'CONFIRMED',
    date: '2026-11-20',
    isHistory: true,
    notes: [
      'Radiator temperature alert triggered at km 45',
      'Client safely transferred to backup unit',
    ],
  },
  {
    id: 'demo-asg-009',
    bookingReference: 'XT-DKR-2026-072',
    title: 'Dakar Fashion Week VIP Shuttle',
    serviceName: 'Executive Chauffeur Service',
    customerName: 'Fatou Sow',
    customerPhone: '+221 77 888 9900',
    pickupTime: 'Nov 19, 19:00',
    schedule: '19:00 - 23:00',
    pickupLocation: 'Sea Plaza Corniche Ouest',
    destination: 'Grand Théâtre National de Dakar',
    vehicleAssigned: 'Mercedes-Benz S-Class S580',
    vehiclePlate: 'DK-2026-XT',
    passengerCount: 1,
    assignmentStatus: 'COMPLETED',
    bookingStatus: 'COMPLETED',
    date: '2026-11-19',
    isHistory: true,
  },
  {
    id: 'demo-asg-010',
    bookingReference: 'XT-DKR-2026-070',
    title: 'Corniche Ouest Sunset Dinner Chauffeur',
    serviceName: 'Evening Dining Chauffeur',
    customerName: 'Ibrahima Kane',
    customerPhone: '+221 78 999 0011',
    pickupTime: 'Nov 18, 20:30',
    schedule: '20:30 - 23:30',
    pickupLocation: 'Fann Résidence',
    destination: 'L’Alkimia Almadies',
    vehicleAssigned: 'Mercedes-Benz S-Class S580',
    vehiclePlate: 'DK-2026-XT',
    passengerCount: 2,
    assignmentStatus: 'COMPLETED',
    bookingStatus: 'COMPLETED',
    date: '2026-11-18',
    isHistory: true,
  },
];

export const sampleStaffIssueReports: StaffIssueReport[] = [
  {
    id: 'rpt-demo-001',
    assignmentId: 'demo-asg-008',
    category: 'VEHICLE_ISSUE',
    severity: 'CRITICAL',
    issueContext: 'Vehicle radiator overheating on route to Lompoul',
    visibilityScope: 'OPERATIONS_ONLY',
    assignmentOutcome: 'UNABLE_TO_COMPLETE',
    description:
      'Vehicle displayed engine coolant warning light at km 45. Safely pulled over to shoulder. Coordinated with Central Operations to dispatch backup Mercedes V-Class for seamless passenger handover.',
    timestamp: '2026-11-20T16:45:00Z',
    reportedBy: 'demo-stf-001',
  },
];

/**
 * Live Frontend Staff Repositories
 */
let liveStaffAssignments: StaffAssignment[] = [...sampleStaffAssignments];
let liveStaffIssueReports: StaffIssueReport[] = [...sampleStaffIssueReports];

type StaffListener = () => void;
const staffListeners: Set<StaffListener> = new Set();

export function subscribeStaff(listener: StaffListener): () => void {
  staffListeners.add(listener);
  return () => staffListeners.delete(listener);
}

function notifyStaff(): void {
  staffListeners.forEach((fn) => {
    fn();
  });
}

export function getAllStaffAssignments(): StaffAssignment[] {
  return [...liveStaffAssignments];
}

export function getStaffAssignmentById(idOrRef: string): StaffAssignment | undefined {
  return liveStaffAssignments.find(
    (a) => a.id === idOrRef || a.bookingReference === idOrRef || a.title === idOrRef,
  );
}

export function getStaffAssignmentsByTab(tab: 'today' | 'upcoming' | 'history'): StaffAssignment[] {
  if (tab === 'today') {
    return liveStaffAssignments.filter(
      (a) =>
        a.isToday &&
        a.assignmentStatus !== 'COMPLETED' &&
        a.assignmentStatus !== 'UNABLE_TO_COMPLETE',
    );
  }
  if (tab === 'upcoming') {
    return liveStaffAssignments.filter(
      (a) =>
        a.isUpcoming &&
        a.assignmentStatus !== 'COMPLETED' &&
        a.assignmentStatus !== 'UNABLE_TO_COMPLETE',
    );
  }
  return getAllStaffHistory();
}

export function getAllStaffHistory(): StaffAssignment[] {
  return liveStaffAssignments.filter(
    (a) =>
      a.isHistory ||
      a.assignmentStatus === 'COMPLETED' ||
      a.assignmentStatus === 'UNABLE_TO_COMPLETE',
  );
}

/**
 * Canonical State Transition Machine
 * SRS v1.1 & Figma State Authority
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  ASSIGNED: ['ACCEPTED', 'UNABLE_TO_COMPLETE'],
  ACCEPTED: ['EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'UNABLE_TO_COMPLETE'],
  EN_ROUTE: ['ARRIVED', 'IN_PROGRESS', 'UNABLE_TO_COMPLETE'],
  ARRIVED: ['IN_PROGRESS', 'UNABLE_TO_COMPLETE'],
  IN_PROGRESS: ['COMPLETED', 'UNABLE_TO_COMPLETE'],
  COMPLETED: [],
  UNABLE_TO_COMPLETE: [],
  INCIDENT_REPORTED: ['COMPLETED', 'UNABLE_TO_COMPLETE'],
};

export function getAllowedNextAssignmentStatuses(
  currentStatus: AssignmentStatus,
): AssignmentStatus[] {
  return ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
}

export function canTransitionAssignmentStatus(
  from: AssignmentStatus,
  to: AssignmentStatus,
): boolean {
  const allowed = ALLOWED_STATUS_TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.includes(to);
}

export function updateStaffAssignmentStatus(
  idOrRef: string,
  newStatus: AssignmentStatus,
  note?: string,
): { success: boolean; assignment?: StaffAssignment; error?: string } {
  const index = liveStaffAssignments.findIndex(
    (a) => a.id === idOrRef || a.bookingReference === idOrRef,
  );
  if (index === -1) {
    return { success: false, error: `Assignment not found for identifier "${idOrRef}"` };
  }

  const current = liveStaffAssignments[index];
  if (!canTransitionAssignmentStatus(current.assignmentStatus, newStatus)) {
    return {
      success: false,
      error: `Illegal status transition from "${current.assignmentStatus}" to "${newStatus}"`,
    };
  }

  const updatedNotes = note ? [...(current.notes || []), note] : current.notes;
  const isNowHistory = newStatus === 'COMPLETED' || newStatus === 'UNABLE_TO_COMPLETE';

  liveStaffAssignments[index] = {
    ...current,
    assignmentStatus: newStatus,
    notes: updatedNotes,
    isHistory: isNowHistory ? true : current.isHistory,
  };

  notifyStaff();
  return { success: true, assignment: liveStaffAssignments[index] };
}

export function getAllStaffIssueReports(): StaffIssueReport[] {
  return [...liveStaffIssueReports];
}

export function getStaffIssueReportsByAssignment(assignmentId: string): StaffIssueReport[] {
  return liveStaffIssueReports.filter((r) => r.assignmentId === assignmentId);
}

export function addStaffIssueReport(
  report: Omit<StaffIssueReport, 'id' | 'timestamp'> & { id?: string; timestamp?: string },
): StaffIssueReport {
  const newReport: StaffIssueReport = {
    id: report.id || `rpt-staff-${Date.now()}`,
    timestamp: report.timestamp || new Date().toISOString(),
    ...report,
  };

  liveStaffIssueReports = [newReport, ...liveStaffIssueReports];

  // If issue outcome is UNABLE_TO_COMPLETE, transition the assignment
  if (report.assignmentOutcome === 'UNABLE_TO_COMPLETE') {
    const asg = getStaffAssignmentById(report.assignmentId);
    if (asg && asg.assignmentStatus !== 'UNABLE_TO_COMPLETE') {
      updateStaffAssignmentStatus(
        asg.id,
        'UNABLE_TO_COMPLETE',
        `Reported issue: ${report.description}`,
      );
    }
  }

  notifyStaff();
  return newReport;
}

export function resetStaffState(): void {
  liveStaffAssignments = [...sampleStaffAssignments];
  liveStaffIssueReports = [...sampleStaffIssueReports];
  notifyStaff();
}

// ---------------------------------------------------------------------------
// Command Center (Admin Web) Mock Data & Services
// ---------------------------------------------------------------------------

export const sampleCommandCenterUsers: CommandCenterUser[] = [
  {
    id: 'cc-usr-001',
    email: 'superadmin@xtreme.sn',
    name: 'Fatou Diagne',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    status: 'ACTIVE',
    lastLoginAt: '2026-11-24T11:45:00Z',
  },
  {
    id: 'cc-usr-002',
    email: 'admin@xtreme.sn',
    name: 'Mamadou Kane',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'ACTIVE',
    lastLoginAt: '2026-11-24T10:15:00Z',
  },
  {
    id: 'cc-usr-003',
    email: 'concierge@xtreme.sn',
    name: 'Awa Fall',
    role: 'CONCIERGE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'ACTIVE',
    lastLoginAt: '2026-11-24T09:30:00Z',
  },
  {
    id: 'cc-usr-004',
    email: 'vendor@xtreme.sn',
    name: 'Ibrahima Ba',
    role: 'VENDOR',
    vendorId: 'vnd-dakar-fleet-01',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'ACTIVE',
    lastLoginAt: '2026-11-24T08:00:00Z',
  },
];

let liveCommandCenterUsers: CommandCenterUser[] = [...sampleCommandCenterUsers];

type CommandCenterListener = () => void;
const commandCenterListeners: Set<CommandCenterListener> = new Set();

export function subscribeCommandCenter(listener: CommandCenterListener): () => void {
  commandCenterListeners.add(listener);
  return () => commandCenterListeners.delete(listener);
}

function notifyCommandCenter(): void {
  commandCenterListeners.forEach((fn) => {
    fn();
  });
}

export function getAllCommandCenterUsers(): CommandCenterUser[] {
  return [...liveCommandCenterUsers];
}

export function getCommandCenterUserByRole(role: CommandCenterRole): CommandCenterUser | undefined {
  return liveCommandCenterUsers.find((u) => u.role === role);
}

export function getCommandCenterUserById(id: string): CommandCenterUser | undefined {
  return liveCommandCenterUsers.find((u) => u.id === id);
}

export function authenticateCommandCenter(
  email: string,
  _password?: string,
): { success: boolean; user?: CommandCenterUser; error?: string } {
  const normalized = email.trim().toLowerCase();
  const user = liveCommandCenterUsers.find((u) => u.email.toLowerCase() === normalized);

  if (!user) {
    return {
      success: false,
      error: 'Invalid credentials or wrong role. Access to Command Center is restricted.',
    };
  }

  if (user.status !== 'ACTIVE') {
    return {
      success: false,
      error: 'Your account is suspended. Please contact platform administration.',
    };
  }

  return {
    success: true,
    user,
  };
}

export interface CommandCenterKpis {
  roleScopedBookings: number;
  assignmentsWork: number;
  conciergeRequests: number;
  roleSpecificItems: number;
}

export function getCommandCenterKpis(
  role: CommandCenterRole,
  vendorId?: string,
): CommandCenterKpis {
  const allBookings = getAllBookings();
  const allAssignments = getAllStaffAssignments();
  const allRequests = getAllConciergeRequests();

  if (role === 'VENDOR') {
    return {
      roleScopedBookings:
        allBookings.filter((b) => b.pickupLocation?.includes(vendorId || 'Dakar')).length || 4,
      assignmentsWork: allAssignments.filter((a) => a.vehiclePlate?.startsWith('DK')).length || 6,
      conciergeRequests: 0,
      roleSpecificItems: 8, // active assets in vendor fleet
    };
  }

  if (role === 'CONCIERGE') {
    return {
      roleScopedBookings: allBookings.length,
      assignmentsWork: allAssignments.length,
      conciergeRequests: allRequests.length,
      roleSpecificItems: allRequests.filter((r) => r.status === 'IN_REVIEW').length,
    };
  }

  // ADMIN / SUPER_ADMIN
  return {
    roleScopedBookings: 24,
    assignmentsWork: 17,
    conciergeRequests: 38,
    roleSpecificItems: 5,
  };
}

export function resetCommandCenterState(): void {
  liveCommandCenterUsers = [...sampleCommandCenterUsers];
  notifyCommandCenter();
}
