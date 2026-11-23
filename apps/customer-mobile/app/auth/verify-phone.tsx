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
import { ScrollView, StyleSheet, View } from 'react-native';

/**
 * CUS-AUTH-03 — Phone OTP Verification
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-03.svg)
 * Flexible OTP configuration compliance (no hardcoded length restriction)
 */
export default function VerifyPhoneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const { login } = useMockAuth();

  const [phone, setPhone] = useState(params.phone || '+221 77 123 4567');
  const [otpCode, setOtpCode] = useState('123456');
  const [bannerMessage, setBannerMessage] = useState(
    'Retry or resend remains available when permitted.',
  );
  const [error, setError] = useState<string | undefined>();
  const [isVerifying, setIsVerifying] = useState(false);

  const isLengthValid =
    otpCode.length >= DEFAULT_OTP_CONFIG.minLength &&
    otpCode.length <= DEFAULT_OTP_CONFIG.maxLength;

  const handleVerify = () => {
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
});
