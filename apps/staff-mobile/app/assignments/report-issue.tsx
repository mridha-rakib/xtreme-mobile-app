import { addStaffIssueReport, getStaffAssignmentById } from '@xtreme/mock-data';
import type { StaffAssignment } from '@xtreme/types';
import { NotFoundCard, StaffBottomNav } from '@xtreme/ui';
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

const ISSUE_CONTEXTS = [
  'Traffic / Route Delay',
  'Vehicle Maintenance / Mechanical',
  'Client Delay / Protocol Wait',
  'Route Modification / Detour',
  'Weather / Environmental Conditions',
  'Security / Protocol Concern',
  'Other Operational Event',
];

const VISIBILITY_SCOPES = ['Operations & Dispatch Only', 'Client Visible', 'Protocol Management'];

const ASSIGNMENT_OUTCOMES = [
  'Continue as planned',
  'Delay anticipated (within tolerance)',
  'Reroute required',
  'Unable to complete (request backup)',
];

/**
 * STF-ASG-04: Operational Note / Report Issue Screen
 * Authoritative Figma Frame: 71:142 (STF-ASG-04__Operational_Note_/_Report_Issue__Ready)
 */
export default function OperationalNoteReportIssueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ assignmentId?: string; id?: string }>();
  const activeId = params.assignmentId || params.id;

  const asg: StaffAssignment | undefined = useMemo(() => {
    return activeId ? getStaffAssignmentById(activeId) : undefined;
  }, [activeId]);

  const [issueContext, setIssueContext] = useState(ISSUE_CONTEXTS[0]);
  const [visibilityScope, setVisibilityScope] = useState(VISIBILITY_SCOPES[0]);
  const [noteText, setNoteText] = useState('');
  const [assignmentOutcome, setAssignmentOutcome] = useState(ASSIGNMENT_OUTCOMES[0]);

  // Modals for selection dropdowns
  const [activePicker, setActivePicker] = useState<'context' | 'scope' | 'outcome' | null>(null);

  // Validation error state matching Figma node 75:801
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (!asg) return;

    if (!noteText.trim()) {
      setErrorMessage('Please describe the operational issue or note before submitting.');
      return;
    }

    setErrorMessage(null);

    const isUnableToComplete = assignmentOutcome === 'Unable to complete (request backup)';

    addStaffIssueReport({
      assignmentId: asg.id,
      issueContext,
      visibilityScope,
      description: noteText.trim(),
      assignmentOutcome: isUnableToComplete ? 'UNABLE_TO_COMPLETE' : assignmentOutcome,
      category: issueContext.includes('Traffic')
        ? 'TRAFFIC'
        : issueContext.includes('Vehicle')
          ? 'VEHICLE_ISSUE'
          : issueContext.includes('Delay')
            ? 'CLIENT_DELAY'
            : issueContext.includes('Route')
              ? 'ROUTE_CHANGE'
              : 'OTHER',
      severity: isUnableToComplete ? 'CRITICAL' : 'MEDIUM',
    });

    Alert.alert(
      'Operational Report Submitted',
      'The operational record has been filed to Central Operations dispatch.',
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
          <Text style={styles.pageTitle}>Operational Note / Report Issue</Text>
        </View>

        {/* Validation Error Banner if triggered matching Figma node 75:801 */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorTitle}>Validation Error</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* 1. Issue Context Selector matching Figma node 71:150 */}
        <Text style={styles.fieldLabel}>Issue context</Text>
        <Pressable
          style={({ pressed }) => [styles.selectBox, pressed && styles.selectBoxPressed]}
          onPress={() => setActivePicker('context')}
          accessibilityRole="button"
          accessibilityLabel={`Issue context: ${issueContext}`}
        >
          <Text style={styles.selectBoxValue} numberOfLines={1}>
            {issueContext}
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

        {/* 2. Visibility Scope Selector matching Figma node 71:156 */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Visibility scope</Text>
        <Pressable
          style={({ pressed }) => [styles.selectBox, pressed && styles.selectBoxPressed]}
          onPress={() => setActivePicker('scope')}
          accessibilityRole="button"
          accessibilityLabel={`Visibility scope: ${visibilityScope}`}
        >
          <Text style={styles.selectBoxValue} numberOfLines={1}>
            {visibilityScope}
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

        {/* 3. Note Multiline Text Field matching Figma node 71:162 */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Note</Text>
        <TextInput
          style={[styles.textArea, errorMessage ? styles.textAreaError : null]}
          placeholder="Describe issue / note"
          placeholderTextColor="#5B616B"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={noteText}
          onChangeText={(txt) => {
            setNoteText(txt);
            if (errorMessage) setErrorMessage(null);
          }}
          maxLength={4000}
        />
        <Text style={styles.helperText}>Required • max 4000 characters</Text>

        {/* 4. Assignment Outcome Selector matching Figma node 71:167 */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Assignment outcome</Text>
        <Pressable
          style={({ pressed }) => [styles.selectBox, pressed && styles.selectBoxPressed]}
          onPress={() => setActivePicker('outcome')}
          accessibilityRole="button"
          accessibilityLabel={`Assignment outcome: ${assignmentOutcome}`}
        >
          <Text style={styles.selectBoxValue} numberOfLines={1}>
            {assignmentOutcome}
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

        {/* Action Buttons matching Figma nodes 71:174 - 71:176 */}
        <View style={{ marginTop: 28 }}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit note / report"
          >
            <Text style={styles.primaryBtnText}>Submit note / report</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.secondaryBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Dynamic Selection Picker Modal */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActivePicker(null)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {activePicker === 'context'
                ? 'Select Issue Context'
                : activePicker === 'scope'
                  ? 'Select Visibility Scope'
                  : 'Select Assignment Outcome'}
            </Text>

            {(activePicker === 'context'
              ? ISSUE_CONTEXTS
              : activePicker === 'scope'
                ? VISIBILITY_SCOPES
                : ASSIGNMENT_OUTCOMES
            ).map((opt) => {
              const isSelected =
                activePicker === 'context'
                  ? issueContext === opt
                  : activePicker === 'scope'
                    ? visibilityScope === opt
                    : assignmentOutcome === opt;

              return (
                <Pressable
                  key={opt}
                  style={[styles.modalItem, isSelected && styles.modalItemActive]}
                  onPress={() => {
                    if (activePicker === 'context') setIssueContext(opt);
                    else if (activePicker === 'scope') setVisibilityScope(opt);
                    else if (activePicker === 'outcome') setAssignmentOutcome(opt);
                    setActivePicker(null);
                  }}
                >
                  <Text style={[styles.modalItemText, isSelected && styles.modalItemTextActive]}>
                    {opt}
                  </Text>
                  {isSelected && (
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
              );
            })}
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
    color: '#0B0C0E',
    marginBottom: 8,
    letterSpacing: 0.1,
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
    fontSize: 15,
    color: '#0B0C0E',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    minHeight: 96,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0B0C0E',
  },
  textAreaError: {
    borderColor: '#C62828',
  },
  helperText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    marginTop: 6,
  },
  errorBanner: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F5C6CB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#721C24',
    marginBottom: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#721C24',
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
