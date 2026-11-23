import { sampleCustomer } from '@xtreme/mock-data';
import { Button, Header, palette, ScreenContainer, TextField, useMockAuth } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/** CUS-AUTH-01 — Sign In. Handles mock authentication login transition. */
export default function Screen() {
  const router = useRouter();
  const { login } = useMockAuth();
  const [phone, setPhone] = useState('+221 77 000 1234');

  const handleSignIn = () => {
    login(sampleCustomer);
    router.replace('/discover' as never);
  };

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-AUTH-01"
        title="Welcome to XTREME"
        subtitle="Sign in to your concierge portal"
        onBack={() => router.back()}
      />

      <View style={styles.card}>
        <TextField
          label="Senegal Telephone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+221 XX XXX XXXX"
          keyboardType="phone-pad"
        />
        <Button label="Sign In (Demo Session)" onPress={handleSignIn} style={styles.btn} />
        <Button
          label="Create Account"
          variant="outline"
          onPress={() => router.push('/auth/register' as never)}
          style={styles.btn}
        />
        <Button
          label="Forgot Password"
          variant="outline"
          onPress={() => router.push('/auth/forgot-password' as never)}
          style={styles.btn}
        />
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
    marginTop: 10,
  },
});
