import { Button, DetailRow, Header, palette, ScreenContainer } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/** STF-ASG-03 — Update Assignment Status. Preserves assignmentId and presents stage transitions. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ assignmentId?: string }>();
  const assignmentId = params.assignmentId || 'demo-asg-001';

  const handleUpdate = (_nextStatus: string) => {
    // In Phase 1.5, operational transitions update mock state and return to detail
    router.back();
  };

  return (
    <ScreenContainer>
      <Header
        eyebrow="STATUS UPDATE"
        title="Update Status"
        subtitle={`Assignment ID: ${assignmentId}`}
        onBack={() => router.back()}
      />

      <View style={styles.card}>
        <DetailRow label="Target Assignment" value={assignmentId} />
        <DetailRow label="Current Status" value="ASSIGNED" />
      </View>

      <Button
        label="Accept Assignment"
        variant="secondary"
        onPress={() => handleUpdate('ACCEPTED')}
        style={styles.btn}
      />
      <Button
        label="Mark En Route to Client"
        onPress={() => handleUpdate('EN_ROUTE')}
        style={styles.btn}
      />
      <Button
        label="Mark Arrived at Pickup"
        onPress={() => handleUpdate('ARRIVED')}
        style={styles.btn}
      />
      <Button
        label="Mark Trip In Progress"
        onPress={() => handleUpdate('IN_PROGRESS')}
        style={styles.btn}
      />
      <Button
        label="Mark Assignment Completed"
        variant="outline"
        onPress={() => handleUpdate('COMPLETED')}
        style={styles.btn}
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
  btn: {
    marginBottom: 10,
  },
});
