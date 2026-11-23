import { sampleCustomer } from '@xtreme/mock-data';
import {
  Button,
  DetailRow,
  Header,
  ProtectedRoute,
  palette,
  ScreenContainer,
  useMockAuth,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/** CUS-PRO-01 — Profile. Protected mock session handling & verified logout navigation. */
export default function Screen() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useMockAuth();
  const user = currentUser || sampleCustomer;

  const handleLogout = () => {
    logout();
    router.replace('/auth/sign-in' as never);
  };

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-PRO-01"
        title="Client Profile"
        subtitle={isAuthenticated ? 'Active Mock Session' : 'Signed Out'}
        onBack={() => router.back()}
      />
      <ProtectedRoute onSignIn={() => router.replace('/auth/sign-in' as never)}>
        <View style={styles.card}>
          <DetailRow label="Client Name" value={`${user.firstName} ${user.lastName}`} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Phone" value={user.phone} />
          <DetailRow label="Preferred Language" value={user.preferredLanguage.toUpperCase()} />
          <DetailRow label="VIP Tier" value={user.vipTier || 'BLACK_CARD'} />
          <DetailRow label="Primary City" value={user.city} />
        </View>

        <Button
          label="Edit Profile Details"
          variant="outline"
          onPress={() => router.push('/account/edit-profile' as never)}
          style={styles.btn}
        />

        <Button
          label="Log Out (Mock Session)"
          variant="danger"
          onPress={handleLogout}
          style={styles.btn}
        />
      </ProtectedRoute>
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
