import { getStaffAssignmentById, subscribeStaff } from '@xtreme/mock-data';
import type { StaffAssignment } from '@xtreme/types';
import { NotFoundCard, StaffBottomNav, StaffStatusBadge } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../../assets/logo.png');

/**
 * STF-ASG-02: Assignment Detail Screen
 * Authoritative Figma Frame: 71:71 (STF-ASG-02__Assignment_Detail__Ready)
 */
export default function AssignmentDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; assignmentId?: string }>();
  const activeId = params.assignmentId || params.id;

  const [asg, setAsg] = useState<StaffAssignment | undefined>(() => {
    return activeId ? getStaffAssignmentById(activeId) : undefined;
  });

  useEffect(() => {
    if (!activeId) return;
    const refresh = () => {
      setAsg(getStaffAssignmentById(activeId));
    };
    refresh();
    const unsubscribe = subscribeStaff(refresh);
    return () => unsubscribe();
  }, [activeId]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/assignments' as never);
    }
  };

  const handleNavigate = () => {
    if (!asg) return;
    const dest = encodeURIComponent(asg.destination || asg.pickupLocation);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${dest}`;
    Linking.canOpenURL(mapsUrl).then((can) => {
      if (can) {
        Linking.openURL(mapsUrl);
      } else {
        Alert.alert(
          'Navigation Route',
          `Route to: ${asg.destination}\nPickup: ${asg.pickupLocation}`,
        );
      }
    });
  };

  const handleCall = () => {
    if (!asg) return;
    const cleanPhone = asg.customerPhone.replace(/[^0-9+]/g, '');
    const telUrl = `tel:${cleanPhone}`;
    Linking.canOpenURL(telUrl).then((can) => {
      if (can) {
        Linking.openURL(telUrl);
      } else {
        Alert.alert('Customer Phone', `Client telephone: ${asg.customerPhone}`);
      }
    });
  };

  const handleWhatsApp = () => {
    if (!asg) return;
    const cleanPhone = asg.customerPhone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}`;
    Linking.canOpenURL(waUrl).then((can) => {
      if (can) {
        Linking.openURL(waUrl);
      } else {
        Alert.alert('WhatsApp Protocol', `Client WhatsApp: ${asg.customerPhone}`);
      }
    });
  };

  const handleContactOperations = () => {
    Alert.alert(
      'Central Operations Dispatch',
      'Protocol desk: +221 33 800 0001\nRadio frequency: VIP-OPS-1',
    );
  };

  // Missing resource fallback (genuine not-found state without fake substitution)
  if (!activeId || !asg) {
    return (
      <View style={styles.screen}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 8, paddingHorizontal: 20 }]}>
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

        <View style={styles.divider} />

        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <NotFoundCard
            resourceName="Assignment"
            resourceId={activeId || 'None'}
            onBack={() => router.replace('/assignments' as never)}
          />
        </View>

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
          <Text style={styles.pageTitle}>Assignment Detail</Text>
        </View>

        {/* Status Badge below title matching Figma node 71:71 */}
        <View style={styles.statusRow}>
          <StaffStatusBadge status={asg.assignmentStatus} />
        </View>

        {/* 6 Specification Cards matching Figma nodes 71:82 - 71:99 */}
        <View style={styles.specContainer}>
          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Service</Text>
            <Text style={styles.specValue} numberOfLines={1}>
              {asg.serviceName || asg.title}
            </Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Customer</Text>
            <Text style={styles.specValue} numberOfLines={1}>
              {asg.customerName}
            </Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Schedule</Text>
            <Text style={styles.specValue} numberOfLines={1}>
              {asg.schedule || asg.pickupTime}
            </Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Location</Text>
            <Text style={styles.specValue} numberOfLines={1}>
              {asg.pickupLocation.split(',')[0]} → {asg.destination.split(',')[0]}
            </Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Asset</Text>
            <Text style={styles.specValue} numberOfLines={1}>
              {asg.vehicleAssigned.split('(')[0].trim()} • {asg.vehiclePlate}
            </Text>
          </View>

          <View style={styles.specCard}>
            <Text style={styles.specLabel}>Flight</Text>
            <Text style={styles.specValue} numberOfLines={1}>
              {asg.flightNumber || 'If applicable'}
            </Text>
          </View>
        </View>

        {/* Quick Action Controls matching Figma node 71:100 */}
        <View style={styles.quickActionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.quickActionBtn,
              pressed && styles.quickActionBtnPressed,
            ]}
            onPress={handleNavigate}
            accessibilityRole="button"
            accessibilityLabel="Navigate to destination"
          >
            <Text style={styles.quickActionText}>Navigate</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickActionBtn,
              pressed && styles.quickActionBtnPressed,
            ]}
            onPress={handleCall}
            accessibilityRole="button"
            accessibilityLabel="Call customer"
          >
            <Text style={styles.quickActionText}>Call</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickActionBtn,
              pressed && styles.quickActionBtnPressed,
            ]}
            onPress={handleWhatsApp}
            accessibilityRole="button"
            accessibilityLabel="WhatsApp customer"
          >
            <Text style={styles.quickActionText}>WhatsApp</Text>
          </Pressable>
        </View>

        {/* Action Buttons matching Figma nodes 71:100 - 71:112 */}
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
          onPress={() =>
            router.push({
              pathname: '/assignments/update-status',
              params: { assignmentId: asg.id },
            } as never)
          }
          accessibilityRole="button"
          accessibilityLabel="Update status"
        >
          <Text style={styles.primaryBtnText}>Update status</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
          onPress={() =>
            router.push({
              pathname: '/assignments/report-issue',
              params: { assignmentId: asg.id },
            } as never)
          }
          accessibilityRole="button"
          accessibilityLabel="Add note / report issue"
        >
          <Text style={styles.secondaryBtnText}>Add note / report issue</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.tertiaryBtn, pressed && styles.tertiaryBtnPressed]}
          onPress={handleContactOperations}
          accessibilityRole="button"
          accessibilityLabel="Contact Operations"
        >
          <Text style={styles.tertiaryBtnText}>Contact Operations</Text>
        </Pressable>
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
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.2,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  specContainer: {
    gap: 8,
    marginBottom: 16,
  },
  specCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.15,
    width: 110,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5B616B',
    textAlign: 'right',
    flex: 1,
  },
  quickActionRow: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  quickActionBtn: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quickActionBtnPressed: {
    backgroundColor: '#EAE6DE',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#164D53',
    letterSpacing: 0.1,
  },
  primaryBtn: {
    backgroundColor: '#0B0C0E',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryBtnPressed: {
    opacity: 0.88,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A6A19A',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryBtnPressed: {
    backgroundColor: '#F5F3EE',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  tertiaryBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
});
