import { sampleBookings } from '@xtreme/mock-data';
import type { BookingRecord } from '@xtreme/types';
import {
  BackButton,
  BookingStatusPill,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
  NotFoundCard,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 52:738
const logoHeader = require('../../assets/logo.png');

/**
 * CUS-BKG-06: Booking Detail Screen
 * Authoritative Figma Frame: 52:738 (CUS-BKG-06__Booking_Detail__CONFIRMED)
 * Variants: 55:859 (PENDING_VENDOR), 55:1054 (COMPLETED), 55:1152 (CANCELLED)
 */
export default function BookingDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    bookingId?: string;
    reference?: string;
  }>();

  const activeBookingId = params.bookingId || params.id;
  const activeReference = params.reference;

  const booking: BookingRecord | undefined = useMemo(() => {
    if (activeBookingId) {
      const found = sampleBookings.find(
        (b) => b.id === activeBookingId || b.reference === activeBookingId,
      );
      if (found) return found;
    }
    if (activeReference) {
      const found = sampleBookings.find((b) => b.reference === activeReference);
      if (found) return found;
    }
    // Fallback gracefully to first sample booking if none specified
    return sampleBookings[0];
  }, [activeBookingId, activeReference]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/bookings' as never);
    }
  };

  if (!booking) {
    return (
      <View style={styles.screen}>
        <View style={[styles.scrollContent, { paddingTop: insets.top + 8, paddingHorizontal: 20 }]}>
          <View style={styles.headerRow}>
            <BackButton onPress={handleBack} />
            <View style={styles.logoWrap}>
              <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
            </View>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.divider} />
          <NotFoundCard
            resourceName="Booking"
            resourceId={activeBookingId}
            onBack={() => router.replace('/bookings' as never)}
          />
        </View>
      </View>
    );
  }

  const isConfirmed = booking.status === 'CONFIRMED';
  const isCancelled = booking.status === 'CANCELLED';

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
          <BackButton onPress={handleBack} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Booking Detail</Text>
        </View>

        {/* Status Pill & Reference Row matching Figma node 52:746 */}
        <View style={styles.statusRefRow}>
          <BookingStatusPill status={booking.status} />
          <Text style={styles.referenceText}>REF: {booking.reference}</Text>
        </View>

        {/* Service Summary Card matching Figma node 52:747 */}
        <View style={styles.summaryCard}>
          <Text style={styles.serviceTitle}>{booking.serviceName}</Text>
          <View style={styles.serviceMetaBlock}>
            <Text style={styles.metaLine}>
              {booking.date} • {booking.time || '14:30 GMT'} •{' '}
              {booking.pickupLocation.split(',')[0]}
            </Text>
            <Text style={styles.metaLine}>
              Mode: {booking.bookingMode} • Qty: {booking.passengers} Passenger
              {booking.passengers > 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.priceText}>
            {booking.amount.toLocaleString()} {booking.currency}
          </Text>
        </View>

        {/* 4 Context Action / Detail Cards matching Figma node 52:751 to 52:760 */}
        <View style={styles.contextCardsContainer}>
          {/* Row 1: Payment status */}
          <Pressable
            style={styles.contextCard}
            onPress={() => router.push(`/payments/status?bookingId=${booking.id}` as never)}
            accessibilityRole="button"
            accessibilityLabel="View payment status"
          >
            <Text style={styles.contextLabel}>Payment status</Text>
            <Text style={styles.contextValue}>
              {booking.paymentStatus === 'SUCCEEDED' ? 'Paid (Stripe Card) ›' : 'Open ›'}
            </Text>
          </Pressable>

          {/* Row 2: Vendor / XTREME status */}
          <View style={styles.contextCard}>
            <Text style={styles.contextLabel}>Vendor / XTREME status</Text>
            <Text style={styles.contextValue}>
              {isConfirmed ? 'Fleet Protocol Active ›' : 'Current context ›'}
            </Text>
          </View>

          {/* Row 3: Change request */}
          <Pressable
            style={styles.contextCard}
            onPress={() => router.push(`/bookings/request-change?bookingId=${booking.id}` as never)}
            accessibilityRole="button"
            accessibilityLabel="Request modification"
          >
            <Text style={styles.contextLabel}>Change request</Text>
            <Text style={styles.contextValue}>Current request ›</Text>
          </Pressable>

          {/* Row 4: Assignment / trip */}
          <View style={styles.contextCard}>
            <Text style={styles.contextLabel}>Assignment / trip</Text>
            <Text style={styles.contextValue}>
              {booking.assignedStaffId
                ? 'Chauffeur Assigned (Moussa Camara) ›'
                : 'Linked context ›'}
            </Text>
          </View>
        </View>

        {/* State-gated actions notice box matching Figma node 52:763 */}
        <View style={styles.stateNoticeBox}>
          <Text style={styles.stateNoticeTitle}>State-gated actions</Text>
          <Text style={styles.stateNoticeSubtitle}>
            Only actions permitted by the current authoritative booking/payment/change state are
            shown.
          </Text>
        </View>

        {/* Primary Action Button matching Figma node 52:767 */}
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
          onPress={() => router.push(`/payments/choice?bookingId=${booking.id}` as never)}
          accessibilityRole="button"
          accessibilityLabel="Pay / View Payment"
        >
          <Text style={styles.primaryBtnText}>Pay / View Payment</Text>
        </Pressable>

        {/* Secondary Actions Row matching Figma node 52:768 */}
        <View style={styles.secondaryRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.secondaryBtnPressed,
              isCancelled && styles.disabledBtn,
            ]}
            disabled={isCancelled}
            onPress={() => router.push(`/bookings/request-change?bookingId=${booking.id}` as never)}
            accessibilityRole="button"
            accessibilityLabel="Modify"
          >
            <Text style={styles.secondaryBtnText}>Modify</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.secondaryBtnPressed,
              isCancelled && styles.disabledBtn,
            ]}
            disabled={isCancelled}
            onPress={() => router.push(`/bookings/request-cancel?bookingId=${booking.id}` as never)}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.secondaryBtnText}>Cancel</Text>
          </Pressable>
        </View>

        {/* Support & Legal Link matching Figma node 52:773 */}
        <Pressable
          style={styles.supportLink}
          onPress={() => router.push('/support' as never)}
          accessibilityRole="button"
          accessibilityLabel="Support & Legal"
        >
          <Text style={styles.supportLinkText}>Support & Legal</Text>
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
  statusRefRow: {
    marginHorizontal: 20,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  referenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 12,
    gap: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 26,
  },
  serviceMetaBlock: {
    gap: 2,
  },
  metaLine: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 22,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
    marginTop: 2,
  },
  contextCardsContainer: {
    marginHorizontal: 20,
    marginTop: 14,
    gap: 8,
  },
  contextCard: {
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
  contextLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  contextValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0B0C0E',
  },
  stateNoticeBox: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: '#E8F0F8',
    borderWidth: 1,
    borderColor: '#2F5E8D',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    gap: 3,
  },
  stateNoticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F5E8D',
    lineHeight: 20,
  },
  stateNoticeSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
  },
  primaryBtn: {
    marginHorizontal: 20,
    marginTop: 16,
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
  secondaryRow: {
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
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
  disabledBtn: {
    opacity: 0.45,
  },
  supportLink: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  supportLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#164D53',
    letterSpacing: 0.15,
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
