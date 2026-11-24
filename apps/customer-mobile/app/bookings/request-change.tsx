import {
  getAllBookings,
  getBookingById,
  updateBooking,
  updateBookingDraft,
} from '@xtreme/mock-data';
import type { BookingRecord } from '@xtreme/types';
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
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logoHeader = require('../../assets/logo.png');

/**
 * CUS-CHG-01: Request Booking Modification Screen
 * Authoritative Figma Frame: 53:749 (CUS-CHG-01__Request_Booking_Modification__Editing)
 */
export default function RequestChangeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    bookingId?: string;
    id?: string;
  }>();

  const activeBookingId = params.bookingId || params.id;

  const booking: BookingRecord | undefined = useMemo(() => {
    if (activeBookingId) {
      return getBookingById(activeBookingId);
    }
    return getAllBookings()[0];
  }, [activeBookingId]);

  const [requestedChanges, setRequestedChanges] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const handleSubmit = () => {
    if (!booking) return;

    if (!requestedChanges.trim()) {
      setValidationError('Please describe the requested changes.');
      return;
    }
    setValidationError(null);
    setIsSubmitting(true);

    const modRecord = {
      id: `mod-${Date.now()}`,
      bookingId: booking.id,
      requestedChanges: requestedChanges.trim(),
      reason: reason.trim() || undefined,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    };

    // Update authoritative booking in live repository
    updateBooking(booking.id, {
      modificationRequest: modRecord,
    });

    // Update shared draft
    updateBookingDraft({
      id: booking.id,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
    }, 400);
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace((booking ? `/bookings/detail?bookingId=${booking.id}` : '/bookings') as never);
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          <Text style={styles.pageTitle}>Request Booking Modification</Text>
        </View>

        {/* Current Booking Card matching Figma 53:754 */}
        <View style={styles.currentBookingCard}>
          <Text style={styles.currentBookingTitle}>Current Booking</Text>
          <Text style={styles.currentBookingSubtitle}>
            {booking.reference} • {booking.date} • {booking.status}
          </Text>
        </View>

        {/* Request Type Card matching Figma 53:757 */}
        <View style={styles.requestTypeCard}>
          <Text style={styles.requestTypeLabel}>Request Type</Text>
          <Text style={styles.requestTypeValue}>MODIFICATION</Text>
        </View>

        {isSubmittedSuccess ? (
          /* Success State View */
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Modification Request Submitted</Text>
            <Text style={styles.successSubtitle}>
              Our concierge team will review your requested changes and update your itinerary. The
              authoritative booking remains active while pending review.
            </Text>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => router.replace(`/bookings/detail?bookingId=${booking.id}` as never)}
              accessibilityRole="button"
              accessibilityLabel="Return to Booking Detail"
            >
              <Text style={styles.primaryBtnText}>Return to Booking Detail</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Form Section 1: Requested Changes matching Figma 53:760 */}
            <View style={styles.formSection}>
              <Text style={styles.inputSectionTitle}>Requested Changes</Text>
              <View
                style={[
                  styles.textareaWrapLarge,
                  validationError ? styles.textareaError : undefined,
                ]}
              >
                <TextInput
                  style={styles.textareaInput}
                  value={requestedChanges}
                  onChangeText={(val) => {
                    setRequestedChanges(val);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Describe the requested changes"
                  placeholderTextColor="#5B616B"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              {validationError && <Text style={styles.errorText}>{validationError}</Text>}
            </View>

            {/* Form Section 2: Reason matching Figma 53:763 */}
            <View style={styles.formSection}>
              <Text style={styles.inputSectionTitle}>Reason</Text>
              <View style={styles.textareaWrapSmall}>
                <TextInput
                  style={styles.textareaInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Optional reason"
                  placeholderTextColor="#5B616B"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Info Banner matching Figma 53:766 */}
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerTitle}>Request only</Text>
              <Text style={styles.infoBannerSubtitle}>
                The authoritative booking does not change while this request is pending.
              </Text>
            </View>

            {/* Primary CTA: Submit modification request matching Figma 14:2 */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.primaryBtnPressed,
                isSubmitting && styles.primaryBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Submit modification request"
            >
              <Text style={styles.primaryBtnText}>
                {isSubmitting ? 'Submitting...' : 'Submit modification request'}
              </Text>
            </Pressable>

            {/* Cancel link matching Figma 53:771 */}
            <Pressable
              style={styles.cancelLink}
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.cancelLinkText}>Cancel</Text>
            </Pressable>
          </>
        )}
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
    </KeyboardAvoidingView>
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
  currentBookingCard: {
    marginHorizontal: 20,
    backgroundColor: '#F1E7D2',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    gap: 5,
  },
  currentBookingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  currentBookingSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5B616B',
  },
  requestTypeCard: {
    marginHorizontal: 20,
    marginTop: 16,
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
  requestTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  requestTypeValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0B0C0E',
    textAlign: 'right',
  },
  formSection: {
    marginHorizontal: 20,
    marginTop: 16,
    gap: 6,
  },
  inputSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  textareaWrapLarge: {
    height: 110,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    padding: 11,
  },
  textareaWrapSmall: {
    height: 90,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    padding: 11,
  },
  textareaError: {
    borderColor: '#C93B2B',
  },
  textareaInput: {
    flex: 1,
    fontSize: 14,
    color: '#0B0C0E',
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    color: '#C93B2B',
    marginTop: 4,
  },
  infoBanner: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: '#E8F0F8',
    borderWidth: 1,
    borderColor: '#2F5E8D',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    gap: 3,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F5E8D',
  },
  infoBannerSubtitle: {
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
  successCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  successIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F2EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F6B4A',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0C0E',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#5B616B',
    textAlign: 'center',
    lineHeight: 20,
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
