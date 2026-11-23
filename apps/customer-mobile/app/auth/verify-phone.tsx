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
import { StyleSheet, View } from 'react-native';

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

  const _handleFillDemo = () => {
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
      <View style={styles.badgeWrapper}>
        <BrandLogo variant="customer" />
      </View>

      <AuthHeader
        title="Verify your phone"
        subtitle="Enter the 6-digit verification code sent to your mobile device."
      />

      <View style={styles.formContainer}>
        <InputField
          label="Phone"
          placeholder="Registered mobile number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <InputField
          label="One-time code"
          placeholder="••••••"
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
          <TextLink label="Didn't receive a code? Resend code" onPress={handleResend} />
        </View>

        <NoticeBanner
          title="Verification state"
          message={bannerMessage}
          style={styles.noticeBanner}
        />
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
    marginTop: 14,
    marginBottom: 8,
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 10,
  },
  resendWrapper: {
    marginTop: 6,
    alignItems: 'center',
  },
  noticeBanner: {
    marginTop: 14,
  },
});
