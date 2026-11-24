import {
  addConciergeRequest,
  addConversation,
  generateConciergeReference,
  getAllBookings,
  sampleTrips,
} from '@xtreme/mock-data';
import type { ConciergeRequestRecord } from '@xtreme/types';
import { ChevronDownIcon, CustomerBottomNav } from '@xtreme/ui';
import { useRouter } from 'expo-router';
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
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../../assets/logo.png');

const REQUEST_TYPES = [
  'Plan My Entire Trip (Full Itinerary)',
  'VIP Airport Protocol & Transfer',
  'Private Aviation & Jet Charter',
  'Luxury Villa & Estate Rental',
  'Exclusive Dining & Private Chef',
  'Custom Lifestyle Request',
];

/**
 * CUS-CON-01: Plan My Entire Trip / Concierge Request
 * Authoritative Figma Frame: 60:916 (CUS-CON-01__Plan_My_Entire_Trip_Concierge_Request__Editing)
 */
export default function PlanTripScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form State
  const [requestType, setRequestType] = useState<string>('Plan My Entire Trip (Full Itinerary)');
  const [tripContext, setTripContext] = useState<string>('Select linked trip when applicable');
  const [serviceContext, setServiceContext] = useState<string>('Selected service when applicable');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Picker modals
  const [activePicker, setActivePicker] = useState<'type' | 'trip' | 'service' | null>(null);

  const bookings = useMemo(() => getAllBookings(), []);

  const tripOptions = useMemo(() => {
    const list = sampleTrips.map((t) => t.title);
    return ['None / Standalone Trip', ...list];
  }, []);

  const serviceOptions = useMemo(() => {
    const list = bookings.map((b) => b.serviceName);
    const unique = Array.from(new Set(list));
    return ['None / General Concierge', ...unique];
  }, [bookings]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/concierge/requests' as never);
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const ref = generateConciergeReference();
    const reqId = `req-con-${Date.now()}`;
    const convId = `conv-${Date.now()}`;

    const newRequest: ConciergeRequestRecord = {
      id: reqId,
      reference: ref,
      customerId: 'demo-cus-001',
      title: requestType.split('(')[0].trim(),
      type: 'PLAN_TRIP',
      details: details.trim() || 'Comprehensive trip planning request with custom preferences.',
      tripContext: tripContext !== 'Select linked trip when applicable' ? tripContext : undefined,
      serviceContext:
        serviceContext !== 'Selected service when applicable' ? serviceContext : undefined,
      startDate: '2026-12-10',
      guestCount: 2,
      budgetNotes: 'Bespoke luxury tier',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationId: convId,
    };

    addConciergeRequest(newRequest);

    addConversation({
      id: convId,
      requestId: reqId,
      subject: newRequest.title,
      lastMessageSnippet: 'Concierge request submitted. Lifestyle manager assigned.',
      lastUpdated: 'Just now',
      unreadCount: 0,
      status: 'READ',
    });

    setIsSubmitting(false);
    router.replace({
      pathname: '/concierge/request-detail',
      params: { id: reqId, reference: ref },
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
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19L8 12L15 5"
                stroke="#164D53"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>

          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title */}
        <View style={styles.titleWrap}>
          <Text style={styles.pageTitle}>Plan My Entire Trip / Concierge Request</Text>
        </View>

        {/* Info Banner matching Figma node 60:921 */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>Request only</Text>
          <Text style={styles.infoBody}>
            No inventory is reserved. Concrete bookings use the normal Booking + Availability flow.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Field 1: Request Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Request Type</Text>
            <Pressable
              style={styles.selectField}
              onPress={() => setActivePicker('type')}
              accessibilityRole="combobox"
              accessibilityLabel="Select request type"
            >
              <Text style={styles.selectValue} numberOfLines={1}>
                {requestType}
              </Text>
              <ChevronDownIcon size={12} color="#164D53" />
            </Pressable>
          </View>

          {/* Field 2: Trip Context (optional) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Trip Context (optional)</Text>
            <Pressable
              style={styles.selectField}
              onPress={() => setActivePicker('trip')}
              accessibilityRole="combobox"
              accessibilityLabel="Select trip context"
            >
              <Text
                style={[
                  styles.selectValue,
                  tripContext.startsWith('Select') && styles.selectPlaceholder,
                ]}
                numberOfLines={1}
              >
                {tripContext}
              </Text>
              <ChevronDownIcon size={12} color="#164D53" />
            </Pressable>
          </View>

          {/* Field 3: Service Context (optional) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Service Context (optional)</Text>
            <Pressable
              style={styles.selectField}
              onPress={() => setActivePicker('service')}
              accessibilityRole="combobox"
              accessibilityLabel="Select service context"
            >
              <Text
                style={[
                  styles.selectValue,
                  serviceContext.startsWith('Select') && styles.selectPlaceholder,
                ]}
                numberOfLines={1}
              >
                {serviceContext}
              </Text>
              <ChevronDownIcon size={12} color="#164D53" />
            </Pressable>
          </View>

          {/* Field 4: Details */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Details</Text>
            <View style={styles.textAreaBox}>
              <TextInput
                style={styles.textAreaInput}
                multiline
                numberOfLines={4}
                value={details}
                onChangeText={setDetails}
                placeholder="Describe the request"
                placeholderTextColor="#5B616B"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            style={styles.submitBtn}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit request"
          >
            <Text style={styles.submitBtnText}>Submit request</Text>
          </Pressable>

          {/* Cancel Button */}
          <Pressable
            style={styles.cancelBtn}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Cancel request"
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal Picker */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActivePicker(null)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>
              {activePicker === 'type'
                ? 'Select Request Type'
                : activePicker === 'trip'
                  ? 'Select Trip Context'
                  : 'Select Service Context'}
            </Text>
            <ScrollView style={{ maxHeight: 280 }}>
              {(activePicker === 'type'
                ? REQUEST_TYPES
                : activePicker === 'trip'
                  ? tripOptions
                  : serviceOptions
              ).map((item) => (
                <Pressable
                  key={item}
                  style={styles.pickerOption}
                  onPress={() => {
                    if (activePicker === 'type') setRequestType(item);
                    else if (activePicker === 'trip') setTripContext(item);
                    else if (activePicker === 'service') setServiceContext(item);
                    setActivePicker(null);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Bottom Navigation */}
      <CustomerBottomNav
        activeTab="Concierge"
        bottomInset={insets.bottom}
        onTabPress={(tab) => {
          if (tab === 'Home') router.push('/discover' as never);
          else if (tab === 'Bookings') router.push('/bookings' as never);
          else if (tab === 'Trips') router.push('/trips' as never);
          else if (tab === 'Concierge') router.push('/concierge/requests' as never);
          else if (tab === 'Profile') router.push('/account/profile' as never);
        }}
      />
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  titleWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
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
    borderColor: '#2F5E8D',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    gap: 3,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F5E8D',
    lineHeight: 20,
  },
  infoBody: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  selectField: {
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
  selectValue: {
    fontSize: 15,
    color: '#0B0C0E',
    flex: 1,
    marginRight: 8,
  },
  selectPlaceholder: {
    color: '#5B616B',
  },
  textAreaBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    height: 138,
    padding: 12,
  },
  textAreaInput: {
    flex: 1,
    fontSize: 14,
    color: '#0B0C0E',
    lineHeight: 22,
  },
  submitBtn: {
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  cancelBtn: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#164D53',
    letterSpacing: 0.15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DDD8CF',
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0C0E',
    marginBottom: 14,
  },
  pickerOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE9E0',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#0B0C0E',
  },
});
