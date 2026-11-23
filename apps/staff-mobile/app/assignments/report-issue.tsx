import { Button, DetailRow, Header, palette, ScreenContainer, TextField } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/** STF-ASG-04 — Operational Note / Report Issue. Preserves assignmentId and records operational event. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ assignmentId?: string }>();
  const assignmentId = params.assignmentId || 'demo-asg-001';

  const [issueNote, setIssueNote] = useState('Heavy traffic on VDN highway towards Almadies.');

  return (
    <ScreenContainer>
      <Header
        eyebrow="STF-ASG-04"
        title="Report Issue / Note"
        subtitle={`Assignment ID: ${assignmentId}`}
        onBack={() => router.back()}
      />

      <View style={styles.card}>
        <DetailRow label="Target Assignment" value={assignmentId} />
        <DetailRow label="Category" value="TRAFFIC / ROUTE DELAY" />
        <DetailRow label="Severity" value="MEDIUM" />
      </View>

      <TextField
        label="Operational Description"
        value={issueNote}
        onChangeText={setIssueNote}
        placeholder="Describe route, client, or vehicle issue"
      />

      <Button
        label="Submit Operational Report (Demo)"
        onPress={() => router.back()}
        style={styles.actionBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 12,
  },
});
