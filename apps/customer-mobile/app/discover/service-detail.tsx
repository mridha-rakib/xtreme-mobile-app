import { sampleCategories, sampleServices } from '@xtreme/mock-data';
import type { ServiceItem } from '@xtreme/types';
import {
  BackButton,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 45:632
const logoHeader = require('../../assets/logo.png');

const heroAirport = require('../../assets/discovery/service_airport_transfer_hero.png');
const heroVilla = require('../../assets/discovery/category_villas.png');
const heroYacht = require('../../assets/discovery/category_yachts.png');
const heroActivity = require('../../assets/discovery/category_activities.png');
const heroNightlife = require('../../assets/discovery/category_nightlife.png');

const HERO_MAP: Record<string, any> = {
  'svc-airport-fasttrack': heroAirport,
  'svc-chauffeur-daily': heroAirport,
  'svc-villa-almadies': heroVilla,
  'svc-yacht-madeleine': heroYacht,
  'svc-curated-goree': heroActivity,
  'svc-nightlife-almadies': heroNightlife,
  'svc-trip-bespoke': heroActivity,
};

function formatDetailPrice(service: ServiceItem): string {
  if (service.displayPrice === null) {
    return 'Custom Quote • Concierge Request';
  }
  const formatted = service.displayPrice.toLocaleString();
  const unit =
    service.priceUnit === 'PER_DAY' ? '/ day' : service.priceUnit === 'PER_HOUR' ? '/ hour' : '';
  const modeLabel =
    service.bookingMode === 'INSTANT'
      ? 'Instant Confirmation'
      : service.bookingMode === 'REQUEST_TO_BOOK'
        ? 'Request to Book'
        : 'Concierge Request';
  return `From ${formatted} ${service.currency} ${unit} • ${modeLabel}`.trim();
}

function getBookingModeLabel(mode: string): string {
  switch (mode) {
    case 'INSTANT':
      return 'INSTANT';
    case 'REQUEST_TO_BOOK':
      return 'REQUEST TO BOOK';
    case 'CONCIERGE_REQUEST':
      return 'CONCIERGE';
    default:
      return 'ON DEMAND';
  }
}

function getBookingModeDescription(mode: string): string {
  switch (mode) {
    case 'INSTANT':
      return 'Instant Confirmation';
    case 'REQUEST_TO_BOOK':
      return 'Manual Confirmation';
    case 'CONCIERGE_REQUEST':
      return 'Dedicated Concierge';
    default:
      return 'Configured Mode';
  }
}

/**
 * CUS-DISC-03: Service Detail Screen
 * Authoritative Figma Frame: 45:632 (CUS-DISC-03__Service_Detail__Ready)
 */
export default function ServiceDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ serviceId?: string; id?: string }>();
  const activeServiceId = params.serviceId || params.id;

  const service = useMemo(() => {
    if (!activeServiceId) {
      return sampleServices[0];
    }
    const found = sampleServices.find((s) => s.id === activeServiceId);
    return found || sampleServices[0];
  }, [activeServiceId]);

  const category = useMemo(() => {
    return sampleCategories.find((c) => c.id === service.categoryId);
  }, [service.categoryId]);

  const heroImage = HERO_MAP[service.id] || heroAirport;

  const handleContinue = () => {
    if (service.bookingMode === 'CONCIERGE_REQUEST') {
      router.push({
        pathname: '/concierge/plan-trip',
        params: { serviceId: service.id, serviceName: service.name },
      } as never);
    } else {
      router.push({
        pathname: '/booking/input',
        params: { serviceId: service.id },
      } as never);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/discover/services' as never);
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
          <Text style={styles.pageTitle}>Service Detail</Text>
        </View>

        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
        </View>

        {/* Service Header Row (Name + Booking Mode Badge) */}
        <View style={styles.nameBadgeRow}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{getBookingModeLabel(service.bookingMode)}</Text>
          </View>
        </View>

        {/* Price / Reference Currency */}
        <Text style={styles.priceText}>{formatDetailPrice(service)}</Text>

        {/* Service Tagline & Description */}
        <Text style={styles.descriptionText}>
          {service.description ||
            service.tagline ||
            'Curated bespoke service tailored for discerning international travelers with full concierge support.'}
        </Text>

        {/* Specifications Cards */}
        <View style={styles.specsContainer}>
          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Template</Text>
            <Text style={styles.specValue}>{category ? category.name : 'Airport Transfer'}</Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Booking mode</Text>
            <Text style={styles.specValue}>{getBookingModeDescription(service.bookingMode)}</Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Availability</Text>
            <Text style={styles.specValue}>
              {service.vehicleModel ? `${service.vehicleModel} • On Demand` : '24/7 On Demand'}
            </Text>
          </View>
        </View>

        {/* Helper Note */}
        <Text style={styles.helperNote}>
          Approved booking fields load in the next booking step.
        </Text>

        {/* Primary Action Button */}
        <Pressable
          style={({ pressed }) => [styles.continueBtn, pressed && styles.continueBtnPressed]}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel={
            service.bookingMode === 'CONCIERGE_REQUEST' ? 'Request Concierge' : 'Continue'
          }
        >
          <Text style={styles.continueBtnText}>
            {service.bookingMode === 'CONCIERGE_REQUEST' ? 'Request Concierge' : 'Continue'}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Customer Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomNavRow}>
          {/* Home Tab (Active) */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/discover' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
          >
            <NavHomeIcon active={true} size={24} />
            <Text style={[styles.navText, { color: '#164D53', fontWeight: '600' }]}>Home</Text>
            <View style={styles.activeUnderline} />
          </Pressable>

          {/* Bookings Tab */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/bookings' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <NavBookingsIcon active={false} size={24} />
            <Text style={styles.navText}>Bookings</Text>
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
  heroWrap: {
    marginHorizontal: 20,
    height: 196,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8D0C4',
    overflow: 'hidden',
    backgroundColor: '#EBE5D8',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  nameBadgeRow: {
    marginHorizontal: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 28,
  },
  modeBadge: {
    backgroundColor: '#F1E7D2',
    borderWidth: 1,
    borderColor: 'rgba(198,161,91,0.35)',
    borderRadius: 14,
    height: 28,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A88343',
    letterSpacing: 0.1,
  },
  priceText: {
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#164D53',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  descriptionText: {
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 22,
  },
  specsContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  specCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#D8D0C4',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0B0C0E',
  },
  helperNote: {
    marginHorizontal: 20,
    marginTop: 12,
    fontSize: 12,
    fontWeight: '400',
    color: '#5B616B',
    letterSpacing: 0.1,
    lineHeight: 16,
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
