import { getBookingDraft } from '@xtreme/mock-data';
import type { BookingMode, BookingStatus } from '@xtreme/types';
import {
  BookingStatusPill,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 50:712 & 50:589
const logoHeader = require('../../assets/logo.png');

/**
 * CUS-BKG-04: Booking Submitted / Reference Screen
 * Authoritative Figma Frames:
 * - 50:712 (CUS-BKG-04__Booking_Submitted_Reference__CONFIRMED)
 * - 50:589 (CUS-BKG-04__Booking_Submitted_Reference__PENDING_VENDOR)
 *
 * Compliance: Final SRS v1.1 canonical state machine.
 * Correctly distinguishes Instant Booking (CONFIRMED) vs Request to Book (PENDING_VENDOR).
 */
export default function BookingSubmittedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    bookingId?: string;
    reference?: string;
    serviceId?: string;
    serviceName?: string;
    bookingMode?: BookingMode;
    date?: string;
    time?: string;
    amount?: string;
    currency?: string;
    paymentStatus?: string;
    status?: BookingStatus;
  }>();

  const draft = useMemo(() => getBookingDraft(), []);

  const bookingId = params.bookingId || draft.reference || 'bkg-demo-001';
  const reference = params.reference || draft.reference || 'XT-DKR-2026-081';
  const bookingMode: BookingMode = params.bookingMode || draft.bookingMode || 'INSTANT';
  const scheduleDate = params.date || draft.date || '2026-12-05';
  const scheduleTime = params.time || draft.time || '14:30 GMT';
  const amountStr = params.amount || String(draft.amount || 95000);
  const currencyStr = params.currency || draft.currency || 'XOF';

  // Determine authoritative operational state & presentation based on canonical booking mode
  const isInstant = bookingMode === 'INSTANT';
  const isRequestToBook = bookingMode === 'REQUEST_TO_BOOK';

  const operationalStatus: BookingStatus = isInstant
    ? 'CONFIRMED'
    : isRequestToBook
      ? 'PENDING_VENDOR'
      : 'IN_PROGRESS';

  const handleViewBooking = () => {
    router.push({
      pathname: '/bookings/detail',
      params: { bookingId, reference },
    } as never);
  };

  const handleBackToBookings = () => {
    router.push('/bookings' as never);
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
          <Text style={styles.pageTitle}>Booking Submitted / Reference</Text>
        </View>

        {/* Status Circular Icon matching Figma 50:717 / 50:594 */}
        <View style={styles.statusIconWrap}>
          {isInstant ? (
            <View style={styles.confirmedCircle}>
              <Text style={styles.confirmedCheckmark}>✓</Text>
            </View>
          ) : (
            <View style={styles.pendingCircle}>
              <Text style={styles.pendingEllipsis}>…</Text>
            </View>
          )}
        </View>

        {/* Status Heading & Reference Text */}
        <Text style={styles.statusHeading}>
          {isInstant ? 'Booking Confirmed' : 'Request Submitted'}
        </Text>
        <Text style={styles.referenceText}>REF: {reference}</Text>

        {/* Centered Status Pill */}
        <View style={styles.pillContainer}>
          <BookingStatusPill status={operationalStatus} />
        </View>

        {/* 4 Detail Cards matching Figma node 50:724 to 50:733 */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Booking mode */}
          <View style={styles.detailCard}>
            <Text style={styles.cardLabel}>Booking mode</Text>
            <Text style={styles.cardValue}>
              {isInstant
                ? 'Instant Confirmation'
                : isRequestToBook
                  ? 'Request to Book'
                  : 'Concierge Request'}
            </Text>
          </View>

          {/* Card 2: Schedule */}
          <View style={styles.detailCard}>
            <Text style={styles.cardLabel}>Schedule</Text>
            <Text style={styles.cardValue}>
              {scheduleDate} • {scheduleTime}
            </Text>
          </View>

          {/* Card 3: Customer price */}
          <View style={styles.detailCard}>
            <Text style={styles.cardLabel}>Customer price</Text>
            <Text style={[styles.cardValue, styles.priceValue]}>
              {Number.parseInt(amountStr, 10).toLocaleString()} {currencyStr}
            </Text>
          </View>

          {/* Card 4: Payment */}
          <View style={styles.detailCard}>
            <Text style={styles.cardLabel}>Payment</Text>
            <Text style={styles.cardValue}>
              {isInstant ? 'Succeeded (Stripe Card)' : 'Authorized (Stripe Card)'}
            </Text>
          </View>
        </View>

        {/* Explanatory Message Text matching Figma node 50:736 / 50:613 */}
        <Text style={styles.explanatoryNote}>
          {isInstant
            ? 'The authoritative booking status is CONFIRMED.'
            : 'The booking was created, but it is not CONFIRMED. Follow the current server state in Booking Detail.'}
        </Text>

        {/* Action Buttons matching Figma node 50:737 & 50:738 */}
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
          onPress={handleViewBooking}
          accessibilityRole="button"
          accessibilityLabel="View Booking"
        >
          <Text style={styles.primaryBtnText}>View Booking</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
          onPress={handleBackToBookings}
          accessibilityRole="button"
          accessibilityLabel="Back to Bookings"
        >
          <Text style={styles.secondaryBtnText}>Back to Bookings</Text>
        </Pressable>
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
  statusIconWrap: {
    alignItems: 'center',
    marginTop: 14,
  },
  confirmedCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E6F2EC',
    borderWidth: 1,
    borderColor: '#1F6B4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmedCheckmark: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F6B4A',
    lineHeight: 32,
  },
  pendingCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F1E7D2',
    borderWidth: 1,
    borderColor: '#C6A15B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingEllipsis: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 30,
  },
  statusHeading: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 28,
    marginTop: 16,
  },
  referenceText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#5B616B',
    lineHeight: 20,
    letterSpacing: 0.1,
    marginTop: 6,
  },
  pillContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  cardsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    gap: 8,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0B0C0E',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  priceValue: {
    fontWeight: '600',
    color: '#164D53',
  },
  explanatoryNote: {
    marginHorizontal: 20,
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 22,
  },
  primaryBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    height: 48,
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnPressed: {
    opacity: 0.88,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  secondaryBtn: {
    marginHorizontal: 20,
    marginTop: 10,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A6A19A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnPressed: {
    backgroundColor: '#F5F3EF',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
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
