import {
  convertFromBaseXof,
  getAllBookings,
  getBookingById,
  updateBooking,
  updateBookingDraft,
} from '@xtreme/mock-data';
import type { BookingRecord, CurrencyCode, PaymentPurpose, PaymentStatus } from '@xtreme/types';
import {
  BackButton,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
  NotFoundCard,
  useMockAuth,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logoHeader = require('../../assets/logo.png');

/**
 * CUS-PAY-02: Stripe Payment Action (Simulated Provider-Controlled Step)
 * Authoritative Figma Frame: 52:832 (CUS-PAY-02__Stripe_Payment_Action__REQUIRES_ACTION)
 */
export default function CheckoutPreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scenario } = useMockAuth();
  const params = useLocalSearchParams<{
    bookingId?: string;
    id?: string;
    purpose?: PaymentPurpose;
    currency?: CurrencyCode;
    amount?: string;
    baseAmountXof?: string;
  }>();

  const activeBookingId = params.bookingId || params.id;

  const booking: BookingRecord | undefined = useMemo(() => {
    if (activeBookingId) {
      return getBookingById(activeBookingId);
    }
    return getAllBookings()[0];
  }, [activeBookingId]);

  const purpose: PaymentPurpose = params.purpose || booking?.paymentPurpose || 'FULL';
  const currency: CurrencyCode = params.currency || booking?.currency || 'XOF';

  const baseAmountXof = params.baseAmountXof
    ? Number.parseInt(params.baseAmountXof, 10)
    : purpose === 'DEPOSIT'
      ? Math.round((booking?.amount || 95000) * 0.5)
      : purpose === 'BALANCE'
        ? Math.round((booking?.amount || 95000) * 0.5)
        : booking?.amount || 95000;

  const {
    amount: displayAmount,
    rate,
    isConverted,
  } = useMemo(() => {
    return convertFromBaseXof(baseAmountXof, currency);
  }, [baseAmountXof, currency]);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompleteAction = () => {
    if (!booking) return;

    setIsProcessing(true);

    // Derive mock payment outcome from isolated QA scenario (never customer-facing)
    let resolvedPaymentStatus: PaymentStatus = 'SUCCEEDED';
    if (scenario === 'failure') {
      resolvedPaymentStatus = 'FAILED';
    } else if (scenario === 'pending') {
      resolvedPaymentStatus = 'PROCESSING';
    }

    const mockPaymentRef = `ch_stripe_demo_${Math.floor(100000 + Math.random() * 900000)}`;

    // Update authoritative booking record in repository
    updateBooking(booking.id, {
      paymentStatus: resolvedPaymentStatus,
      paymentPurpose: purpose,
      paymentReference: mockPaymentRef,
    });

    // Update shared draft
    updateBookingDraft({
      id: booking.id,
      paymentStatus: resolvedPaymentStatus,
    });

    setTimeout(() => {
      setIsProcessing(false);
      router.push({
        pathname: '/payments/status',
        params: {
          bookingId: booking.id,
          reference: booking.reference,
          status: resolvedPaymentStatus,
          purpose,
          currency,
          amount: String(displayAmount),
          chargeReference: mockPaymentRef,
        },
      } as never);
    }, 400);
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace((booking ? `/payments/choice?bookingId=${booking.id}` : '/bookings') as never);
    }
  };

  if (!booking) {
    return (
      <View style={styles.screen}>
        <View style={[styles.scrollContent, { paddingTop: insets.top + 8, paddingHorizontal: 20 }]}>
          <View style={styles.headerRow}>
            <BackButton onPress={handleCancel} />
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
          <BackButton onPress={handleCancel} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Stripe Payment Action</Text>
        </View>

        {/* Accent Banner matching Figma 52:837 */}
        <View style={styles.accentBanner}>
          <Text style={styles.accentTitle}>Stripe Payment Action</Text>
          <Text style={styles.accentSubtitle}>Provider-controlled payment step</Text>
        </View>

        {/* Status Pill: REQUIRES ACTION matching Figma 20:186 */}
        <View style={styles.statusPillRow}>
          <View style={styles.requiresActionPill}>
            <View style={styles.warningToneMarker} />
            <Text style={styles.requiresActionText}>REQUIRES ACTION</Text>
          </View>
        </View>

        {/* Detail Card 1: Payment Purpose matching Figma 52:843 */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Payment purpose</Text>
          <Text style={styles.detailValue}>
            {purpose === 'FULL' ? 'FULL' : purpose === 'DEPOSIT' ? 'DEPOSIT' : 'BALANCE'}
          </Text>
        </View>

        {/* Detail Card 2: Amount / Currency matching Figma 52:846 */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Amount / currency</Text>
          <Text style={styles.detailValue}>
            {displayAmount.toLocaleString()} {currency}
            {isConverted && ` (Ref: 1 ${currency} = ${rate} XOF)`}
          </Text>
        </View>

        {/* Provider UI Card matching Figma 52:849 (Zero QA switches in customer UI) */}
        <View style={styles.providerCard}>
          <View style={styles.providerCardHeader}>
            <Text style={styles.providerLabel}>Payment method / provider UI</Text>
          </View>
          <View style={styles.simulatedCardRow}>
            <View style={styles.cardBrandBadge}>
              <Text style={styles.cardBrandText}>CARD</Text>
            </View>
            <Text style={styles.cardNumberText}>•••• •••• •••• 4242</Text>
            <Text style={styles.cardExpiryText}>12/28</Text>
          </View>
          <Text style={styles.providerNote}>Simulated Stripe Mobile PaymentSheet</Text>
        </View>

        {/* Advisory Warning Banner matching Figma 52:851 */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>Server reconciliation required</Text>
          <Text style={styles.warningSubtitle}>
            Provider/client return is not final booking or payment truth.
          </Text>
        </View>

        {/* Primary CTA: Complete / Retry Provider Action matching Figma node 14:2 */}
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
            isProcessing && styles.primaryBtnDisabled,
          ]}
          onPress={handleCompleteAction}
          disabled={isProcessing}
          accessibilityRole="button"
          accessibilityLabel="Complete / Retry Provider Action"
        >
          <Text style={styles.primaryBtnText}>
            {isProcessing ? 'Processing...' : 'Complete / Retry Provider Action'}
          </Text>
        </Pressable>

        {/* Cancel / Return link matching Figma node 52:856 */}
        <Pressable
          style={styles.cancelLink}
          onPress={handleCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel / return"
        >
          <Text style={styles.cancelLinkText}>Cancel / return</Text>
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
  accentBanner: {
    marginHorizontal: 20,
    backgroundColor: '#F1E7D2',
    borderRadius: 14,
    padding: 14,
    gap: 5,
  },
  accentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  accentSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5B616B',
  },
  statusPillRow: {
    marginHorizontal: 20,
    marginTop: 18,
    alignItems: 'flex-start',
  },
  requiresActionPill: {
    backgroundColor: '#F7EFD9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningToneMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8A5610',
  },
  requiresActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A5610',
    letterSpacing: 0.15,
  },
  detailCard: {
    marginHorizontal: 20,
    marginTop: 12,
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
  providerCard: {
    marginHorizontal: 20,
    marginTop: 14,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 14,
    padding: 14,
    justifyContent: 'space-between',
  },
  providerCardHeader: {
    alignItems: 'center',
  },
  providerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  simulatedCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F9F8F5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cardBrandBadge: {
    backgroundColor: '#0B0C0E',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cardBrandText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 1,
  },
  cardExpiryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
  },
  providerNote: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5B616B',
    textAlign: 'center',
  },
  warningBanner: {
    marginHorizontal: 20,
    marginTop: 18,
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
    marginTop: 20,
    height: 48,
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnPressed: {
    opacity: 0.88,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  cancelLink: {
    marginTop: 14,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLinkText: {
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
