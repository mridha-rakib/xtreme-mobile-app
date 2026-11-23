import { sampleStaffAssignments } from '@xtreme/mock-data';
import {
  Button,
  Header,
  ProtectedRoute,
  ScreenCard,
  ScreenContainer,
  useMockAuth,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/** STF-ASG-01 — Assignment Home. Protected driver dispatch portal with active session management. */
export default function Screen() {
  const router = useRouter();
  const { currentUser, logout } = useMockAuth();

  return (
    <ScreenContainer>
      <Header
        eyebrow="STF-ASG-01"
        title="Driver Assignments"
        subtitle={`Chauffeur: ${currentUser?.firstName || 'Moussa'} ${currentUser?.lastName || 'Camara'}`}
      />

      <ProtectedRoute onSignIn={() => router.replace('/auth/sign-in' as never)}>
        <View style={styles.list}>
          {sampleStaffAssignments.map((asg) => (
            <ScreenCard
              key={asg.id}
              title={asg.title}
              subtitle={`Pickup: ${asg.pickupTime} • ${asg.pickupLocation} → ${asg.destination}`}
              badge={asg.assignmentStatus}
              onPress={() => router.push(`/assignments/detail?assignmentId=${asg.id}` as never)}
            />
          ))}
        </View>

        <Button
          label="Assignment History"
          variant="outline"
          onPress={() => router.push('/assignments/history' as never)}
          style={styles.btn}
        />

        <Button
          label="Sign Out (Demo)"
          variant="danger"
          onPress={() => {
            logout();
            router.replace('/auth/sign-in' as never);
          }}
          style={styles.btn}
        />
      </ProtectedRoute>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 20,
  },
  btn: {
    marginBottom: 10,
  },
});
