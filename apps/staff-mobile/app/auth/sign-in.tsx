import { sampleStaffUser } from '@xtreme/mock-data';
import { Button, Header, palette, ScreenContainer, TextField, useMockAuth } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/** STF-AUTH-01 — Sign In. Staff authentication portal with mock login transition. */
export default function Screen() {
  const router = useRouter();
  const { login } = useMockAuth();
  const [driverId, setDriverId] = useState('STF-DRV-001');

  const handleSignIn = () => {
    login(sampleStaffUser);
    router.replace('/assignments' as never);
  };

  return (
    <ScreenContainer>
      <Header
        eyebrow="STF-AUTH-01"
        title="XTREME Staff Portal"
        subtitle="Driver & Operations Sign In"
        onBack={() => router.back()}
      />

      <View style={styles.card}>
        <TextField
          label="Staff / Chauffeur ID"
          value={driverId}
          onChangeText={setDriverId}
          placeholder="e.g. STF-DRV-001"
        />

        <Button label="Sign In as Driver (Demo)" onPress={handleSignIn} style={styles.btn} />
      </View>
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
  },
  btn: {
    marginTop: 12,
  },
});
