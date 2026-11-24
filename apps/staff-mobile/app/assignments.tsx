import { getStaffAssignmentsByTab, subscribeStaff } from '@xtreme/mock-data';
import type { StaffAssignment } from '@xtreme/types';
import { StaffBottomNav, StaffStatusBadge, useMockAuth } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../assets/logo.png');

type AssignmentTab = 'today' | 'upcoming' | 'history';

/**
 * STF-ASG-01: Assignment Home Screen
 * Authoritative Figma Frame: 71:23 (STF-ASG-01__Assignment_Home__Ready)
 */
export default function AssignmentHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useMockAuth();
  const [activeTab, setActiveTab] = useState<AssignmentTab>('today');
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);

  useEffect(() => {
    const refresh = () => {
      setAssignments(getStaffAssignmentsByTab(activeTab));
    };
    refresh();
    const unsubscribe = subscribeStaff(refresh);
    return () => unsubscribe();
  }, [activeTab]);

  const handleTabPress = (tab: AssignmentTab) => {
    if (tab === 'history') {
      router.push('/assignments/history' as never);
    } else {
      setActiveTab(tab);
    }
  };

  const handleCardPress = (asg: StaffAssignment) => {
    router.push({
      pathname: '/assignments/detail',
      params: { assignmentId: asg.id },
    } as never);
  };

  const handleSignOut = () => {
    logout();
    router.replace('/auth/sign-in' as never);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <Pressable
            style={styles.signOutButton}
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="#5B616B"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Assignment Home</Text>
        </View>

        {/* 3-Tab Segmented Selector matching Figma node 71:31 */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabButton, activeTab === 'today' && styles.tabButtonActive]}
            onPress={() => handleTabPress('today')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'today' }}
          >
            <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>
              Today
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'upcoming' && styles.tabButtonActive]}
            onPress={() => handleTabPress('upcoming')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'upcoming' }}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            style={styles.tabButton}
            onPress={() => handleTabPress('history')}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <Text style={styles.tabText}>History</Text>
          </Pressable>
        </View>

        {/* Assignments List matching Figma nodes 71:35 - 71:70 */}
        <View style={styles.listContainer}>
          {assignments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No assignments</Text>
              <Text style={styles.emptySubtitle}>
                No scheduled assignments found for this period.
              </Text>
            </View>
          ) : (
            assignments.map((asg) => (
              <Pressable
                key={asg.id}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() => handleCardPress(asg)}
                accessibilityRole="button"
                accessibilityLabel={`${asg.title}, status ${asg.assignmentStatus}`}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {asg.title}
                  </Text>
                  <Text style={styles.cardSubtitle1} numberOfLines={1}>
                    {asg.pickupTime} • {asg.serviceName || 'Service'}
                  </Text>
                  <Text style={styles.cardSubtitle2} numberOfLines={1}>
                    {asg.pickupLocation.split(',')[0]} → {asg.destination.split(',')[0]} •{' '}
                    {asg.vehicleAssigned.split(' ')[0]}
                  </Text>
                </View>

                <View style={styles.cardRight}>
                  <StaffStatusBadge status={asg.assignmentStatus} />
                  <Text style={styles.chevron}>›</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* Staff Bottom Navigation Bar */}
      <StaffBottomNav
        activeTab="Assignments"
        onTabPress={(tab) => {
          if (tab === 'History') {
            router.push('/assignments/history' as never);
          }
        }}
        bottomInset={insets.bottom}
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
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerSpacer: {
    width: 24,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 72,
    height: 30,
  },
  signOutButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    marginBottom: 16,
  },
  titleRow: {
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 42,
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0B0C0E',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  tabTextActive: {
    color: '#0B0C0E',
    fontWeight: '700',
  },
  listContainer: {
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 66,
  },
  cardPressed: {
    backgroundColor: '#F7F5F0',
  },
  cardLeft: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    marginBottom: 2,
  },
  cardSubtitle1: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
  },
  cardSubtitle2: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '600',
    color: '#164D53',
    marginLeft: 2,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0C0E',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#5B616B',
    textAlign: 'center',
  },
});
