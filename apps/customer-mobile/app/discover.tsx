import {
  BellNotificationIcon,
  CategoryBadgeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LocationPinIcon,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 45:509
const logoHeader = require('../assets/logo.png');
const heroVillaImage = require('../assets/discovery/category_villas.png');
const heroAirportImage = require('../assets/discovery/category_airport_transfer.png');
const heroYachtImage = require('../assets/discovery/category_yachts.png');

const categoryAirport = require('../assets/discovery/category_airport_transfer.png');
const categoryLuxuryCars = require('../assets/discovery/category_airport_transfer.png'); // Figma shared luxury car asset
const categoryVillas = require('../assets/discovery/category_villas.png');
const categoryYachts = require('../assets/discovery/category_yachts.png');
const categoryActivities = require('../assets/discovery/category_activities.png');
const categoryNightlife = require('../assets/discovery/category_nightlife.png');

interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  image: any;
  targetCategory: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    eyebrow: 'YOUR JOURNEY, OUR EXPERTISE',
    title: 'Plan My Entire Trip',
    subtitle: 'Flights, stays, activities and more — all in one place.',
    ctaText: 'Plan My Trip',
    image: heroVillaImage,
    targetCategory: 'activities',
  },
  {
    id: 'hero-2',
    eyebrow: 'VIP AIRPORT TRANSIT',
    title: 'Blaise Diagne Meet & Assist',
    subtitle: 'Tarmac greeting, fast-track customs & luxury chauffeur escort.',
    ctaText: 'Reserve Transfer',
    image: heroAirportImage,
    targetCategory: 'airport-transfer',
  },
  {
    id: 'hero-3',
    eyebrow: 'ATLANTIC ESCAPES',
    title: 'Private Yacht Charters',
    subtitle: 'Exclusive cruises to Îles de la Madeleine & Somone lagoon.',
    ctaText: 'Explore Charters',
    image: heroYachtImage,
    targetCategory: 'yachts',
  },
];

interface CategoryItem {
  id: string;
  category: 'Airport Transfer' | 'Luxury Cars' | 'Villas' | 'Yachts' | 'Activities' | 'Nightlife';
  title: string;
  line1: string;
  line2: string;
  image: any;
  badgeVariant: 'teal' | 'gold';
  slug: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-airport',
    category: 'Airport Transfer',
    title: 'Airport Transfer',
    line1: 'Comfortable & reliable',
    line2: 'transfers',
    image: categoryAirport,
    badgeVariant: 'teal',
    slug: 'airport-transfer',
  },
  {
    id: 'cat-luxury-cars',
    category: 'Luxury Cars',
    title: 'Luxury Cars',
    line1: 'Premium vehicles',
    line2: 'for every occasion',
    image: categoryLuxuryCars,
    badgeVariant: 'gold',
    slug: 'luxury-cars',
  },
  {
    id: 'cat-villas',
    category: 'Villas',
    title: 'Villas',
    line1: 'Handpicked stays',
    line2: 'around the world',
    image: categoryVillas,
    badgeVariant: 'teal',
    slug: 'villas',
  },
  {
    id: 'cat-yachts',
    category: 'Yachts',
    title: 'Yachts',
    line1: 'Private charters &',
    line2: 'unforgettable time',
    image: categoryYachts,
    badgeVariant: 'gold',
    slug: 'yachts',
  },
  {
    id: 'cat-activities',
    category: 'Activities',
    title: 'Activities',
    line1: 'Curated experiences',
    line2: 'and local adventures',
    image: categoryActivities,
    badgeVariant: 'teal',
    slug: 'activities',
  },
  {
    id: 'cat-nightlife',
    category: 'Nightlife',
    title: 'Nightlife',
    line1: 'Top venues &',
    line2: 'exclusive access',
    image: categoryNightlife,
    badgeVariant: 'gold',
    slug: 'nightlife',
  },
];

/**
 * CUS-DISC-01: Discovery Home Screen
 * Authoritative Figma Frame: 45:509
 */
