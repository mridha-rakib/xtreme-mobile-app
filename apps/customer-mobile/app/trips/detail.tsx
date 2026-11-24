import { getTripById, sampleTrips } from '@xtreme/mock-data';
import type { Trip } from '@xtreme/types';
import { CustomerBottomNav, NotFoundCard } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../../assets/logo.png');

interface ItineraryItem {
  id: string;
  title: string;
  schedule: string;
  location: string;
  category: string;
}

const DEFAULT_ITINERARY_ITEMS: ItineraryItem[] = [
  {
    id: 'itin-01',
    title: 'Airport VIP Arrival & Fast-track Transfer',
    schedule: 'Day 1 • 08:30 GMT',
    location: 'DSS International Airport',
    category: 'VIP Protocol',
  },
  {
    id: 'itin-02',
    title: 'Private Villa / Luxury Hotel Check-in',
    schedule: 'Day 1 • 14:00 GMT',
    location: 'Almadies Luxury Residence',
    category: 'Accommodation',
  },
  {
    id: 'itin-03',
    title: 'Private Yacht & Ngor Island Excursion',
    schedule: 'Day 2 • 10:30 GMT',
    location: 'Dakar Bay Marina',
    category: 'Experience',
  },
  {
    id: 'itin-04',
    title: 'Gourmet Dining & Cultural Evening',
    schedule: 'Day 2 • 19:30 GMT',
    location: 'Plateau Dakar',
    category: 'Gastronomy',
  },
  {
    id: 'itin-05',
    title: 'Airport Protocol Return Transfer',
    schedule: 'Day 3 • 16:00 GMT',
    location: 'Departure Concourse',
    category: 'VIP Protocol',
  },
];

/**
 * CUS-TRIP-02: Trip Detail / Itinerary Screen
 * Authoritative Figma Frame: 60:873 (CUS-TRIP-02__Trip_Detail_Itinerary__Ready)
 */
export default function TripDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; tripId?: string }>();
  const activeTripId = params.tripId || params.id;

  const trip: Trip | undefined = useMemo(() => {
    if (!activeTripId) return sampleTrips[0];
    return getTripById(activeTripId);
  }, [activeTripId]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/trips' as never);
    }
  };

  const handleContactConcierge = () => {
    router.push('/concierge/conversations' as never);
  };

  const renderStatusBadge = (status: Trip['status']) => {
    let bg = '#F0F1F3';
    let text = '#5B616B';
    if (status === 'ACTIVE') {
      bg = '#E8F4F2';
      text = '#164D53';
    } else if (status === 'UPCOMING') {
      bg = '#FDF4E2';
      text = '#A88343';
    }
    return (
      <View style={[styles.statusBadge, { backgroundColor: bg }]}>
        <Text style={[styles.statusBadgeText, { color: text }]}>{status}</Text>
      </View>
    );
  };

  if (!trip) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19L8 12L15 5"
                stroke="#164D53"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={{ padding: 20 }}>
          <NotFoundCard
            resourceName="Trip"
            resourceId={activeTripId}
            onBack={() => router.replace('/trips' as never)}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header Row */}
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19L8 12L15 5"
                stroke="#164D53"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Trip Detail / Itinerary</Text>
        </View>

        {/* Hero Summary Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <Text style={styles.heroTitle}>{trip.title}</Text>
            {renderStatusBadge(trip.status)}
          </View>
          <Text style={styles.heroDestination}>{trip.destination}</Text>
          <Text style={styles.heroDates}>
            {trip.startDate} – {trip.endDate}
          </Text>
          <Text style={styles.heroRef}>Reference: {trip.reference}</Text>
        </View>

        {/* Section Heading */}
        <Text style={styles.sectionHeading}>Itinerary</Text>

        {/* 5 Itinerary Item Cards */}
        <View style={styles.itineraryList}>
          {DEFAULT_ITINERARY_ITEMS.map((item, index) => (
            <View key={item.id} style={styles.itineraryCard}>
              <View style={styles.itemHeaderRow}>
                <View style={styles.itemNumberBadge}>
                  <Text style={styles.itemNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.itemTitleBlock}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                </View>
              </View>

              <View style={styles.itemMetaRow}>
                <Text style={styles.itemSchedule}>{item.schedule}</Text>
                <Text style={styles.itemLocation}>{item.location}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Authoritative State Advisory Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            Open linked booking to see authoritative booking state.
          </Text>
        </View>

        {/* Contact Concierge Action */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [styles.contactBtn, pressed && styles.contactBtnPressed]}
            onPress={handleContactConcierge}
            accessibilityRole="button"
            accessibilityLabel="Contact Concierge"
          >
            <Text style={styles.contactBtnText}>Contact Concierge</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Customer Bottom Navigation Bar */}
      <CustomerBottomNav
        activeTab="Trips"
        bottomInset={insets.bottom}
        onTabPress={(tab) => {
          if (tab === 'Home') router.push('/discover' as never);
          else if (tab === 'Bookings') router.push('/bookings' as never);
          else if (tab === 'Trips') router.push('/trips' as never);
          else if (tab === 'Concierge') router.push('/concierge/requests' as never);
          else if (tab === 'Profile') router.push('/account/profile' as never);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  brandLogo: {
    width: 140,
    height: 28,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    opacity: 0.72,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
  },
  titleRow: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.3,
  },
  heroCard: {
    marginHorizontal: 20,
    backgroundColor: '#F6EFE3',
    borderWidth: 1,
    borderColor: '#E4D7B5',
    borderRadius: 16,
    padding: 16,
    gap: 6,
    marginBottom: 16,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0C0E',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroDestination: {
    fontSize: 14,
    fontWeight: '600',
    color: '#164D53',
  },
  heroDates: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5B616B',
  },
  heroRef: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8A6A2B',
    marginTop: 4,
  },
  sectionHeading: {
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  itineraryList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  itineraryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1E7D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#164D53',
  },
  itemTitleBlock: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B0C0E',
  },
  itemCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A6A2B',
    textTransform: 'uppercase',
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
  },
  itemSchedule: {
    fontSize: 12,
    fontWeight: '500',
    color: '#164D53',
  },
  itemLocation: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
  },
  noticeContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  contactBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0B0C0E',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactBtnPressed: {
    backgroundColor: '#F9F7F2',
  },
  contactBtnText: {
    color: '#0B0C0E',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
