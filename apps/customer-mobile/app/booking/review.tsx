import {
  addBooking,
  generateBookingReference,
  getBookingDraft,
  sampleServices,
  updateBookingDraft,
} from '@xtreme/mock-data';
import type {
  BookingMode,
  BookingRecord,
  BookingStatus,
  CurrencyCode,
  PaymentStatus,
} from '@xtreme/types';
import {
  BackButton,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 49:732
const logoHeader = require('../../assets/logo.png');

/**
 * CUS-BKG-03: Booking Review Screen
 * Authoritative Figma Frame: 49:732 (CUS-BKG-03__Booking_Review__Ready)
 */
export default function BookingReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    serviceId?: string;
    serviceName?: string;
    date?: string;
    time?: string;
    pickup?: string;
    destination?: string;
    passengers?: string;
    notes?: string;
    currency?: string;
  }>();

  const draft = useMemo(() => getBookingDraft(), []);
  const activeServiceId = params.serviceId || draft.serviceId || 'svc-airport-fasttrack';
  const service = useMemo(() => {
    return sampleServices.find((s) => s.id === activeServiceId) || sampleServices[0];
  }, [activeServiceId]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consolidated booking values combining query parameters and shared draft store
  const reviewData = useMemo(() => {
    const serviceName = params.serviceName || draft.serviceName || service.name;
    const date = params.date || draft.date || '2026-12-05';
    const time = params.time || draft.time || '14:30 GMT';
    const passengers = params.passengers || String(draft.passengers || 2);
    const destination =
      params.destination || draft.dropoffLocation || 'Almadies / Ngor Beach, Dakar';
    const pickup = params.pickup || draft.pickupLocation || 'Blaise Diagne Airport, VIP Terminal';
    const notes = params.notes !== undefined ? params.notes : draft.notes || '';
    const currency =
      (params.currency as CurrencyCode) || draft.currency || service.currency || 'XOF';
    const amount = service.displayPrice || draft.amount || 95000;
    const bookingMode: BookingMode = service.bookingMode || draft.bookingMode || 'INSTANT';

    return {
      serviceName,
      date,
      time,
      passengers,
      destination,
      pickup,
      notes,
      currency,
      amount,
      bookingMode,
    };
  }, [params, draft, service]);

  const handleSubmitBooking = () => {
    setIsSubmitting(true);

    const generatedRef = generateBookingReference();
    const newBookingId = `bkg-${Date.now()}`;
    const paymentStatus: PaymentStatus = 'PENDING';
    const operationalStatus: BookingStatus =
      reviewData.bookingMode === 'INSTANT' ? 'CONFIRMED' : 'PENDING_VENDOR';

    const newBookingRecord: BookingRecord = {
      id: newBookingId,
      reference: generatedRef,
      customerId: 'demo-cus-001',
      serviceId: service.id,
      serviceName: reviewData.serviceName,
      bookingMode: reviewData.bookingMode,
      status: operationalStatus,
      date: reviewData.date,
      time: reviewData.time,
      schedule: `${reviewData.date} • ${reviewData.time}`,
      pickupLocation: reviewData.pickup,
      dropoffLocation: reviewData.destination,
      passengers: Number.parseInt(reviewData.passengers, 10) || 2,
      quantity: Number.parseInt(reviewData.passengers, 10) || 2,
      currency: reviewData.currency,
      amount: reviewData.amount,
      depositAmount: Math.round(reviewData.amount * 0.5),
      remainingBalance: Math.round(reviewData.amount * 0.5),
      paymentStatus: paymentStatus,
      paymentMethod: 'STRIPE_CARD',
      notes: reviewData.notes,
      createdAt: new Date().toISOString(),
    };

    // Add to shared live bookings repository so My Bookings and Booking Detail can resolve it immediately
    addBooking(newBookingRecord);

    // Update shared draft store with committed values
    updateBookingDraft({
      id: newBookingId,
      serviceId: service.id,
      serviceName: reviewData.serviceName,
      bookingMode: reviewData.bookingMode,
      date: reviewData.date,
      time: reviewData.time,
      schedule: `${reviewData.date} • ${reviewData.time}`,
      passengers: Number.parseInt(reviewData.passengers, 10) || 2,
      quantity: Number.parseInt(reviewData.passengers, 10) || 2,
      pickupLocation: reviewData.pickup,
      dropoffLocation: reviewData.destination,
      notes: reviewData.notes,
      amount: reviewData.amount,
      depositAmount: Math.round(reviewData.amount * 0.5),
      remainingBalance: Math.round(reviewData.amount * 0.5),
      currency: reviewData.currency,
      reference: generatedRef,
      status: operationalStatus,
      paymentStatus: paymentStatus,
    });

    // Seamlessly navigate to CUS-BKG-04 Booking Submitted outcome screen
    setTimeout(() => {
      setIsSubmitting(false);
      router.push({
        pathname: '/booking/submitted',
        params: {
          bookingId: newBookingId,
          reference: generatedRef,
          serviceId: service.id,
          serviceName: reviewData.serviceName,
          bookingMode: reviewData.bookingMode,
          date: reviewData.date,
          time: reviewData.time,
          amount: String(reviewData.amount),
          currency: reviewData.currency,
          paymentStatus: paymentStatus,
          status: operationalStatus,
        },
      } as never);
    }, 350);
  };

  const handleEditDetails = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: '/booking/input',
        params: { serviceId: service.id },
      } as never);
    }
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
          <BackButton onPress={handleEditDetails} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Booking Review</Text>
        </View>

        {/* Section Heading */}
        <Text style={styles.sectionHeading}>Review booking</Text>

        {/* 8 Review Cards matching Figma node 49:738 to 49:759 */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Service */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardLabel}>Service</Text>
            <Text style={styles.cardValue} numberOfLines={1}>
              {reviewData.serviceName}
            </Text>
          </View>

          {/* Card 2: Schedule */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardLabel}>Schedule</Text>
            <Text style={styles.cardValue}>
              {reviewData.date} • {reviewData.time}
            </Text>
          </View>

          {/* Card 3: Quantity */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardLabel}>Quantity</Text>
            <Text style={styles.cardValue}>
              {reviewData.passengers} Passenger
              {Number.parseInt(reviewData.passengers, 10) > 1 ? 's' : ''}
            </Text>
          </View>

          {/* Card 4: Location */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardLabel}>Location</Text>
            <Text style={styles.cardValue} numberOfLines={1}>
              {reviewData.destination}
            </Text>
          </View>

          {/* Card 5: Booking fields (Pickup location) */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardLabel}>Booking fields</Text>
            <Text style={styles.cardValue} numberOfLines={1}>
              {reviewData.pickup}
            </Text>
          </View>

          {/* Card 6: Customer notes */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardLabel}>Customer notes</Text>
            <Text style={styles.cardValue} numberOfLines={1}>
              {reviewData.notes || 'No special requests'}
            </Text>
          </View>

          {/* Card 7: Customer price */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardLabel}>Customer price</Text>
            <Text style={[styles.cardValue, styles.priceValue]}>
              {reviewData.amount.toLocaleString()} {reviewData.currency}
            </Text>
          </View>

          {/* Card 8: Booking mode */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardLabel}>Booking mode</Text>
            <Text style={styles.cardValue}>
              {reviewData.bookingMode === 'INSTANT'
                ? 'Instant Confirmation'
                : reviewData.bookingMode === 'REQUEST_TO_BOOK'
                  ? 'Request to Book'
                  : 'Concierge Request'}
            </Text>
          </View>
        </View>

        {/* Advisory / Policy Box */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>Important</Text>
          <Text style={styles.warningSubtitle}>
            Availability is advisory until the authoritative booking commit succeeds.
          </Text>
        </View>

        {/* Primary Action Button */}
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            (pressed || isSubmitting) && styles.submitBtnPressed,
          ]}
          onPress={handleSubmitBooking}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Submit Booking"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Booking</Text>
          )}
        </Pressable>

        {/* Secondary Edit Link */}
        <Pressable
          style={styles.editLink}
          onPress={handleEditDetails}
          accessibilityRole="button"
          accessibilityLabel="Edit details"
        >
          <Text style={styles.editLinkText}>Edit details</Text>
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
  sectionHeading: {
    marginHorizontal: 20,
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 26,
  },
  cardsContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    gap: 8,
  },
  reviewCard: {
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
  warningBanner: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: '#F7EFD9',
    borderWidth: 1,
    borderColor: '#8A5610',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A5610',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  warningSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  submitBtn: {
    marginHorizontal: 20,
    marginTop: 18,
    height: 48,
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnPressed: {
    opacity: 0.88,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  editLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  editLinkText: {
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
