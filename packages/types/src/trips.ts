/**
 * XTREME Concierge Types - Trips & Itineraries
 */

export interface ItineraryStop {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  category: 'TRANSFER' | 'EXCURSION' | 'DINING' | 'LEISURE' | 'ACCOMMODATION';
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  stops: ItineraryStop[];
}

export interface TripItinerary {
  id: string;
  reference: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  days: ItineraryDay[];
}
