import { getBookingDraft, sampleServices, updateBookingDraft } from '@xtreme/mock-data';
import {
  BackButton,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 49:623
const logoHeader = require('../../assets/logo.png');

const DAYS_OF_WEEK = [
  { id: 'mon', label: 'M' },
  { id: 'tue', label: 'T' },
  { id: 'wed', label: 'W' },
  { id: 'thu', label: 'T' },
  { id: 'fri', label: 'F' },
  { id: 'sat', label: 'S' },
  { id: 'sun', label: 'S' },
];

const TIME_SLOTS = ['09:00 GMT', '11:30 GMT', '14:30 GMT', '17:00 GMT', '20:30 GMT'];

/**
 * CUS-BKG-02: Availability Selection Screen
 * Authoritative Figma Frame: 49:623 (CUS-BKG-02__Availability_Selection__Ready)
 */
export default function AvailabilitySelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    serviceId?: string;
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

  // Selected calendar day (1..31) - default 5th (e.g. 2026-12-05)
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    if (params.date) {
      const parts = params.date.split('-');
      const d = Number.parseInt(parts[parts.length - 1], 10);
      if (!Number.isNaN(d) && d >= 1 && d <= 31) return d;
    }
    return 5;
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(params.time || '14:30 GMT');

  const passengerCount = params.passengers || String(draft.passengers || 2);

  const formattedSelectedDate = useMemo(() => {
    const dayStr = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    return `2026-12-${dayStr}`;
  }, [selectedDay]);

  const handleContinue = () => {
    // Update shared draft store
    updateBookingDraft({
      serviceId: service.id,
      serviceName: service.name,
      bookingMode: service.bookingMode,
      date: formattedSelectedDate,
      time: selectedTimeSlot,
      passengers: Number.parseInt(passengerCount, 10) || 2,
      pickupLocation: params.pickup || draft.pickupLocation,
      dropoffLocation: params.destination || draft.dropoffLocation,
      notes: params.notes || draft.notes,
      amount: service.displayPrice || draft.amount,
      currency: (service.currency as any) || draft.currency,
    });

    // Navigate to CUS-BKG-03 Booking Review with state preserved
    router.push({
      pathname: '/booking/review',
      params: {
        serviceId: service.id,
        serviceName: service.name,
        date: formattedSelectedDate,
        time: selectedTimeSlot,
        pickup: params.pickup || draft.pickupLocation,
        destination: params.destination || draft.dropoffLocation,
        passengers: passengerCount,
        notes: params.notes || draft.notes,
        currency: params.currency || service.currency,
      },
    } as never);
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/discover' as never);
    }
  };

  // Generate 28-day calendar grid (4 weeks of 7 days)
  const calendarDays = useMemo(() => {
    const days: number[] = [];
    for (let i = 1; i <= 28; i++) {
      days.push(i);
    }
    return days;
  }, []);

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
          <Text style={styles.pageTitle}>Availability Selection</Text>
        </View>

        {/* Advisory availability banner */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>Advisory availability • Qty: {passengerCount}</Text>
          <Text style={styles.warningSubtitle}>
            Final booking/reservation revalidates availability transactionally.
          </Text>
        </View>

        {/* Section Heading */}
        <Text style={styles.sectionHeading}>Choose date / time</Text>

        {/* Calendar Grid Card */}
        <View style={styles.calendarCard}>
          {/* Days of week header */}
          <View style={styles.daysHeaderRow}>
            {DAYS_OF_WEEK.map((d) => (
              <Text key={`day-hdr-${d.id}`} style={styles.dayHeaderText}>
                {d.label}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((d) => {
              const isSelected = selectedDay === d;
              return (
                <Pressable
                  key={`cal-day-${d}`}
                  style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                  onPress={() => setSelectedDay(d)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select December ${d}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={[styles.dayCellText, isSelected && styles.dayCellTextSelected]}>
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Time Slots Section */}
        <View style={styles.timeSection}>
          <Text style={styles.timeSectionTitle}>Available slots for {formattedSelectedDate}</Text>
          <View style={styles.timeSlotRow}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <Pressable
                  key={slot}
                  style={[styles.timeSlotPill, isSelected && styles.timeSlotPillSelected]}
                  onPress={() => setSelectedTimeSlot(slot)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select slot ${slot}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>
                    {slot}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Fleet / Chauffeur Advisory Card */}
        <View style={styles.chauffeurCard}>
          <Text style={styles.chauffeurLabel}>Chauffeur status</Text>
          <Text style={styles.chauffeurValue}>
            {service.vehicleModel
              ? `${service.vehicleModel} • Available`
              : 'Protocol Chauffeur • Available'}
          </Text>
        </View>

        {/* Primary Continue Button */}
        <Pressable
          style={({ pressed }) => [styles.continueBtn, pressed && styles.continueBtnPressed]}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to Review"
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </Pressable>

        {/* Cancel Link */}
        <Pressable
          style={styles.cancelLink}
          onPress={handleCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={styles.cancelLinkText}>Cancel</Text>
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
  warningBanner: {
    marginHorizontal: 20,
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
  sectionHeading: {
    marginHorizontal: 20,
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 26,
  },
  calendarCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  dayHeaderText: {
    width: 34,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  dayCell: {
    width: '13%',
    height: 32,
    backgroundColor: '#EEE9E0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellSelected: {
    backgroundColor: '#F1E7D2',
    borderWidth: 1.5,
    borderColor: '#C6A15B',
  },
  dayCellText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  dayCellTextSelected: {
    fontWeight: '700',
    color: '#A88343',
  },
  timeSection: {
    marginHorizontal: 20,
    marginTop: 14,
    gap: 8,
  },
  timeSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  timeSlotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeSlotPillSelected: {
    backgroundColor: '#F1E7D2',
    borderWidth: 1.5,
    borderColor: '#C6A15B',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5B616B',
  },
  timeSlotTextSelected: {
    fontWeight: '700',
    color: '#A88343',
  },
  chauffeurCard: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  chauffeurLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  chauffeurValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0B0C0E',
    flexShrink: 1,
    textAlign: 'right',
  },
  continueBtn: {
    marginHorizontal: 20,
    marginTop: 18,
    height: 48,
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBtnPressed: {
    opacity: 0.88,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelLinkText: {
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
