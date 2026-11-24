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
import Svg, { Path } from 'react-native-svg';

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

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
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
    quantity?: string;
    notes?: string;
    currency?: string;
  }>();

  const draft = getBookingDraft();
  const activeServiceId = params.serviceId || draft.serviceId || 'svc-airport-fasttrack';

  const service = useMemo(() => {
    return sampleServices.find((s) => s.id === activeServiceId) || sampleServices[0];
  }, [activeServiceId]);

  // Today reference
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  const currentDay = now.getDate();
  const todayStr = useMemo(() => {
    const m = (currentMonth + 1).toString().padStart(2, '0');
    const d = currentDay.toString().padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  }, [currentYear, currentMonth, currentDay]);

  // View state for month/year navigation
  const [viewDate, setViewDate] = useState(() => {
    if (params.date) {
      const parts = params.date.split('-');
      if (parts.length === 3) {
        const y = Number.parseInt(parts[0], 10);
        const m = Number.parseInt(parts[1], 10) - 1;
        if (!Number.isNaN(y) && !Number.isNaN(m)) {
          return new Date(y, m, 1);
        }
      }
    }
    return new Date(currentYear, currentMonth, 1);
  });

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth(); // 0-11
  const daysInViewMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const isCurrentMonth = viewYear === currentYear && viewMonth === currentMonth;
  const isPastMonth =
    viewYear < currentYear || (viewYear === currentYear && viewMonth < currentMonth);
  const canGoPrevMonth = !isCurrentMonth && !isPastMonth;

  const handlePrevMonth = () => {
    if (canGoPrevMonth) {
      setViewDate(new Date(viewYear, viewMonth - 1, 1));
    }
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  // Selected date ISO string
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (params.date && params.date >= todayStr) {
      return params.date;
    }
    // Default to tomorrow or today
    const tomorrow = new Date(currentYear, currentMonth, currentDay + 1);
    const m = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const d = tomorrow.getDate().toString().padStart(2, '0');
    return `${tomorrow.getFullYear()}-${m}-${d}`;
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(params.time || '14:30 GMT');

  const passengerCount = params.passengers || params.quantity || String(draft.passengers || 2);

  const handleContinue = () => {
    if (selectedDate < todayStr) {
      return; // Prevent past date booking
    }
    const scheduleStr = `${selectedDate} • ${selectedTimeSlot}`;

    // Update shared draft store
    updateBookingDraft({
      serviceId: service.id,
      serviceName: service.name,
      bookingMode: service.bookingMode,
      date: selectedDate,
      time: selectedTimeSlot,
      schedule: scheduleStr,
      passengers: Number.parseInt(passengerCount, 10) || 2,
      quantity: Number.parseInt(passengerCount, 10) || 2,
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
        date: selectedDate,
        time: selectedTimeSlot,
        schedule: scheduleStr,
        pickup: params.pickup || draft.pickupLocation,
        destination: params.destination || draft.dropoffLocation,
        passengers: passengerCount,
        quantity: passengerCount,
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

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: number[] = [];
    for (let i = 1; i <= daysInViewMonth; i++) {
      days.push(i);
    }
    return days;
  }, [daysInViewMonth]);

  const trailingSpacers = useMemo(() => {
    const rem = calendarDays.length % 7;
    return rem === 0 ? 0 : 7 - rem;
  }, [calendarDays.length]);

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
          {/* Month / Year Navigation */}
          <View style={styles.monthHeaderRow}>
            <Pressable
              onPress={handlePrevMonth}
              disabled={!canGoPrevMonth}
              style={[styles.monthNavBtn, !canGoPrevMonth && styles.monthNavBtnDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Previous month"
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 19L8 12L15 5"
                  stroke={canGoPrevMonth ? '#0B0C0E' : '#A0A7B1'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
            <Text style={styles.monthLabel}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <Pressable
              onPress={handleNextMonth}
              style={styles.monthNavBtn}
              accessibilityRole="button"
              accessibilityLabel="Next month"
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 5L16 12L9 19"
                  stroke="#0B0C0E"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          </View>

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
              const mStr = (viewMonth + 1).toString().padStart(2, '0');
              const dStr = d.toString().padStart(2, '0');
              const cellDateStr = `${viewYear}-${mStr}-${dStr}`;
              const isPast = cellDateStr < todayStr;
              const isSelected = selectedDate === cellDateStr;

              return (
                <Pressable
                  key={`cal-day-${d}`}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isPast && styles.dayCellDisabled,
                  ]}
                  onPress={() => !isPast && setSelectedDate(cellDateStr)}
                  disabled={isPast}
                  accessibilityRole="button"
                  accessibilityLabel={`Select Day ${d}`}
                  accessibilityState={{ selected: isSelected, disabled: isPast }}
                >
                  <Text
                    style={[
                      styles.dayCellText,
                      isSelected && styles.dayCellTextSelected,
                      isPast && styles.dayCellTextDisabled,
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
            {Array.from(
              { length: trailingSpacers },
              (_, i) => `cal-pad-${viewYear}-${viewMonth}-${i}`,
            ).map((keyId) => (
              <View key={keyId} style={styles.daySpacerCell} />
            ))}
          </View>
        </View>

        {/* Available Time Slots Section */}
        <View style={styles.timeSection}>
          <Text style={styles.timeSectionTitle}>Available slots for {selectedDate}</Text>
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
            onPress={() => router.push('/concierge/requests' as never)}
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
  warningBanner: {
    marginHorizontal: 20,
    backgroundColor: '#FAF6EF',
    borderWidth: 1,
    borderColor: '#E4D7B5',
    borderRadius: 14,
    padding: 14,
    gap: 4,
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
  sectionHeading: {
    marginHorizontal: 20,
    marginTop: 18,
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  calendarCard: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF8F4',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthNavBtnDisabled: {
    opacity: 0.35,
    borderColor: '#E8E5DF',
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.2,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayHeaderText: {
    width: '13%',
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
  dayCellDisabled: {
    backgroundColor: '#F7F6F2',
    opacity: 0.4,
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
  dayCellTextDisabled: {
    color: '#A0A4AC',
  },
  daySpacerCell: {
    width: '13%',
    height: 32,
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
});
