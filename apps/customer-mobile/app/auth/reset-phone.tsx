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
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

  const handleFillDemo = () => {
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
      <AuthHeader title="Reset by Phone" subtitle="Request a password-reset OTP" />

      <View style={styles.badgeWrapper}>
        <BrandLogo variant="customer" />
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Registered phone"
          placeholder="E.164 mobile number"
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
          <TextLink label="Back" onPress={() => router.back()} />
        </View>

        {/* Non-disclosure security notice matching Figma CUS-AUTH-05 */}
        <NeutralSecurityNotice
          title="Neutral request result"
          description="The response does not confirm whether an account exists."
          style={styles.noticeSpacing}
        />

        {/* Development autofill gated behind __DEV__ */}
        {__DEV__ ? (
          <View style={styles.devContainer}>
            <Pressable
              accessibilityRole="button"
              onPress={handleFillDemo}
              style={({ pressed }) => [styles.devButton, pressed && styles.devButtonPressed]}
            >
              <Text style={styles.devButtonText}>Dev: Fill Test Phone</Text>
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
    marginVertical: 14,
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 8,
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 8,
  },
  linksContainer: {
    marginTop: 6,
    alignItems: 'center',
  },
  noticeSpacing: {
    marginTop: 14,
  },
  devContainer: {
    marginTop: 12,
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
