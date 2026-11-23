import { DEFAULT_DEMO_IDS } from '@xtreme/mock-data';
import { customerScreens } from '@xtreme/navigation';
import type { DemoPersona, DemoScenario } from '@xtreme/types';
import { radii, shadows, useMockAuth } from '@xtreme/ui';
import { Link } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VERIFIED_AUTH_SCREEN_IDS = new Set([
  'CUS-AUTH-01',
  'CUS-AUTH-02',
  'CUS-AUTH-03',
  'CUS-AUTH-04',
  'CUS-AUTH-05',
  'CUS-AUTH-06',
  'CUS-AUTH-07',
  'CUS-AUTH-08',
]);

function getRouteHref(screenId: string, basePath: string): string {
  switch (screenId) {
    case 'CUS-BKG-06':
    case 'CUS-CHG-01':
    case 'CUS-CHG-02':
    case 'CUS-PAY-01':
    case 'CUS-PAY-02':
    case 'CUS-PAY-03':
    case 'CUS-BKG-04':
      return `${basePath}?bookingId=${DEFAULT_DEMO_IDS.bookingId}`;
    case 'CUS-TRIP-02':
      return `${basePath}?tripId=${DEFAULT_DEMO_IDS.tripId}`;
    case 'CUS-DISC-03':
      return `${basePath}?serviceId=${DEFAULT_DEMO_IDS.serviceId}`;
    case 'CUS-CON-03':
      return `${basePath}?requestId=req-demo-001`;
    case 'CUS-CON-05':
      return `${basePath}?conversationId=${DEFAULT_DEMO_IDS.conversationId}`;
    default:
      return basePath;
  }
}

/**
 * Developer Navigation & QA Control Console (Development/Preview Only)
 *
 * SPECIFICATION & QA COMPLIANCE:
 * - Direct access to all 34 Customer routes.
 * - Live Demo Mode toggling (Guards Bypassed vs Strict Auth).
 * - Persona switching (Customer, Driver, Operations, or Unauthenticated).
 * - Scenario testing (Success, Pending, Failure, Cancelled).
 * - Distinguishes Figma-verified auth screens from Phase 1 placeholders.
 * - Does not contaminate production screens with debug clutter.
 */
