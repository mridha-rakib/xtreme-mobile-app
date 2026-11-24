import { sampleBookings } from '@xtreme/mock-data';
import type { BookingRecord } from '@xtreme/types';
import {
  BookingStatusPill,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 52:684
const logoHeader = require('../assets/logo.png');

type BookingTab = 'All' | 'Upcoming' | 'Past';

/**
 * CUS-BKG-05: My Bookings Screen
 * Authoritative Figma Frame: 52:684 (CUS-BKG-05__My_Bookings__Ready)
 */
export default function MyBookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<BookingTab>('All');

  // Filter bookings based on active tab
  const filteredBookings = useMemo(() => {
    if (activeTab === 'All') {
      return sampleBookings;
    }
    if (activeTab === 'Upcoming') {
      return sampleBookings.filter(
        (b) =>
          b.status === 'CONFIRMED' || b.status === 'PENDING_VENDOR' || b.status === 'IN_PROGRESS',
      );
    }
    if (activeTab === 'Past') {
      return sampleBookings.filter((b) => b.status === 'COMPLETED' || b.status === 'CANCELLED');
    }
    return sampleBookings;
  }, [activeTab]);

  const handleBookingPress = (booking: BookingRecord) => {
    router.push({
      pathname: '/bookings/detail',
      params: { bookingId: booking.id, reference: booking.reference },
    } as never);
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
          <Text style={styles.pageTitle}>My Bookings</Text>
        </View>

        {/* Segmented Filter Tabs matching Figma node 52:689 */}
        <View style={styles.tabsContainer}>
          {(['All', 'Upcoming', 'Past'] as BookingTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.tabSegment, isActive && styles.tabSegmentActive]}
                onPress={() => setActiveTab(tab)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${tab} bookings`}
              >
                <Text style={[styles.tabSegmentText, isActive && styles.tabSegmentTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Bookings List Cards matching Figma node 52:696 to 52:720 */}
        <View style={styles.listContainer}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Pressable
                key={booking.id}
                style={({ pressed }) => [styles.bookingCard, pressed && styles.bookingCardPressed]}
                onPress={() => handleBookingPress(booking)}
                accessibilityRole="button"
                accessibilityLabel={`Booking ${booking.reference} for ${booking.serviceName}`}
              >
                {/* Top Row: Service Name & Status Pill */}
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardServiceName} numberOfLines={1}>
                    {booking.serviceName}
                  </Text>
                  <BookingStatusPill status={booking.status} />
                </View>

                {/* Details text block */}
                <View style={styles.cardDetails}>
                  <Text style={styles.detailLine}>REF: {booking.reference}</Text>
                  <Text style={styles.detailLine}>
                    {booking.date} • {booking.time || '14:30 GMT'} •{' '}
                    {booking.pickupLocation.split(',')[0]}
                  </Text>
                  <Text style={styles.detailLine}>
                    {booking.amount.toLocaleString()} {booking.currency} •{' '}
                    {booking.paymentStatus === 'SUCCEEDED'
                      ? 'Paid'
                      : booking.paymentStatus === 'REFUNDED'
                        ? 'Refunded'
                        : 'Pending'}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyHeading}>No bookings found</Text>
              <Text style={styles.emptyText}>
                You have no {activeTab.toLowerCase()} reservations in Senegal.
              </Text>
              <Pressable
                style={styles.discoverBtn}
                onPress={() => router.push('/discover' as never)}
              >
                <Text style={styles.discoverBtnText}>Explore Services</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Customer Bottom Navigation Bar (Bookings Active) */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomNavRow}>
          {/* Home Tab */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/discover' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <NavHomeIcon active={false} size={24} />
            <Text style={styles.navText}>Home</Text>
          </Pressable>

          {/* Bookings Tab (Active) */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/bookings' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
          >
            <NavBookingsIcon active={true} size={24} />
            <Text style={[styles.navText, { color: '#164D53', fontWeight: '600' }]}>Bookings</Text>
            <View style={styles.activeUnderline} />
          </Pressable>

          {/* Concierge Tab */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/concierge' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <NavConciergeIcon active={false} size={24} />
            <Text style={styles.navText}>Concierge</Text>
          </Pressable>

          {/* Profile Tab */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/account/profile' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <NavProfileIcon active={false} size={24} />
            <Text style={styles.navText}>Profile</Text>
          </Pressable>
        </View>
      </View>
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
    height: 45,
  },
  logoWrap: {
    width: 82,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: 82,
    height: 35,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    marginHorizontal: 20,
    marginTop: 4,
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 32,
  },
  tabsContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#EEE9E0',
    borderRadius: 12,
    height: 42,
    padding: 6,
    flexDirection: 'row',
    gap: 8,
  },
  tabSegment: {
    flex: 1,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSegmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabSegmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  tabSegmentTextActive: {
    color: '#0B0C0E',
  },
  listContainer: {
    marginHorizontal: 20,
    marginTop: 14,
    gap: 12,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  bookingCardPressed: {
    backgroundColor: '#FBF9F5',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardServiceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
    flex: 1,
    lineHeight: 20,
  },
  cardDetails: {
    gap: 2,
    marginTop: 2,
  },
  detailLine: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD8CF',
    marginTop: 8,
  },
  emptyHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  emptyText: {
    fontSize: 13,
    color: '#5B616B',
    textAlign: 'center',
    lineHeight: 18,
  },
  discoverBtn: {
    marginTop: 12,
    height: 40,
    paddingHorizontal: 18,
    backgroundColor: '#0B0C0E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoverBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDD8CF',
  },
  bottomNavRow: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5B616B',
    marginTop: 3,
  },
  activeUnderline: {
    width: 20,
    height: 2,
    backgroundColor: '#C6A15B',
    borderRadius: 999,
    marginTop: 3,
  },
});
