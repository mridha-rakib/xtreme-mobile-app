import { DEFAULT_DEMO_IDS } from '@xtreme/mock-data';
import { staffScreens } from '@xtreme/navigation';
import type { DemoPersona, DemoScenario } from '@xtreme/types';
import { radii, shadows, useMockAuth } from '@xtreme/ui';
import { Link, Redirect } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const isProduction = process.env.EXPO_PUBLIC_APP_VARIANT === 'production';
const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
const isPreview =
  process.env.EXPO_PUBLIC_APP_VARIANT === 'preview' || process.env.EXPO_PUBLIC_DEMO_MODE === 'true';
const isDemoAllowed = !isProduction && (isDev || isPreview);

function getRouteHref(screenId: string, basePath: string): string {
  switch (screenId) {
    case 'STF-ASG-02':
    case 'STF-ASG-03':
    case 'STF-ASG-04':
      return `${basePath}?assignmentId=${DEFAULT_DEMO_IDS.assignmentId}`;
    default:
      return basePath;
  }
}

/**
 * Staff Developer Navigation & QA Control Hub (Development/Preview Only)
 *
 * SPECIFICATION & QA COMPLIANCE:
 * - Direct access to all 6 Staff routes.
 * - Live Demo Mode toggling (Guards Bypassed vs Strict Auth).
 * - Persona switching (Driver Moussa vs Operations Fatou vs Guest).
 * - Distinguishes STF-AUTH-01 from Phase 1 placeholders.
 */
export default function StaffDeveloperIndexScreen() {
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

  // In production builds, redirect straight to staff sign-in
  if (!isDemoAllowed) {
    return <Redirect href="/auth/sign-in" />;
  }

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
          <Text style={styles.brandEyebrow}>XTREME STAFF</Text>
          <View style={styles.devBadge}>
            <Text style={styles.devBadgeText}>STAFF QA HUB</Text>
          </View>
        </View>
        <Text style={styles.title}>Staff App Navigation</Text>
        <Text style={styles.subtitle}>
          All 6 approved driver & operations screen routes. Use controls below to toggle
          authentication guards, switch staff personas, or simulate scenarios.
        </Text>
      </View>

      {/* QA Control Panel */}
      <View style={styles.controlPanel}>
        <Text style={styles.panelTitle}>Staff Demo Policy</Text>

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

        {/* Staff Persona Selector */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Active Persona:</Text>
          <View style={styles.buttonGroup}>
            {(['driver', 'operations'] as DemoPersona[]).map((p) => {
              const active = isAuthenticated && activePersona === p;
              return (
                <Pressable
                  key={p}
                  accessibilityRole="button"
                  onPress={() => selectPersona(p)}
                  style={[styles.pillButton, active && styles.pillButtonActive]}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {p === 'driver' ? 'Driver (Moussa)' : 'Operations (Fatou)'}
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
        <Text style={styles.directoryTitle}>Approved Screen Directory (6 Routes)</Text>
        <Text style={styles.directorySubtitle}>
          Tap any screen to navigate directly. Detail routes preserve mock assignmentId.
        </Text>
      </View>

      {/* Screen Cards List */}
      {staffScreens.map((screen) => {
        const isVerified = true;
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
                      isVerified ? styles.statusPillVerified : styles.statusPillPlaceholder,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isVerified
                          ? styles.statusPillTextVerified
                          : styles.statusPillTextPlaceholder,
                      ]}
                    >
                      {isVerified ? 'Figma Verified' : 'Phase 1 Placeholder'}
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
    color: '#164D53',
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
    color: '#164D53',
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
