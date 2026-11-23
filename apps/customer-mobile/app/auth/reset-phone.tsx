import {
  AuthHeader,
  AuthScreenContainer,
  BrandLogo,
  InputField,
  LegalFooter,
  NeutralSecurityNotice,
  PrimaryButton,
  TextLink,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const E164_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

/**
 * CUS-AUTH-05 — Phone Password Reset Request
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-05.svg)
 *
 * SECURITY & SPECIFICATION COMPLIANCE:
 * - Does not disclose whether an account exists (neutral confirmation policy).
 * - Validates E.164 phone format.
 * - Passes phone to confirmation route without real backend delivery.
 */
export default function ResetPhoneScreen() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const _handleFillDemo = () => {
    setPhone('+221 77 123 4567');
    setError(undefined);
  };

  const handleSendOtp = () => {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      setError('Please provide your registered phone number');
      return;
    }

    if (!E164_PHONE_REGEX.test(cleanPhone)) {
      setError('Enter a valid E.164 format number (e.g. +221771234567)');
      return;
    }

    setError(undefined);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Navigate to phone reset confirmation passing phone param
      router.push({
        pathname: '/auth/reset-phone-confirm',
        params: { phone: phone.trim() },
      } as never);
    }, 350);
  };

  return (
    <AuthScreenContainer>
      <View style={styles.badgeWrapper}>
        <BrandLogo variant="customer" />
      </View>

      <AuthHeader
        title="Reset by phone"
        subtitle="Enter your verified mobile phone number to receive a one-time reset code."
      />

      <View style={styles.formContainer}>
        <InputField
          label="Phone"
          placeholder="E.164 mobile number (e.g. +221771234567)"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (error) setError(undefined);
          }}
          keyboardType="phone-pad"
          error={error}
        />

        <PrimaryButton
          label="Send reset OTP"
          onPress={handleSendOtp}
          loading={isLoading}
          style={styles.submitBtn}
        />

        <View style={styles.linksContainer}>
          <TextLink
            label="Use a different recovery method? Back to recovery options"
            onPress={() => router.push('/auth/forgot-password' as never)}
          />
        </View>

        {/* Non-disclosure security notice matching Figma CUS-AUTH-05 */}
        <NeutralSecurityNotice
          title="Neutral request result"
          description="The response does not confirm whether an account exists."
          style={styles.noticeSpacing}
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
    marginBottom: 8,
  },
  linksContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  noticeSpacing: {
    marginTop: 14,
  },
});
