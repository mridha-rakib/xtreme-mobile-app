import {
  getAllowedNextAssignmentStatuses,
  getStaffAssignmentById,
  updateStaffAssignmentStatus,
} from '@xtreme/mock-data';
import type { AssignmentStatus, StaffAssignment } from '@xtreme/types';
import { NotFoundCard, StaffBottomNav, StaffStatusBadge } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../../assets/logo.png');

/**
 * STF-ASG-03: Update Assignment Status Screen
 * Authoritative Figma Frame: 71:113 (STF-ASG-03__Update_Assignment_Status__Ready)
 */
export default function UpdateAssignmentStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ assignmentId?: string; id?: string }>();
  const activeId = params.assignmentId || params.id;

  const asg: StaffAssignment | undefined = useMemo(() => {
    return activeId ? getStaffAssignmentById(activeId) : undefined;
  }, [activeId]);

  const allowedStatuses = useMemo(() => {
    if (!asg) return [];
    return getAllowedNextAssignmentStatuses(asg.assignmentStatus);
  }, [asg]);

  const [selectedStatus, setSelectedStatus] = useState<AssignmentStatus | undefined>(() => {
    return allowedStatuses.length > 0 ? allowedStatuses[0] : undefined;
  });

  const [note, setNote] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    if (!asg) return;
    if (!selectedStatus) {
      Alert.alert('Selection Required', 'Please select a valid next status.');
      return;
    }

    const result = updateStaffAssignmentStatus(asg.id, selectedStatus, note.trim() || undefined);
    if (result.success) {
      Alert.alert(
        'Status Updated',
        `Assignment "${asg.title}" is now ${selectedStatus.replace('_', ' ')}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace(`/assignments/detail?assignmentId=${asg.id}` as never);
              }
            },
          },
        ],
      );
    } else {
      Alert.alert('Update Failed', result.error || 'Failed to update assignment status.');
    }
  };

  // Missing resource fallback
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
          <Text style={styles.pageTitle}>Update Assignment Status</Text>
        </View>

        {/* Current Status Row matching Figma node 71:121 */}
        <Text style={styles.fieldLabel}>Current status</Text>
        <View style={styles.statusBadgeRow}>
          <StaffStatusBadge status={asg.assignmentStatus} />
        </View>

        {/* Allowed Next Status Selector matching Figma node 71:125 */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Allowed next status</Text>
        {allowedStatuses.length === 0 ? (
          <View style={styles.terminalStateBox}>
            <Text style={styles.terminalStateText}>
              No valid forward transition available from this status.
            </Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.selectBox, pressed && styles.selectBoxPressed]}
            onPress={() => setPickerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={`Select next status, current selection is ${selectedStatus || 'none'}`}
          >
            <Text style={styles.selectBoxValue}>
              {selectedStatus ? selectedStatus.replace('_', ' ') : 'Select next status'}
            </Text>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 9L12 15L18 9"
                stroke="#164D53"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        )}

        {/* Optional Note Field matching Figma node 71:130 */}
        <Text style={[styles.fieldLabel, { marginTop: 18 }]}>Optional note</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Add operational note"
          placeholderTextColor="#5B616B"
          value={note}
          onChangeText={setNote}
          maxLength={2000}
        />
        <Text style={styles.helperText}>Max 2000 characters</Text>

        {/* Guidance Notice Box matching Figma node 71:136 */}
        <View style={styles.guidanceBox}>
          <Text style={styles.guidanceText}>
            Only server-allowed forward transitions are shown. Non-driver work may skip
            transport-only stages.
          </Text>
        </View>

        {/* Action Buttons matching Figma nodes 71:138 - 71:140 */}
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            allowedStatuses.length === 0 && styles.btnDisabled,
            pressed && styles.primaryBtnPressed,
          ]}
          onPress={handleConfirm}
          disabled={allowedStatuses.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Confirm status"
        >
          <Text style={styles.primaryBtnText}>Confirm status</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={styles.secondaryBtnText}>Cancel</Text>
        </Pressable>
      </ScrollView>

      {/* Next Status Picker Modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPickerVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Next Status</Text>
            {allowedStatuses.map((st) => (
              <Pressable
                key={st}
                style={[styles.modalItem, selectedStatus === st && styles.modalItemActive]}
                onPress={() => {
                  setSelectedStatus(st);
                  setPickerVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedStatus === st && styles.modalItemTextActive,
                  ]}
                >
                  {st.replace('_', ' ')}
                </Text>
                {selectedStatus === st && (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17L4 12"
                      stroke="#164D53"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

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
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.2,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B616B',
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  selectBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  selectBoxPressed: {
    backgroundColor: '#F7F5F0',
  },
  selectBoxValue: {
    fontSize: 16,
    color: '#0B0C0E',
    fontWeight: '500',
  },
  terminalStateBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    padding: 14,
  },
  terminalStateText: {
    fontSize: 14,
    color: '#8A6A2B',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#0B0C0E',
  },
  helperText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    marginTop: 6,
  },
  guidanceBox: {
    backgroundColor: '#F1E7D2',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    marginBottom: 24,
  },
  guidanceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
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
  btnDisabled: {
    opacity: 0.4,
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A6A19A',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B0C0E',
    marginBottom: 8,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalItemActive: {
    backgroundColor: '#FAF8F4',
  },
  modalItemText: {
    fontSize: 15,
    color: '#0B0C0E',
  },
  modalItemTextActive: {
    fontWeight: '700',
    color: '#164D53',
  },
});
