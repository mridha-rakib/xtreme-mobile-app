import { getAllTrips } from '@xtreme/mock-data';
import type { Trip } from '@xtreme/types';
import { CustomerBottomNav } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../assets/logo.png');

/**
 * CUS-TRIP-01: My Trips Screen
 * Authoritative Figma Frame: 60:837 (CUS-TRIP-01__My_Trips__Ready)
 */
export default function MyTripsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    setTrips(getAllTrips());
  }, []);

  const handleTripPress = (tripId: string) => {
    router.push({
      pathname: '/trips/detail',
      params: { tripId },
    } as never);
  };

  const handlePlanTrip = () => {
    router.push('/concierge/plan-trip' as never);
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
          <View style={styles.headerSpacer} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>My Trips</Text>
        </View>

        {/* Trip Presentation Advisory Banner */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>Trip containers</Text>
          <Text style={styles.warningSubtitle}>
            Trip presentation does not reserve inventory and does not replace linked Booking status.
          </Text>
        </View>

        {/* Trips List */}
        <View style={styles.listContainer}>
          {trips.map((trip) => (
            <Pressable
              key={trip.id}
              style={({ pressed }) => [styles.tripCard, pressed && styles.tripCardPressed]}
              onPress={() => handleTripPress(trip.id)}
              accessibilityRole="button"
              accessibilityLabel={`View ${trip.title}`}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.tripTitle} numberOfLines={1}>
                  {trip.title}
                </Text>
                {renderStatusBadge(trip.status)}
              </View>

              <Text style={styles.destinationText}>{trip.destination}</Text>

              <View style={styles.cardFooterRow}>
                <Text style={styles.datesText}>
                  {trip.startDate} – {trip.endDate}
                </Text>
                <View style={styles.detailLink}>
                  <Text style={styles.detailLinkText}>View Itinerary</Text>
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9 5L16 12L9 19"
                      stroke="#164D53"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Plan Entire Trip Primary CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [styles.planTripBtn, pressed && styles.planTripBtnPressed]}
            onPress={handlePlanTrip}
            accessibilityRole="button"
            accessibilityLabel="Plan My Entire Trip"
          >
            <Text style={styles.planTripBtnText}>Plan My Entire Trip</Text>
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
  warningBanner: {
    marginHorizontal: 20,
    backgroundColor: '#FAF6EF',
    borderWidth: 1,
    borderColor: '#E4D7B5',
    borderRadius: 14,
    padding: 14,
    gap: 4,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A6A2B',
  },
  warningSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  tripCardPressed: {
    opacity: 0.85,
    backgroundColor: '#F9F7F2',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  tripTitle: {
    flex: 1,
    fontSize: 16,
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
  destinationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#164D53',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
  },
  datesText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#164D53',
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  planTripBtn: {
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planTripBtnPressed: {
    opacity: 0.88,
  },
  planTripBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
