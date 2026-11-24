import { getConciergeRequestById } from '@xtreme/mock-data';
import { ConciergeStatusPill, CustomerBottomNav, NotFoundCard } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

/**
 * CUS-CON-03: Concierge Request Detail Screen
 * Authoritative Figma Frame: 60:1003 (CUS-CON-03__Concierge_Request_Detail__IN_PROGRESS)
 */
export default function ConciergeRequestDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; requestId?: string; reference?: string }>();

  const activeId = params.requestId || params.id || params.reference;

  const req = useMemo(() => {
    if (!activeId) return getConciergeRequestById('req-con-001');
    return getConciergeRequestById(activeId);
  }, [activeId]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/concierge/requests' as never);
    }
  };

  const handleOpenConversation = () => {
    const convId = req?.conversationId || 'conv-demo-001';
    router.push({
      pathname: '/concierge/conversation-detail',
      params: { conversationId: convId, requestId: req?.id },
    } as never);
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '24 Nov 2026, 09:30';
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return '24 Nov 2026, 09:30';
    }
  };

  if (!req) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
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
          <Text style={styles.navHeaderTitle}>Concierge Request</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={{ padding: 20 }}>
          <NotFoundCard
            resourceName="Concierge Request"
            resourceId={activeId}
            onBack={() => router.replace('/concierge/requests' as never)}
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
        {/* Navigation Bar Header */}
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
          <View style={styles.headerSpacer} />
        </View>

        {/* Title matching Figma node 60:1007 */}
        <View style={styles.titleWrap}>
          <Text style={styles.pageTitle}>Concierge Request Detail</Text>
        </View>

        {/* Status Pill directly below title matching Figma node 60:1003 */}
        <View style={styles.statusWrap}>
          <ConciergeStatusPill status={req.status} />
        </View>

        {/* Detail Cards List */}
        <View style={styles.detailsContainer}>
          {/* Row 1: Request reference */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Request reference</Text>
            <Text style={styles.detailValue}>{req.reference}</Text>
          </View>

          {/* Row 2: Type */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{req.type || 'PLAN_TRIP'}</Text>
          </View>

          {/* Row 3: Status */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{req.status}</Text>
          </View>

          {/* Row 4: Trip / service context */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trip / service context</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {req.tripContext || req.serviceContext || 'Where applicable'}
            </Text>
          </View>

          {/* Large Card: Request details matching Figma node 60:1023 */}
          <View style={styles.largeCard}>
            <Text style={styles.largeCardTitle}>Request details</Text>
            <Text style={styles.largeCardBody}>{req.details}</Text>
          </View>

          {/* Row 5: Created / updated */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created / updated</Text>
            <Text style={styles.detailValue}>{formatDateTime(req.updatedAt || req.createdAt)}</Text>
          </View>

          {/* Primary Action: Open Conversation matching Figma node 14:2 */}
          <Pressable
            style={styles.openConvBtn}
            onPress={handleOpenConversation}
            accessibilityRole="button"
            accessibilityLabel="Open Conversation"
          >
            <Text style={styles.openConvBtnText}>Open Conversation</Text>
          </Pressable>
        </View>
      </ScrollView>

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
  navHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  titleWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 32,
  },
  statusWrap: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  detailRow: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    letterSpacing: 0.15,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0B0C0E',
    textAlign: 'right',
  },
  largeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    padding: 12,
    gap: 4,
    minHeight: 110,
  },
  largeCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  largeCardBody: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 22,
  },
  openConvBtn: {
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  openConvBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
});
