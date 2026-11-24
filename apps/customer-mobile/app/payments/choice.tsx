import { getAllBookings, getBookingById, updateBookingDraft } from '@xtreme/mock-data';
import type { BookingRecord, CurrencyCode, PaymentPurpose } from '@xtreme/types';
import {
  BackButton,
  ChevronDownIcon,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
  NotFoundCard,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logoHeader = require('../../assets/logo.png');

const CURRENCY_OPTIONS: { code: CurrencyCode; label: string }[] = [
  { code: 'XOF', label: 'XOF - West African CFA (Base)' },
  { code: 'EUR', label: 'EUR - Euro (€ Reference)' },
  { code: 'USD', label: 'USD - US Dollar ($ Reference)' },
];

/**
 * CUS-PAY-01: Payment Choice Screen
 * Authoritative Figma Frame: 52:786 (CUS-PAY-01__Payment_Choice__Ready)
 */
export default function PaymentChoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    bookingId?: string;
    id?: string;
    purpose?: PaymentPurpose;
    currency?: CurrencyCode;
  }>();

  const activeBookingId = params.bookingId || params.id;

  const booking: BookingRecord | undefined = useMemo(() => {
    if (activeBookingId) {
      return getBookingById(activeBookingId);
    }
    // Demo fallback when opened directly
    return getAllBookings()[0];
  }, [activeBookingId]);

  const [selectedPurpose, setSelectedPurpose] = useState<PaymentPurpose>(params.purpose || 'FULL');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(
    params.currency || booking?.currency || 'XOF',
  );
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  // Compute calculated amounts dynamically
  const totalAmount = booking?.amount || 95000;
  const depositAmount = Math.round(totalAmount * 0.5);
  const balanceAmount = totalAmount - depositAmount;

  const activeChargeAmount = useMemo(() => {
    if (selectedPurpose === 'DEPOSIT') return depositAmount;
    if (selectedPurpose === 'BALANCE') return balanceAmount;
    return totalAmount;
  }, [selectedPurpose, totalAmount, depositAmount, balanceAmount]);

  const handleContinue = () => {
    if (!booking) return;

    updateBookingDraft({
      id: booking.id,
      amount: totalAmount,
      depositAmount,
      remainingBalance: balanceAmount,
      currency: selectedCurrency,
      paymentStatus: 'PENDING',
    });

    router.push({
      pathname: '/payments/checkout-preview',
      params: {
        bookingId: booking.id,
        reference: booking.reference,
        serviceName: booking.serviceName,
        purpose: selectedPurpose,
        currency: selectedCurrency,
        amount: String(activeChargeAmount),
        totalAmount: String(totalAmount),
      },
    } as never);
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
          <Text style={styles.pageTitle}>Payment Choice</Text>
        </View>

        {/* Amount Due Card matching Figma 52:791 */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount due</Text>
          <Text style={styles.amountValue}>
            {activeChargeAmount.toLocaleString()} {selectedCurrency}
          </Text>
          <Text style={styles.amountSubtitle}>XOF base • USD / EUR reference when applicable</Text>
        </View>

        {/* Section: Payment Purpose matching Figma 52:795 */}
        <Text style={styles.sectionTitle}>Payment purpose</Text>

        {/* Purpose Radio Card: FULL */}
        <Pressable
          style={[styles.purposeCard, selectedPurpose === 'FULL' && styles.purposeCardSelected]}
          onPress={() => setSelectedPurpose('FULL')}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedPurpose === 'FULL' }}
          accessibilityLabel="Full payment · FULL"
        >
          <View style={styles.radioOuter}>
            {selectedPurpose === 'FULL' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.purposeText}>Full payment · FULL</Text>
        </Pressable>

        {/* Purpose Radio Card: DEPOSIT */}
        <Pressable
          style={[styles.purposeCard, selectedPurpose === 'DEPOSIT' && styles.purposeCardSelected]}
          onPress={() => setSelectedPurpose('DEPOSIT')}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedPurpose === 'DEPOSIT' }}
          accessibilityLabel="Deposit · DEPOSIT"
        >
          <View style={styles.radioOuter}>
            {selectedPurpose === 'DEPOSIT' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.purposeText}>Deposit · DEPOSIT</Text>
        </Pressable>

        {/* Purpose Radio Card: BALANCE */}
        <Pressable
          style={[styles.purposeCard, selectedPurpose === 'BALANCE' && styles.purposeCardSelected]}
          onPress={() => setSelectedPurpose('BALANCE')}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedPurpose === 'BALANCE' }}
          accessibilityLabel="Remaining balance · BALANCE"
        >
          <View style={styles.radioOuter}>
            {selectedPurpose === 'BALANCE' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.purposeText}>Remaining balance · BALANCE</Text>
        </Pressable>

        {/* Section: Payment Currency matching Figma 52:808 */}
        <View style={styles.currencySection}>
          <Text style={styles.currencyLabel}>Payment Currency</Text>
          <Pressable
            style={styles.currencyField}
            onPress={() => setCurrencyModalVisible(true)}
            accessibilityRole="combobox"
            accessibilityLabel="Select Payment Currency"
          >
            <Text style={styles.currencyFieldText}>
              {CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency)?.label ||
                'Selected currency'}
            </Text>
            <ChevronDownIcon size={20} color="#5B616B" />
          </Pressable>
        </View>

        {/* Info Banner matching Figma 52:814 */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerTitle}>Server computes the amount</Text>
          <Text style={styles.infoBannerSubtitle}>
            Customer cannot enter or override a charge amount.
          </Text>
        </View>

        {/* Primary CTA: Continue to Stripe matching Figma node 14:2 */}
        <Pressable
          style={({ pressed }) => [styles.continueBtn, pressed && styles.continueBtnPressed]}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to Stripe"
        >
          <Text style={styles.continueBtnText}>Continue to Stripe</Text>
        </Pressable>

        {/* Cancel link matching Figma node 52:819 */}
        <Pressable
          style={styles.cancelLink}
          onPress={handleCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={styles.cancelLinkText}>Cancel</Text>
        </Pressable>
      </ScrollView>

      {/* Currency Selection Modal */}
      <Modal
        visible={currencyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCurrencyModalVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {CURRENCY_OPTIONS.map((c) => (
              <Pressable
                key={c.code}
                style={[styles.modalItem, selectedCurrency === c.code && styles.modalItemSelected]}
                onPress={() => {
                  setSelectedCurrency(c.code);
                  setCurrencyModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedCurrency === c.code && styles.modalItemTextSelected,
                  ]}
                >
                  {c.label}
                </Text>
              </Pressable>
            ))}
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
  amountCard: {
    marginHorizontal: 20,
    backgroundColor: '#F1E7D2',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0C0E',
  },
  amountSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  purposeCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  purposeCardSelected: {
    borderColor: '#C6A15B',
    backgroundColor: '#FFFDF9',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#5B616B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#C6A15B',
  },
  purposeText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0B0C0E',
  },
  currencySection: {
    marginHorizontal: 20,
    marginTop: 18,
    gap: 6,
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  currencyField: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyFieldText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0B0C0E',
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
  continueBtn: {
    marginHorizontal: 20,
    marginTop: 22,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0C0E',
    marginBottom: 8,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: '#F1E7D2',
  },
  modalItemText: {
    fontSize: 14,
    color: '#0B0C0E',
  },
  modalItemTextSelected: {
    fontWeight: '600',
    color: '#A88343',
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