export default function DiscoveryHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedLocation, _setSelectedLocation] = useState('Dakar, Senegal');

  const handleCategoryPress = (category: CategoryItem) => {
    router.push({
      pathname: '/discover/services',
      params: { category: category.slug, categoryTitle: category.title },
    } as never);
  };

  const handleHeroCtaPress = () => {
    const slide = HERO_SLIDES[activeSlide];
    if (slide.targetCategory === 'activities') {
      router.push('/concierge/plan-trip' as never);
    } else {
      router.push({
        pathname: '/discover/services',
        params: { category: slide.targetCategory },
      } as never);
    }
  };

  const handleLocationPress = () => {
    router.push('/discover/location' as never);
  };

  const currentHero = HERO_SLIDES[activeSlide];

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 24) + 78,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Figma 1048:14322 - Customer/Header/Home Location */}
        <View style={styles.headerContainer}>
          {/* Top Brand Row */}
          <View style={styles.headerBrandRow}>
            <View style={styles.brandLogoWrap}>
              <Image source={logoHeader} style={styles.brandLogoImage} resizeMode="contain" />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View notifications"
              style={({ pressed }) => [styles.notificationBtn, pressed && styles.pressedOpacity]}
              onPress={() => router.push('/support' as never)}
            >
              <BellNotificationIcon size={38} />
            </Pressable>
          </View>

          {/* Location Selector Bar */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Current location: ${selectedLocation}. Tap to change geography`}
            style={({ pressed }) => [styles.locationCard, pressed && styles.locationCardPressed]}
            onPress={handleLocationPress}
          >
            <View style={styles.locationLeftRow}>
              <View style={styles.locationPinBox}>
                <LocationPinIcon size={16} color="#164D53" />
              </View>
              <View style={styles.locationTextColumn}>
                <Text style={styles.locationLabel}>Location</Text>
                <Text style={styles.locationValue} numberOfLines={1}>
                  {selectedLocation}
                </Text>
              </View>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationChangeBox}>
              <Text style={styles.locationChangeText}>Change</Text>
              <ChevronDownIcon size={10} color="#164D53" />
            </View>
          </Pressable>
        </View>

        {/* Figma 722:535 - Hero Carousel */}
        <View style={styles.heroContainer}>
          <Image source={currentHero.image} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>{currentHero.eyebrow}</Text>
            <Text style={styles.heroTitle}>{currentHero.title}</Text>
            <Text style={styles.heroSubtitle}>{currentHero.subtitle}</Text>
          </View>

          {/* Hero CTA Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={currentHero.ctaText}
            style={({ pressed }) => [styles.heroCtaButton, pressed && styles.heroCtaPressed]}
            onPress={handleHeroCtaPress}
          >
            <Text style={styles.heroCtaText}>{currentHero.ctaText}</Text>
            <Text style={styles.heroCtaArrow}>›</Text>
          </Pressable>

          {/* Carousel Dots */}
          <View style={styles.carouselDotsRow}>
            {HERO_SLIDES.map((slide, idx) => (
              <Pressable
                key={slide.id}
                accessibilityRole="button"
                accessibilityLabel={`Go to slide ${idx + 1}`}
                onPress={() => setActiveSlide(idx)}
                hitSlop={8}
                style={styles.dotTouch}
              >
                <View
                  style={[
                    styles.dotBase,
                    idx === activeSlide ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Service Categories</Text>
        </View>

        {/* 2-Column Service Category Grid matching Figma */}
        <View style={styles.grid}>
          {CATEGORIES.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.line1} ${item.line2}`}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => handleCategoryPress(item)}
            >
              {/* Photo Top 54px */}
              <View style={styles.cardPhotoBox}>
                <Image source={item.image} style={styles.cardPhoto} resizeMode="cover" />
              </View>

              {/* Icon Badge overlapping photo & card surface */}
              <View
                style={[
                  styles.cardBadge,
                  item.badgeVariant === 'teal' ? styles.badgeTeal : styles.badgeGold,
                ]}
              >
                <CategoryBadgeIcon category={item.category} size={15} />
              </View>

              {/* Card Text Information */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.line1} {item.line2}
                </Text>
              </View>

              {/* Circular Chevron Surface */}
              <View style={styles.chevronBox}>
                <ChevronRightIcon size={10} color="#164D53" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Figma 805:690 - Customer Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomNavSeparator} />
        <View style={styles.bottomNavRow}>
          {/* Home (Active) */}
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
            style={styles.navItem}
            onPress={() => {}}
          >
            <NavHomeIcon active={true} size={24} />
            <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
            <View style={styles.navActiveIndicator} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
  },
  // Header
  headerContainer: {
    marginBottom: 14,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 8,
  },
  brandLogoWrap: {
    height: 36,
    width: 120,
    justifyContent: 'center',
  },
  brandLogoImage: {
    width: 120,
    height: 36,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressedOpacity: {
    opacity: 0.75,
  },
  // Location Card
  locationCard: {
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#D8D0C4',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  locationCardPressed: {
    backgroundColor: '#F7F3EB',
  },
  locationLeftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPinBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locationTextColumn: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8A847A',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  locationValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0B0C0E',
  },
  locationDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(227, 219, 207, 0.9)',
    marginHorizontal: 12,
  },
  locationChangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#164D53',
  },
  // Hero Carousel
  heroContainer: {
    height: 184,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(198, 161, 91, 0.42)',
    marginBottom: 20,
    backgroundColor: '#031A1F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 116,
    backgroundColor: 'rgba(3, 26, 31, 0.65)',
  },
  heroContent: {
    position: 'absolute',
    left: 18,
    bottom: 16,
    right: 70,
  },
  heroEyebrow: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#F2DBAB',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 14,
  },
  heroCtaButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#F5C261',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroCtaPressed: {
    opacity: 0.85,
  },
  heroCtaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F1A12',
  },
  heroCtaArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1A12',
    marginTop: -2,
  },
  carouselDotsRow: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotTouch: {
    padding: 2,
  },
  dotBase: {
    borderRadius: 5,
  },
  dotActive: {
    width: 8,
    height: 8,
    backgroundColor: '#C6A15B',
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  // Section Header
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.2,
  },
  // 2-Column Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  card: {
    width: '48.2%',
    height: 96,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E0D1',
    shadowColor: 'rgba(20, 20, 20, 0.09)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5.5,
    elevation: 2,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: '#F9F7F2',
    transform: [{ scale: 0.985 }],
  },
  cardPhotoBox: {
    height: 52,
    width: '100%',
    backgroundColor: '#EBE5D8',
    overflow: 'hidden',
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
  },
  cardBadge: {
    position: 'absolute',
    top: 36,
    left: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.8,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeTeal: {
    backgroundColor: '#164D53',
  },
  badgeGold: {
    backgroundColor: '#D19E47',
  },
  cardContent: {
    position: 'absolute',
    left: 44,
    top: 55,
    right: 28,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 14,
  },
  cardDescription: {
    fontSize: 8.2,
    fontWeight: '500',
    color: '#5C616B',
    lineHeight: 10.5,
    marginTop: 1,
  },
  chevronBox: {
    position: 'absolute',
    right: 6,
    top: 60,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F2F7F5',
    borderWidth: 1,
    borderColor: '#DBE6E0',
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomNavSeparator: {
    height: 0,
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
  navTextActive: {
    color: '#164D53',
    fontWeight: '600',
  },
  navActiveIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#C6A15B',
  },
});
