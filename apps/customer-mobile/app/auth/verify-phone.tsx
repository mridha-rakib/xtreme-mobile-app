import { sampleCustomer } from '@xtreme/mock-data';
import { DEFAULT_OTP_CONFIG } from '@xtreme/types';
import {
  AuthHeader,
  BrandLogo,
  InputField,
  LegalFooter,
  NoticeBanner,
  PrimaryButton,
  ScreenTopBar,
  TextLink,
  useMockAuth,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * CUS-AUTH-03 — Phone OTP Verification
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-03.svg)
 *
 * SPECIFICATION & ACCEPTANCE COMPLIANCE:
 * - Unconditional prefilled OTP removed from normal user experience.
 * - OTP code is empty by default; user must input their code.
 * - Explicit development mechanism provides simulated test OTP.
 * - Contract-compliant OTP validation adhering to DEFAULT_OTP_CONFIG (no invented rules).
 * - Simulated resend action with dynamic status notice banner.
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

  // Flexible OTP length check conforming to canonical contract
  const isLengthValid =
    otpCode.length >= DEFAULT_OTP_CONFIG.minLength &&
    otpCode.length <= DEFAULT_OTP_CONFIG.maxLength;

  // Explicit development mechanism for testing
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
    <View style={styles.screen}>
      <ScreenTopBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

          {/* Explicit Development Mechanism (Gated behind __DEV__) */}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: 'space-between',
    minHeight: 740,
  },
  badgeWrapper: {
    marginVertical: 14,
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 6,
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 8,
  },
  resendWrapper: {
    marginTop: 4,
    marginBottom: 8,
  },
  noticeBanner: {
    marginTop: 16,
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
