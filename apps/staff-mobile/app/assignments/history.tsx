import { getAllStaffHistory, subscribeStaff } from '@xtreme/mock-data';
import type { StaffAssignment } from '@xtreme/types';
import { StaffBottomNav, StaffStatusBadge } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../../assets/logo.png');

/**
 * STF-ASG-05: Assignment History Screen
 * Authoritative Figma Frame: 71:177 (STF-ASG-05__Assignment_History__Ready)
 */
export default function AssignmentHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [historyList, setHistoryList] = useState<StaffAssignment[]>([]);

  useEffect(() => {
    const refresh = () => {
      setHistoryList(getAllStaffHistory());
    };
    refresh();
    const unsubscribe = subscribeStaff(refresh);
    return () => unsubscribe();
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/assignments' as never);
    }
  };

  const handleCardPress = (asg: StaffAssignment) => {
    router.push({
      pathname: '/assignments/detail',
      params: { assignmentId: asg.id },
    } as never);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 80 },
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

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Assignment History</Text>
        </View>

        {/* History Cards List matching Figma nodes 71:185 - 71:220 */}
        <View style={styles.listContainer}>
          {historyList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No assignment history</Text>
              <Text style={styles.emptySubtitle}>
                Completed and archived operational assignments will appear here.
              </Text>
            </View>
          ) : (
            historyList.map((asg) => (
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
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {asg.date || 'Past Date'} • {asg.serviceName || 'Service'}
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

        {/* Back to Assignments Action matching Figma node 71:221 */}
        <Pressable
          style={({ pressed }) => [styles.tertiaryBtn, pressed && styles.tertiaryBtnPressed]}
          onPress={() => router.replace('/assignments' as never)}
          accessibilityRole="button"
          accessibilityLabel="Back to Assignments"
        >
          <Text style={styles.tertiaryBtnText}>Back to Assignments</Text>
        </Pressable>
      </ScrollView>

      {/* Staff Bottom Navigation Bar */}
      <StaffBottomNav
        activeTab="History"
        onTabPress={(tab) => {
          if (tab === 'Assignments') {
            router.push('/assignments' as never);
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
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 72,
    height: 30,
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
  listContainer: {
    gap: 10,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 12,
    paddingVertical: 12,
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
    marginBottom: 4,
  },
  cardSubtitle: {
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
  tertiaryBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tertiaryBtnPressed: {
    opacity: 0.7,
  },
  tertiaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#164D53',
    letterSpacing: 0.1,
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
