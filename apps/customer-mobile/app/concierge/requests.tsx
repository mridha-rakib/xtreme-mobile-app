import { getAllConciergeRequests } from '@xtreme/mock-data';
import type { ConciergeRequestRecord } from '@xtreme/types';
import { ConciergeStatusPill, CustomerBottomNav } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logoHeader = require('../../assets/logo.png');

/**
 * CUS-CON-02: Concierge Requests Screen
 * Authoritative Figma Frame: 60:960 (CUS-CON-02__Concierge_Requests__Ready)
 */
export default function ConciergeRequestsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const requests = useMemo(() => getAllConciergeRequests(), []);

  const handleRequestPress = (req: ConciergeRequestRecord) => {
    router.push({
      pathname: '/concierge/request-detail',
      params: { id: req.id, reference: req.reference },
    } as never);
  };

  const handleCreateNew = () => {
    router.push('/concierge/plan-trip' as never);
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return `Created ${d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`;
    } catch {
      return 'Created recently';
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
        {/* Brand Header Row matching Figma node 1065:14459 */}
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title */}
        <View style={styles.titleWrap}>
          <Text style={styles.pageTitle}>Concierge Requests</Text>
        </View>

        {/* Requests List matching Figma frame 60:960 */}
        <View style={styles.listContainer}>
          {requests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyHeading}>No Concierge Requests Yet</Text>
              <Text style={styles.emptyText}>
                Plan your complete itinerary or submit a bespoke lifestyle request.
              </Text>
            </View>
          ) : (
            requests.map((req) => (
              <Pressable
                key={req.id}
                style={styles.requestCard}
                onPress={() => handleRequestPress(req)}
                accessibilityRole="button"
                accessibilityLabel={`${req.title}, status ${req.status}`}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {req.title}
                  </Text>
                  <Text style={styles.cardTime} numberOfLines={1}>
                    {formatTimestamp(req.createdAt)}
                  </Text>
                </View>

                <View style={styles.cardRight}>
                  <ConciergeStatusPill status={req.status} />
                </View>
              </Pressable>
            ))
          )}

          {/* Create New Request Button matching Figma node 14:14 */}
          <Pressable
            style={styles.createBtn}
            onPress={handleCreateNew}
            accessibilityRole="button"
            accessibilityLabel="Create new request"
          >
            <Text style={styles.createBtnText}>Create new request</Text>
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
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 32,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 88,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  cardTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  createBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A6A19A',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD8CF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  emptyText: {
    fontSize: 13,
    color: '#5B616B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
