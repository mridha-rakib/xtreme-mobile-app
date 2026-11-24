import { getAllBookings, getBookingById } from '@xtreme/mock-data';
import type { BookingRecord, CurrencyCode, PaymentPurpose, PaymentStatus } from '@xtreme/types';
import {
  BackButton,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
  NotFoundCard,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logoHeader = require('../../assets/logo.png');

/**
 * CUS-PAY-03: Payment Detail / Status Screen
 * Authoritative Figma Frame: 53:706 (CUS-PAY-03__Payment_Detail_Status__SUCCEEDED)
 */
export default function PaymentStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    bookingId?: string;
    id?: string;
    status?: PaymentStatus;
    purpose?: PaymentPurpose;
    currency?: CurrencyCode;
    amount?: string;
    chargeReference?: string;
  }>();

  const activeBookingId = params.bookingId || params.id;

  const [booking, setBooking] = useState<BookingRecord | undefined>(() => {
    if (activeBookingId) {
      return getBookingById(activeBookingId);
    }
    return getAllBookings()[0];
  });

  const paymentStatus: PaymentStatus = params.status || booking?.paymentStatus || 'SUCCEEDED';
  const purpose: PaymentPurpose = params.purpose || booking?.paymentPurpose || 'FULL';
  const currency: CurrencyCode = params.currency || booking?.currency || 'XOF';
  const displayAmount = params.amount
    ? Number.parseInt(params.amount, 10)
    : booking?.amount || 95000;
  const chargeRef = params.chargeReference || booking?.paymentReference || 'ch_stripe_demo_882019';

  const formattedTimestamp = useMemo(() => {
    return '2026-12-05 14:30 GMT';
  }, []);

  const handleReturnToBooking = () => {
    if (booking) {
      router.replace(`/bookings/detail?bookingId=${booking.id}` as never);
    } else {
      router.replace('/bookings' as never);
    }
  };

  const handleRefreshStatus = () => {
    if (activeBookingId) {
      const refreshed = getBookingById(activeBookingId);
      if (refreshed) {
        setBooking(refreshed);
      }
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      handleReturnToBooking();
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

  // Determine status pill colors matching Figma tokens
  const isSucceeded = paymentStatus === 'SUCCEEDED';
  const isFailed = paymentStatus === 'FAILED';
  const isProcessing = paymentStatus === 'PROCESSING';

  const statusBg = isSucceeded
    ? '#E6F2EC'
    : isFailed
      ? '#FBEAE8'
      : isProcessing
        ? '#E8F0F8'
        : '#F7EFD9';
  const statusColor = isSucceeded
    ? '#1F6B4A'
    : isFailed
      ? '#C93B2B'
      : isProcessing
        ? '#2F5E8D'
        : '#8A5610';

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
          <Text style={styles.pageTitle}>Payment Detail / Status</Text>
        </View>

        {/* Status Pill & Authoritative Label matching Figma 53:714 */}
        <View style={styles.statusHeaderRow}>
          <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
            <View style={[styles.toneMarker, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {paymentStatus.replace('_', ' ')}
            </Text>
          </View>
          <Text style={styles.authoritativeLabel}>Authoritative payment status</Text>
        </View>

        {/* Detail Card 1: Amount matching Figma 53:715 */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>
            {displayAmount.toLocaleString()} {currency}
          </Text>
        </View>

        {/* Detail Card 2: Purpose matching Figma 53:718 */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Purpose</Text>
          <Text style={styles.detailValue}>
            {purpose === 'FULL' ? 'FULL' : purpose === 'DEPOSIT' ? 'DEPOSIT' : 'BALANCE'}
          </Text>
        </View>

        {/* Detail Card 3: Reference matching Figma 53:721 */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Reference</Text>
          <Text style={styles.detailValue}>{chargeRef}</Text>
        </View>

        {/* Detail Card 4: Created / updated matching Figma 53:724 */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Created / updated</Text>
          <Text style={styles.detailValue}>{formattedTimestamp}</Text>
        </View>

        {/* Detail Card 5: Booking matching Figma 53:727 */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Booking</Text>
          <Text style={styles.detailValue}>{booking.status}</Text>
        </View>

        {/* Advisory Warning Banner matching Figma 53:730 */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>Provider/server truth</Text>
          <Text style={styles.warningSubtitle}>
            Do not show payment success from a client callback alone. Refresh authoritative state.
          </Text>
        </View>

        {/* Primary CTA: Return to Booking matching Figma node 14:2 */}
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
          onPress={handleReturnToBooking}
          accessibilityRole="button"
          accessibilityLabel="Return to Booking"
        >
          <Text style={styles.primaryBtnText}>Return to Booking</Text>
        </Pressable>

        {/* Secondary Links matching Figma node 53:735 & 53:736 */}
        <Pressable
          style={styles.actionLink}
          onPress={handleRefreshStatus}
          accessibilityRole="button"
          accessibilityLabel="Refresh status"
        >
          <Text style={styles.actionLinkText}>Refresh status</Text>
        </Pressable>

        <Pressable
          style={styles.actionLink}
          onPress={() => router.push('/support' as never)}
          accessibilityRole="button"
          accessibilityLabel="Support & Legal"
        >
          <Text style={styles.actionLinkText}>Support & Legal</Text>
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

          {/* Trips Tab */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/trips' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <View style={styles.tripsIconWrap}>
              <View style={styles.tripsIconBody} />
              <View style={styles.tripsIconHandle} />
            </View>
            <Text style={styles.navText}>Trips</Text>
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
    height: 44,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  brandLogo: {
    width: 140,
    height: 32,
  },
  headerSpacer: {
    width: 44,
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
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.3,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 14,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toneMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  authoritativeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.1,
    textAlign: 'right',
  },
  detailCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0B0C0E',
    textAlign: 'right',
  },
  warningBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#F7EFD9',
    borderWidth: 1,
    borderColor: '#8A5610',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    gap: 3,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A5610',
  },
  warningSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
  },
  primaryBtn: {
    marginHorizontal: 20,
    marginTop: 22,
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
  actionLink: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#164D53',
    letterSpacing: 0.15,
  },
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
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    position: 'relative',
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5B616B',
    marginTop: 2,
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 4,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#C6A15B',
  },
  tripsIconWrap: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tripsIconBody: {
    width: 18,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#5B616B',
    borderRadius: 3,
    marginTop: 4,
  },
  tripsIconHandle: {
    position: 'absolute',
    top: 2,
    width: 8,
    height: 5,
    borderWidth: 1.5,
    borderColor: '#5B616B',
    borderRadius: 2,
  },
});
