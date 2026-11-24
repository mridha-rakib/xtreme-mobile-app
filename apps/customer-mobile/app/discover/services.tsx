import { sampleCategories, sampleServices } from '@xtreme/mock-data';
import type { ServiceItem } from '@xtreme/types';
import {
  BackButton,
  ChevronRightIcon,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
  SearchIcon,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 45:565
const logoHeader = require('../../assets/logo.png');

const thumbAirport = require('../../assets/discovery/service_airport_transfer_thumb.png');
const thumbVilla = require('../../assets/discovery/service_villa_thumb.png');
const thumbYacht = require('../../assets/discovery/service_yacht_thumb.png');
const thumbActivity = require('../../assets/discovery/service_activity_thumb.png');
const thumbNightlife = require('../../assets/discovery/service_nightlife_thumb.png');

const THUMB_MAP: Record<string, any> = {
  'svc-airport-fasttrack': thumbAirport,
  'svc-chauffeur-daily': thumbAirport,
  'svc-villa-almadies': thumbVilla,
  'svc-yacht-madeleine': thumbYacht,
  'svc-curated-goree': thumbActivity,
  'svc-nightlife-almadies': thumbNightlife,
  'svc-trip-bespoke': thumbActivity,
};

function formatPrice(service: ServiceItem): string {
  if (service.displayPrice === null) {
    return 'Custom Quote • concierge request';
  }
  const formatted = service.displayPrice.toLocaleString();
  const unit =
    service.priceUnit === 'PER_DAY' ? '/ day' : service.priceUnit === 'PER_HOUR' ? '/ hour' : '';
  const modeLabel =
    service.bookingMode === 'INSTANT'
      ? 'instant booking'
      : service.bookingMode === 'REQUEST_TO_BOOK'
        ? 'request to book'
        : 'concierge';
  return `From ${formatted} ${service.currency} ${unit} • ${modeLabel}`.trim();
}

/**
 * CUS-DISC-02: Services List Screen
 * Authoritative Figma Frame: 45:565
 */
export default function ServicesListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    category?: string;
    categoryTitle?: string;
    filter?: string;
  }>();

  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string | null>(
    params.category || null,
  );

  // Filter services dynamically by category if provided, otherwise list all curated services
  const displayedServices = useMemo(() => {
    if (!selectedFilterCategory) {
      return sampleServices;
    }
    const cat = sampleCategories.find(
      (c) => c.slug === selectedFilterCategory || c.id === selectedFilterCategory,
    );
    if (!cat) {
      return sampleServices;
    }
    const filtered = sampleServices.filter((s) => s.categoryId === cat.id);
    return filtered.length > 0 ? filtered : sampleServices;
  }, [selectedFilterCategory]);

  const categoryDisplayName = useMemo(() => {
    if (!selectedFilterCategory) {
      return 'All Categories';
    }
    const cat = sampleCategories.find(
      (c) => c.slug === selectedFilterCategory || c.id === selectedFilterCategory,
    );
    return cat ? cat.name : params.categoryTitle || 'Curated Services';
  }, [selectedFilterCategory, params.categoryTitle]);

  const handleServicePress = (service: ServiceItem) => {
    router.push({
      pathname: '/discover/service-detail',
      params: { serviceId: service.id },
    } as never);
  };

  const handleFilterPress = () => {
    // Cycles or toggles category filter or navigates to geography selector
    if (selectedFilterCategory) {
      setSelectedFilterCategory(null);
    } else {
      setSelectedFilterCategory('airport-transfer');
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/discover' as never);
    }
  };

  return (
    <View style={styles.root}>
      {/* Top Header matching Figma 1048:14370 */}
      <View style={[styles.headerArea, { paddingTop: Math.max(insets.top, 10) }]}>
        <View style={styles.headerTopRow}>
          <BackButton onPress={handleBack} />
          <View style={styles.brandLogoWrap}>
            <Image source={logoHeader} style={styles.brandLogoImage} resizeMode="contain" />
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.headerDivider} />
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Services List</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 84 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Figma 45:570 - Category / Geography Filter Bar */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Filter: ${categoryDisplayName}. Tap to toggle filter`}
          style={({ pressed }) => [styles.filterBar, pressed && styles.filterBarPressed]}
          onPress={handleFilterPress}
        >
          <Text style={styles.filterCategoryText} numberOfLines={1}>
            {categoryDisplayName}
          </Text>
          <View style={styles.filterRightGroup}>
            <Text style={styles.filterActionText}>
              {selectedFilterCategory ? 'Reset' : 'Filter'}
            </Text>
            <SearchIcon size={20} color="#164D53" />
          </View>
        </Pressable>

        {/* Services List Rows matching Figma 45:573 */}
        <View style={styles.listContainer}>
          {displayedServices.map((service) => {
            const thumbSource = THUMB_MAP[service.id] || thumbAirport;
            return (
              <Pressable
                key={service.id}
                accessibilityRole="button"
                accessibilityLabel={`${service.name}. ${formatPrice(service)}`}
                style={({ pressed }) => [styles.serviceRow, pressed && styles.serviceRowPressed]}
                onPress={() => handleServicePress(service)}
              >
                {/* 70x66 Thumbnail Box with Champagne border accent */}
                <View style={styles.thumbBox}>
                  <Image source={thumbSource} style={styles.thumbImage} resizeMode="cover" />
                </View>

                {/* Content Center */}
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle} numberOfLines={1}>
                    {service.name}
                  </Text>
                  <Text style={styles.servicePrice} numberOfLines={1}>
                    {formatPrice(service)}
                  </Text>
                </View>

                {/* Chevron Right */}
                <View style={styles.chevronWrap}>
                  <ChevronRightIcon size={12} color="#164D53" />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Figma 805:690 - Customer Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomNavRow}>
          {/* Home */}
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
            style={styles.navItem}
            onPress={() => router.replace('/discover' as never)}
          >
            <NavHomeIcon active={false} size={24} />
            <Text style={styles.navText}>Home</Text>
          </Pressable>

          {/* Bookings */}
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
            style={styles.navItem}
            onPress={() => router.push('/bookings' as never)}
          >
            <NavBookingsIcon active={false} size={24} />
            <Text style={styles.navText}>Bookings</Text>
          </Pressable>

          {/* Concierge */}
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
            style={styles.navItem}
            onPress={() => router.push('/concierge/plan-trip' as never)}
          >
            <NavConciergeIcon active={false} size={24} />
            <Text style={styles.navText}>Concierge</Text>
          </Pressable>

          {/* Profile */}
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
            style={styles.navItem}
            onPress={() => router.push('/account/profile' as never)}
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
  root: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  // Header
  headerArea: {
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  brandLogoWrap: {
    height: 32,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogoImage: {
    width: 100,
    height: 32,
  },
  headerRightPlaceholder: {
    width: 36,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    marginTop: 4,
    marginBottom: 8,
  },
  headerTitleRow: {
    paddingVertical: 4,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  // Scrollable Body
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  // Filter Bar
  filterBar: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#D8D0C4',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  filterBarPressed: {
    backgroundColor: '#F7F3EB',
  },
  filterCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#24272D',
    flex: 1,
  },
  filterRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#164D53',
    letterSpacing: 0.15,
  },
  // Services List
  listContainer: {
    gap: 10,
  },
  serviceRow: {
    height: 88,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderWidth: 1,
    borderColor: '#D8D0C4',
    borderRadius: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  serviceRowPressed: {
    backgroundColor: '#F8F6F0',
    transform: [{ scale: 0.99 }],
  },
  thumbBox: {
    width: 70,
    height: 66,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(198, 161, 91, 0.25)',
    overflow: 'hidden',
    backgroundColor: '#EBE5D8',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  serviceContent: {
    flex: 1,
    gap: 5,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 19,
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 16,
  },
  chevronWrap: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
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
});
