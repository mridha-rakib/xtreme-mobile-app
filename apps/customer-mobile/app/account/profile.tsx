import {
  getCustomerProfile,
  resetCustomerProfile,
  subscribeCustomerProfile,
} from '@xtreme/mock-data';
import type { UserProfile } from '@xtreme/types';
import { CustomerBottomNav } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const logoHeader = require('../../assets/logo.png');

/**
 * CUS-PRO-01: Profile Screen
 * Authoritative Figma Frame: 36:82 (CUS-PRO-01__Profile__Ready)
 */
export default function CustomerProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile>(() => getCustomerProfile());

  useEffect(() => {
    // Initial fetch and subscribe to profile changes
    setProfile(getCustomerProfile());
    const unsubscribe = subscribeCustomerProfile((updated) => {
      setProfile(updated);
    });
    return unsubscribe;
  }, []);

  const handleEditProfile = () => {
    router.push('/account/edit-profile' as never);
  };

  const handleSupportLegal = () => {
    router.push('/support' as never);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            resetCustomerProfile();
            router.replace('/auth/sign-in' as never);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const languageLabel =
    profile.preferredLanguage?.toUpperCase() === 'FR' ? 'Français (FR)' : 'English (EN)';

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
          <View style={styles.headerSpacer} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Profile</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.avatarCircle}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="#164D53"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle
                cx={12}
                cy={7}
                r={4}
                stroke="#164D53"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryName}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.summaryTagline}>Verified phone • EN / FR</Text>
          </View>
        </View>

        {/* 5 Detail Rows */}
        <View style={styles.detailsContainer}>
          {/* Row 1: Name */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>
              {profile.firstName} {profile.lastName}
            </Text>
          </View>

          {/* Row 2: Email */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{profile.email}</Text>
          </View>

          {/* Row 3: Phone */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{profile.phone}</Text>
          </View>

          {/* Row 4: Verification */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Verification</Text>
            <View style={styles.badgeWrap}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                  stroke="#164D53"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M9 12L11 14L15 10"
                  stroke="#164D53"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          {/* Row 5: Language */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Language</Text>
            <View style={styles.badgeWrap}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="#164D53"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                  stroke="#164D53"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.detailValue}>{languageLabel}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Primary Edit Profile Button */}
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            onPress={handleEditProfile}
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
          >
            <Text style={styles.primaryBtnText}>Edit Profile</Text>
          </Pressable>

          {/* Secondary Support & Legal Button */}
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            onPress={handleSupportLegal}
            accessibilityRole="button"
            accessibilityLabel="Support & Legal"
          >
            <Text style={styles.secondaryBtnText}>Support & Legal</Text>
          </Pressable>

          {/* Log out subtle link */}
          <Pressable
            style={styles.logoutBtn}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Customer Bottom Navigation Bar */}
      <CustomerBottomNav
        activeTab="Profile"
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
    height: 44,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  brandLogo: {
    width: 140,
    height: 28,
  },
  headerSpacer: {
    width: 40,
    height: 40,
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
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.3,
  },
  summaryCard: {
    marginHorizontal: 20,
    backgroundColor: '#F6EFE3',
    borderWidth: 1,
    borderColor: '#E4D7B5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EEE8DD',
    borderWidth: 1.5,
    borderColor: '#C6A15B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryInfo: {
    flex: 1,
    gap: 3,
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0C0E',
  },
  summaryTagline: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5B616B',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  detailRow: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5B616B',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#164D53',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnPressed: {
    opacity: 0.88,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0B0C0E',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnPressed: {
    backgroundColor: '#F9F7F2',
  },
  secondaryBtnText: {
    color: '#0B0C0E',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  logoutBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D32F2F',
  },
});
