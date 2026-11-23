import { DEFAULT_OTP_CONFIG } from '@xtreme/types';
import { Button, Header, palette, ScreenContainer, TextField } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * CUS-AUTH-03 — Phone OTP Verification.
 * COMPLIANCE: OTP length is NOT hard-coded; respects DEFAULT_OTP_CONFIG contract.
 */
export default function Screen() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const isLengthValid =
    code.length >= DEFAULT_OTP_CONFIG.minLength && code.length <= DEFAULT_OTP_CONFIG.maxLength;

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-AUTH-03"
        title="Phone OTP Verification"
        subtitle={`Enter verification code (${DEFAULT_OTP_CONFIG.minLength}-${DEFAULT_OTP_CONFIG.maxLength} digits)`}
        onBack={() => router.back()}
      />

      <View style={styles.card}>
        <TextField
          label="Verification Code"
          value={code}
          onChangeText={setCode}
          placeholder="Enter SMS OTP code"
          keyboardType="numeric"
          helperText={`Flexible contract length: ${DEFAULT_OTP_CONFIG.minLength} to ${DEFAULT_OTP_CONFIG.maxLength} digits`}
        />

        <Button
          label="Verify Code (Demo)"
          onPress={() => router.replace('/discover' as never)}
          style={styles.btn}
          disabled={!isLengthValid}
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
    marginTop: 12,
  },
});
