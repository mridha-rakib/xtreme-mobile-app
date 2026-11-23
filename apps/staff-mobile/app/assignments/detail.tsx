import { sampleStaffAssignments } from '@xtreme/mock-data';
import {
  Button,
  DetailRow,
  Header,
  NotFoundCard,
  palette,
  ScreenContainer,
  StatusBadge,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/** STF-ASG-02 — Assignment Detail. Preserves assignmentId with safe missing resource fallback. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; assignmentId?: string }>();
  const activeId = params.assignmentId || params.id;

  const asg = activeId
    ? sampleStaffAssignments.find((a) => a.id === activeId)
    : sampleStaffAssignments[0];

  if (!asg) {
    return (
      <ScreenContainer>
        <Header eyebrow="STF-ASG-02" title="Assignment Detail" onBack={() => router.back()} />
        <NotFoundCard
          resourceName="Assignment"
          resourceId={activeId}
          onBack={() => router.replace('/assignments' as never)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        eyebrow="STF-ASG-02"
        title={asg.title}
        subtitle={`Ref: ${asg.bookingReference}`}
        onBack={() => router.back()}
      />

      <View style={styles.card}>
        <DetailRow label="Status" value={<StatusBadge status={asg.assignmentStatus} />} />
        <DetailRow label="Client Name" value={asg.customerName} />
        <DetailRow label="Client Phone" value={asg.customerPhone} />
        <DetailRow label="Pickup Time" value={asg.pickupTime} />
        <DetailRow label="Pickup Point" value={asg.pickupLocation} />
        <DetailRow label="Destination" value={asg.destination} />
        <DetailRow label="Assigned Vehicle" value={asg.vehicleAssigned} />
        <DetailRow label="Plate Number" value={asg.vehiclePlate} />
        <DetailRow label="Passengers" value={asg.passengerCount} />
      </View>

      <Button
        label="Update Assignment Status"
        onPress={() => router.push(`/assignments/update-status?assignmentId=${asg.id}` as never)}
        style={styles.btn}
      />

      <Button
        label="Report Issue / Operational Note"
        variant="outline"
        onPress={() => router.push(`/assignments/report-issue?assignmentId=${asg.id}` as never)}
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
