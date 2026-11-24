/**
 * XTREME Concierge - Realistic Fictional Senegal Mock Data
 *
 * MANDATORY PRIVACY NOTICE:
 * All records, identities, phone numbers, and addresses are completely fictional
 * and strictly for prototype/demo purposes. Never use real client data.
 */

import type {
  BookingDraft,
  BookingRecord,
  ConciergeConversation,
  ConciergeMessage,
  ConciergeRequestRecord,
  ServiceCategory,
  ServiceItem,
  ServiceLocation,
  StaffAssignment,
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
 * Shared in-flight booking draft store across the continuous 5-screen booking journey
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
  luggageCount: 2,
  date: '2026-12-05',
  time: '14:30 GMT',
  reference: 'XT-DKR-2026-081',
  status: 'CONFIRMED',
  paymentStatus: 'SUCCEEDED',
  currency: 'XOF',
  amount: 95000,
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

export const sampleTrips: TripItinerary[] = [
  {
    id: 'trip-demo-001',
    reference: 'TRIP-SN-2026-004',
    title: 'Senegal Atlantic Heritage & Luxury Retreat',
    destination: 'Dakar • Gorée • Somone • Saly',
    startDate: '2026-12-05',
    endDate: '2026-12-09',
    status: 'UPCOMING',
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
];

export const sampleConciergeRequests: ConciergeRequestRecord[] = [
  {
    id: 'req-con-001',
    reference: 'REQ-CON-2026-019',
    customerId: 'demo-cus-001',
    title: 'Private Helicopter Tour over Lake Retba & Desert Dunes',
    details:
      'Looking for a private helicopter charter for 3 persons on Saturday morning, followed by champagne lunch near Lac Rose.',
    startDate: '2026-12-08',
    guestCount: 3,
    budgetNotes: 'Flexible, premium standard',
    status: 'PROPOSAL_READY',
    createdAt: '2026-11-21T14:30:00Z',
  },
];

export const sampleConversations: ConciergeConversation[] = [
  {
    id: 'conv-demo-001',
    requestId: 'req-con-001',
    subject: 'Helicopter Charter & Lac Rose Excursion',
    lastMessageSnippet:
      'Bonjour Monsieur Diop, the flight clearance for Lac Rose is confirmed for 10:30 AM.',
    lastUpdated: '2026-11-22T15:20:00Z',
    unreadCount: 1,
  },
];

export const sampleMessages: ConciergeMessage[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-demo-001',
    senderId: 'demo-cus-001',
    senderName: 'Amadou Diop',
    isStaff: false,
    content:
      'Bonjour, could you check availability for an Airbus H130 helicopter for this Saturday morning?',
    timestamp: '2026-11-21T15:00:00Z',
  },
  {
    id: 'msg-002',
    conversationId: 'conv-demo-001',
    senderId: 'staff-ops-001',
    senderName: 'Fatou (XTREME Concierge)',
    isStaff: true,
    content:
      'Bonjour Monsieur Diop, we are finalizing the private helipad authorization near Lac Rose. The departure is set for 10:30 AM from Blaise Diagne.',
    timestamp: '2026-11-22T15:20:00Z',
  },
];

export const sampleStaffAssignments: StaffAssignment[] = [
  {
    id: 'demo-asg-001',
    bookingReference: 'XT-DKR-2026-081',
    title: 'Blaise Diagne VIP Arrival Transfer',
    customerName: 'Amadou Diop',
    customerPhone: '+221 77 000 1234',
    pickupTime: '14:30',
    pickupLocation: 'Blaise Diagne Airport (DSS) VIP Pavilion',
    destination: 'Radisson Blu Hotel, Dakar Sea Plaza',
    vehicleAssigned: 'Mercedes-Benz S-Class S580 (Black Obsidian)',
    vehiclePlate: 'DK-2026-XT',
    passengerCount: 2,
    specialInstructions:
      'Client traveling on AF718. Priority customs assistance already coordinated with protocol.',
    assignmentStatus: 'ASSIGNED',
    bookingStatus: 'CONFIRMED',
    notes: ['Flight tracked on radar', 'Chauffeur in protocol uniform'],
  },
  {
    id: 'demo-asg-002',
    bookingReference: 'XT-DKR-2026-083',
    title: 'Almadies Executive Diplomatic Transfer',
    customerName: 'Madame Marie Ndiaye',
    customerPhone: '+221 78 111 2233',
    pickupTime: '18:00',
    pickupLocation: 'Villa des Almadies, Route de la Corniche',
    destination: 'Palais Présidentiel / Plateau',
    vehicleAssigned: 'Range Rover Autobiography (Santorini Black)',
    vehiclePlate: 'DK-7788-AZ',
    passengerCount: 1,
    assignmentStatus: 'ACCEPTED',
    bookingStatus: 'CONFIRMED',
  },
  {
    id: 'demo-asg-003',
    bookingReference: 'XT-DKR-2026-079',
    title: 'Full-Day Dakar City Business Tour',
    customerName: 'Amadou Diop',
    customerPhone: '+221 77 000 1234',
    pickupTime: '08:00',
    pickupLocation: 'Almadies Residence',
    destination: 'Plateau Financial District & Sea Plaza',
    vehicleAssigned: 'Mercedes-Benz V-Class VIP Edition',
    vehiclePlate: 'DK-5544-XT',
    passengerCount: 3,
    assignmentStatus: 'COMPLETED',
    bookingStatus: 'COMPLETED',
    notes: ['Trip finished on schedule', 'Vehicle cleaned and refueled'],
  },
];
