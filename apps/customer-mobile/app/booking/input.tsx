import { sampleLocations, sampleServices } from '@xtreme/mock-data';
import {
  BackButton,
  ChevronDownIcon,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 49:563
const logoHeader = require('../../assets/logo.png');

const AVAILABLE_CURRENCIES = ['XOF - West African CFA', 'EUR - Euro (€)', 'USD - US Dollar ($)'];

const SCHEDULE_OPTIONS = [
  'Tomorrow, 10:00 GMT',
  'Tomorrow, 14:30 GMT',
  'Tomorrow, 19:00 GMT',
  'In 2 Days, 12:00 GMT',
  'Custom Date & Time',
];

/**
 * CUS-BKG-01: Dynamic Booking Input Screen
 * Authoritative Figma Frame: 49:563 (CUS-BKG-01__Dynamic_Booking_Input__Editing)
 */
export default function DynamicBookingInputScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ serviceId?: string; id?: string }>();
  const activeServiceId = params.serviceId || params.id || 'svc-airport-fasttrack';

  const service = useMemo(() => {
    return sampleServices.find((s) => s.id === activeServiceId) || sampleServices[0];
  }, [activeServiceId]);

  // Form State
  const [configuredFieldValue, setConfiguredFieldValue] = useState(
    'Blaise Diagne Airport, VIP Terminal',
  );
  const [selectedDestination, setSelectedDestination] = useState('Almadies / Ngor, Dakar');
  const [selectedSchedule, setSelectedSchedule] = useState('Tomorrow, 14:30 GMT');
  const [quantity, setQuantity] = useState(2);
  const [customerNotes, setCustomerNotes] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('XOF - West African CFA');

  // Modal selector state
  const [activeModal, setActiveModal] = useState<'destination' | 'schedule' | 'currency' | null>(
    null,
  );

  const destinationOptions = useMemo(() => {
    return sampleLocations.map((l) => `${l.region}, ${l.city}`);
  }, []);

  const handleContinue = () => {
    router.push({
      pathname: '/booking/review',
      params: {
        serviceId: service.id,
        serviceName: service.name,
        pickup: configuredFieldValue,
        destination: selectedDestination,
        schedule: selectedSchedule,
        quantity: String(quantity),
        notes: customerNotes,
        currency: selectedCurrency.split(' ')[0],
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
          <Text style={styles.pageTitle}>Dynamic Booking Input</Text>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>Configured booking</Text>
          <Text style={styles.infoSubtitle}>
            Booking mode comes from the selected service and is not editable.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Field 1: Configured booking field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Configured booking field</Text>
            <View style={styles.fieldBox}>
              <TextInput
                style={styles.fieldInput}
                value={configuredFieldValue}
                onChangeText={setConfiguredFieldValue}
                placeholder="Enter configured value"
                placeholderTextColor="#5B616B"
              />
            </View>
          </View>

          {/* Field 2: Destination */}
          <Pressable
            style={styles.fieldGroup}
            onPress={() => setActiveModal('destination')}
            accessibilityRole="button"
            accessibilityLabel="Select Destination"
          >
            <Text style={styles.fieldLabel}>Destination</Text>
            <View style={styles.fieldBox}>
              <Text
                style={[
                  styles.fieldValueText,
                  selectedDestination === 'Select when required' && styles.placeholderText,
                ]}
              >
                {selectedDestination}
              </Text>
              <View style={styles.indicatorSlot}>
                <ChevronDownIcon size={14} color="#5B616B" />
              </View>
            </View>
          </Pressable>

          {/* Field 3: Schedule */}
          <Pressable
            style={styles.fieldGroup}
            onPress={() => setActiveModal('schedule')}
            accessibilityRole="button"
            accessibilityLabel="Select Schedule"
          >
            <Text style={styles.fieldLabel}>Schedule</Text>
            <View style={styles.fieldBox}>
              <Text
                style={[
                  styles.fieldValueText,
                  selectedSchedule === 'Select date' && styles.placeholderText,
                ]}
              >
                {selectedSchedule}
              </Text>
              <View style={styles.indicatorSlot}>
                <ChevronDownIcon size={14} color="#5B616B" />
              </View>
            </View>
          </Pressable>

          {/* Field 4: Quantity */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <View style={[styles.fieldBox, styles.stepperRow]}>
              <Text style={styles.fieldValueText}>
                {quantity} Passenger{quantity > 1 ? 's' : ''}
              </Text>
              <View style={styles.stepperControls}>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease quantity"
                >
                  <Text style={styles.stepperBtnText}>−</Text>
                </Pressable>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => setQuantity((q) => Math.min(10, q + 1))}
                  accessibilityRole="button"
                  accessibilityLabel="Increase quantity"
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Field 5: Customer Notes */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Customer Notes</Text>
            <View style={styles.notesBox}>
              <TextInput
                style={styles.notesInput}
                value={customerNotes}
                onChangeText={setCustomerNotes}
                placeholder="Optional notes"
                placeholderTextColor="#5B616B"
                multiline={true}
                numberOfLines={2}
              />
            </View>
          </View>

          {/* Field 6: Display Currency */}
          <Pressable
            style={styles.fieldGroup}
            onPress={() => setActiveModal('currency')}
            accessibilityRole="button"
            accessibilityLabel="Select Currency"
          >
            <Text style={styles.fieldLabel}>Display Currency</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValueText}>{selectedCurrency}</Text>
              <View style={styles.indicatorSlot}>
                <ChevronDownIcon size={14} color="#5B616B" />
              </View>
            </View>
          </Pressable>

          {/* Action Buttons */}
          <Pressable
            style={({ pressed }) => [styles.continueBtn, pressed && styles.continueBtnPressed]}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </Pressable>

          <Pressable
            style={styles.cancelLink}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelLinkText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Selector Modal */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveModal(null)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>
              {activeModal === 'destination'
                ? 'Select Destination'
                : activeModal === 'schedule'
                  ? 'Select Schedule'
                  : 'Select Display Currency'}
            </Text>
            <View style={styles.modalDivider} />

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {activeModal === 'destination' &&
                destinationOptions.map((opt) => (
                  <Pressable
                    key={opt}
                    style={[
                      styles.modalItem,
                      selectedDestination === opt && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedDestination(opt);
                      setActiveModal(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedDestination === opt && styles.modalItemTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                ))}

              {activeModal === 'schedule' &&
                SCHEDULE_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt}
                    style={[styles.modalItem, selectedSchedule === opt && styles.modalItemSelected]}
                    onPress={() => {
                      setSelectedSchedule(opt);
                      setActiveModal(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedSchedule === opt && styles.modalItemTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                ))}

              {activeModal === 'currency' &&
                AVAILABLE_CURRENCIES.map((opt) => (
                  <Pressable
                    key={opt}
                    style={[styles.modalItem, selectedCurrency === opt && styles.modalItemSelected]}
                    onPress={() => {
                      setSelectedCurrency(opt);
                      setActiveModal(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedCurrency === opt && styles.modalItemTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>

            <Pressable style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

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

          {/* Bookings Tab (Active in Booking Flow) */}
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
  infoBanner: {
    marginHorizontal: 20,
    backgroundColor: '#E8F0F8',
    borderWidth: 1,
    borderColor: '#2F5E8D',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F5E8D',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  infoSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 14,
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#0B0C0E',
    padding: 0,
  },
  fieldValueText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0B0C0E',
    flex: 1,
  },
  placeholderText: {
    color: '#5B616B',
  },
  indicatorSlot: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#F5EFE0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 20,
  },
  notesBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    height: 62,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  notesInput: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0B0C0E',
    lineHeight: 20,
    textAlignVertical: 'top',
    height: '100%',
    padding: 0,
  },
  continueBtn: {
    height: 48,
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
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
    paddingVertical: 4,
  },
  cancelLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#164D53',
    letterSpacing: 0.15,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxHeight: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D8D0C4',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0C0E',
    marginBottom: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    marginBottom: 12,
  },
  modalList: {
    maxHeight: 220,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: '#F5EFE0',
  },
  modalItemText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0B0C0E',
  },
  modalItemTextSelected: {
    fontWeight: '600',
    color: '#164D53',
  },
  modalCloseBtn: {
    marginTop: 14,
    height: 40,
    backgroundColor: '#0B0C0E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
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
