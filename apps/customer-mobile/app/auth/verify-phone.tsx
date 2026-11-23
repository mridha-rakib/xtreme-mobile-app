import { sampleCustomer } from '@xtreme/mock-data';
import { DEFAULT_OTP_CONFIG } from '@xtreme/types';
import {
  AuthHeader,
  AuthScreenContainer,
  BrandLogo,
  InputField,
  LegalFooter,
  NoticeBanner,
  PrimaryButton,
  TextLink,
  useMockAuth,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * CUS-AUTH-03 — Phone OTP Verification
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-03.svg)
 *
 * SPECIFICATION & ACCEPTANCE COMPLIANCE:
 * - Unconditional prefilled OTP removed from standard user flow.
 * - OTP code empty by default; adheres to DEFAULT_OTP_CONFIG bounds.
 * - Verification state notice banner with Atlantic tint (#DDEBEC).
 * - Cross-platform Safe Area & keyboard avoidance.
 * - Gated QA dev button behind __DEV__.
 */
export default function VerifyPhoneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const { login } = useMockAuth();

  const [phone, setPhone] = useState(params.phone || '');
  const [otpCode, setOtpCode] = useState('');
  const [bannerMessage, setBannerMessage] = useState(
    'Retry or resend remains available when permitted.',
  );
  const [error, setError] = useState<string | undefined>();
  const [isVerifying, setIsVerifying] = useState(false);

  const isLengthValid =
    otpCode.length >= DEFAULT_OTP_CONFIG.minLength &&
    otpCode.length <= DEFAULT_OTP_CONFIG.maxLength;

  const handleFillDemo = () => {
    if (!phone) setPhone('+221 77 123 4567');
    setOtpCode('123456');
    setError(undefined);
  };

  const handleVerify = () => {
    if (!phone.trim()) {
      setError('Please provide a mobile phone number');
      return;
    }

    if (!otpCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!isLengthValid) {
      setError(
        `Verification code must be between ${DEFAULT_OTP_CONFIG.minLength} and ${DEFAULT_OTP_CONFIG.maxLength} digits`,
      );
      return;
    }

    setError(undefined);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      login(sampleCustomer);
      router.replace('/discover' as never);
    }, 400);
  };

  const handleResend = () => {
    setBannerMessage('A new verification code has been simulated for testing.');
  };

  return (
    <AuthScreenContainer>
      <AuthHeader title="Phone Verification" subtitle="Verify your registered mobile number" />

      <View style={styles.badgeWrapper}>
        <BrandLogo variant="customer" />
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Phone"
          placeholder="Registered mobile number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <InputField
          label="OTP code"
          placeholder="Verification code"
          value={otpCode}
          onChangeText={(text) => {
            setOtpCode(text);
            if (error) setError(undefined);
          }}
          keyboardType="numeric"
          error={error}
        />

        <PrimaryButton
          label="Verify OTP"
          onPress={handleVerify}
          loading={isVerifying}
          disabled={!isLengthValid}
          style={styles.submitBtn}
        />

        <View style={styles.resendWrapper}>
          <TextLink label="Resend / request OTP" onPress={handleResend} />
        </View>

        <NoticeBanner
          title="Verification state"
          message={bannerMessage}
          style={styles.noticeBanner}
        />

        {__DEV__ ? (
          <View style={styles.devContainer}>
            <Pressable
              accessibilityRole="button"
              onPress={handleFillDemo}
              style={({ pressed }) => [styles.devButton, pressed && styles.devButtonPressed]}
            >
              <Text style={styles.devButtonText}>Dev: Fill Test OTP (123456)</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <LegalFooter
        onPrivacyPress={() => router.push('/legal/document' as never)}
        onTermsPress={() => router.push('/legal/document' as never)}
      />
    </AuthScreenContainer>
  );
}

const styles = StyleSheet.create({
  badgeWrapper: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 14,
    marginBottom: 10,
  },
  resendWrapper: {
    alignItems: 'center',
  },
  noticeBanner: {
    marginTop: 18,
  },
  devContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  devButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#EEE9E0',
    borderWidth: 1,
    borderColor: '#DDD8CF',
  },
  devButtonPressed: {
    opacity: 0.7,
  },
  devButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B616B',
  },
});