export default function DeveloperIndexScreen() {
  const insets = useSafeAreaInsets();
  const {
    isDemoMode,
    setDemoMode,
    activePersona,
    selectPersona,
    scenario,
    setScenario,
    isAuthenticated,
    currentUser,
    logout,
    resetDemoState,
  } = useMockAuth();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 36) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandEyebrow}>XTREME CONCIERGE</Text>
          <View style={styles.devBadge}>
            <Text style={styles.devBadgeText}>QA DEMO HUB</Text>
          </View>
        </View>
        <Text style={styles.title}>Customer App Navigation</Text>
        <Text style={styles.subtitle}>
          All 34 approved screen routes. Use controls below to toggle authentication guards, switch
          personas, or simulate business scenarios.
        </Text>
      </View>

      {/* QA Control Panel */}
      <View style={styles.controlPanel}>
        <Text style={styles.panelTitle}>Demo Flow & Guard Policy</Text>

        {/* Demo Mode Toggle */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Guards Policy:</Text>
          <View style={styles.buttonGroup}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setDemoMode(true)}
              style={[styles.pillButton, isDemoMode && styles.pillButtonActive]}
            >
              <Text style={[styles.pillText, isDemoMode && styles.pillTextActive]}>
                Bypass Guards (Demo)
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setDemoMode(false)}
              style={[styles.pillButton, !isDemoMode && styles.pillButtonActiveStrict]}
            >
              <Text style={[styles.pillText, !isDemoMode && styles.pillTextActive]}>
                Strict Auth
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Persona Selector */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Active Persona:</Text>
          <View style={styles.buttonGroup}>
            {(['customer', 'driver', 'operations'] as DemoPersona[]).map((p) => {
              const active = isAuthenticated && activePersona === p;
              return (
                <Pressable
                  key={p}
                  accessibilityRole="button"
                  onPress={() => selectPersona(p)}
                  style={[styles.pillButton, active && styles.pillButtonActive]}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              accessibilityRole="button"
              onPress={logout}
              style={[styles.pillButton, !isAuthenticated && styles.pillButtonActiveStrict]}
            >
              <Text style={[styles.pillText, !isAuthenticated && styles.pillTextActive]}>
                Guest (No Session)
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Active Session Status */}
        <View style={styles.sessionBox}>
          <Text style={styles.sessionStatusText}>
            Session:{' '}
            <Text style={{ fontWeight: '700', color: isAuthenticated ? '#164D53' : '#A88343' }}>
              {isAuthenticated
                ? `${currentUser?.firstName} ${currentUser?.lastName} (${currentUser?.role})`
                : 'Unauthenticated'}
            </Text>
          </Text>
        </View>

        {/* Scenario Selector */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Scenario:</Text>
          <View style={styles.buttonGroup}>
            {(['success', 'pending', 'failure', 'cancelled'] as DemoScenario[]).map((sc) => {
              const isSelected = scenario === sc;
              return (
                <Pressable
                  key={sc}
                  accessibilityRole="button"
                  onPress={() => setScenario(sc)}
                  style={[styles.pillButton, isSelected && styles.pillButtonActive]}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                    {sc.charAt(0).toUpperCase() + sc.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Reset State */}
        <Pressable accessibilityRole="button" onPress={resetDemoState} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>↺ Reset to Clean Initial Demo State</Text>
        </Pressable>
      </View>

      {/* Screen Directory Header */}
      <View style={styles.directoryHeader}>
        <Text style={styles.directoryTitle}>Approved Screen Directory (34 Routes)</Text>
        <Text style={styles.directorySubtitle}>
          Tap any screen to navigate directly. Parameterized routes automatically preserve mock IDs.
        </Text>
      </View>

      {/* Screen Cards List */}
      {customerScreens.map((screen) => {
        const isVerifiedAuth = VERIFIED_AUTH_SCREEN_IDS.has(screen.id);
        const targetHref = getRouteHref(screen.id, screen.path);

        return (
          <Link key={screen.id} href={targetHref as never} asChild>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.screenItem,
                shadows.sm,
                pressed && styles.screenItemPressed,
              ]}
            >
              <View style={styles.screenItemLeft}>
                <View style={styles.screenIdRow}>
                  <Text style={styles.screenId}>{screen.id}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      isVerifiedAuth ? styles.statusPillVerified : styles.statusPillPlaceholder,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isVerifiedAuth
                          ? styles.statusPillTextVerified
                          : styles.statusPillTextPlaceholder,
                      ]}
                    >
                      {isVerifiedAuth ? 'Figma Verified' : 'Phase 1 Placeholder'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.screenTitle}>{screen.title}</Text>
                <Text style={styles.screenPath}>{targetHref}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
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
  header: {
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  brandEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#A88343',
  },
  devBadge: {
    backgroundColor: '#164D53',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  devBadgeText: {
    color: '#FAF8F4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A2530',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#5B616B',
    lineHeight: 18,
  },
  controlPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#DDD8CF',
    padding: 14,
    marginBottom: 20,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2530',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE9E0',
    paddingBottom: 6,
  },
  controlRow: {
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B616B',
    marginBottom: 6,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F5F2EB',
    borderWidth: 1,
    borderColor: '#DDD8CF',
  },
  pillButtonActive: {
    backgroundColor: '#164D53',
    borderColor: '#164D53',
  },
  pillButtonActiveStrict: {
    backgroundColor: '#A88343',
    borderColor: '#A88343',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B616B',
  },
  pillTextActive: {
    color: '#FAF8F4',
  },
  sessionBox: {
    backgroundColor: '#FAF8F4',
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
  },
  sessionStatusText: {
    fontSize: 12,
    color: '#1A2530',
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#EEE9E0',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD8CF',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A2530',
  },
  directoryHeader: {
    marginBottom: 12,
  },
  directoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2530',
    marginBottom: 2,
  },
  directorySubtitle: {
    fontSize: 12,
    color: '#5B616B',
  },
  screenItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#E5DFD3',
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenItemPressed: {
    backgroundColor: '#F5F2EB',
  },
  screenItemLeft: {
    flex: 1,
  },
  screenIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  screenId: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#A88343',
  },
  statusPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusPillVerified: {
    backgroundColor: '#E8F5E9',
  },
  statusPillPlaceholder: {
    backgroundColor: '#F0EFEA',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusPillTextVerified: {
    color: '#2E7D32',
  },
  statusPillTextPlaceholder: {
    color: '#7A828E',
  },
  screenTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2530',
    marginBottom: 2,
  },
  screenPath: {
    fontSize: 11,
    color: '#7A828E',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  chevron: {
    fontSize: 18,
    color: '#A6A19A',
    marginLeft: 8,
  },
});
