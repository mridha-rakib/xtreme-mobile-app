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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * CUS-AUTH-07 — Email Password Reset Request
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-07.svg)
 *
 * SECURITY & SPECIFICATION COMPLIANCE:
 * - Does not disclose whether an account exists (neutral confirmation policy).
 * - Validates standard email address format.
 * - Navigates to email reset confirmation.
 */
export default function ResetEmailScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const _handleFillDemo = () => {
    setEmail('amadou.diallo@example.sn');
    setError(undefined);
  };

  const handleSendLink = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please provide your registered email address');
      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(undefined);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Navigate to email reset confirmation passing email
      router.push({
        pathname: '/auth/reset-email-confirm',
        params: { email: trimmed },
      } as never);
    }, 350);
  };

  return (
    <AuthScreenContainer>
      <View style={styles.badgeWrapper}>
        <BrandLogo variant="customer" />
      </View>

      <AuthHeader
        title="Reset by email"
        subtitle="Enter your registered email address to receive password reset instructions."
      />

      <View style={styles.formContainer}>
        <InputField
          label="Email address"
          placeholder="name@domain.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(undefined);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />

        <PrimaryButton
          label="Send reset link"
          onPress={handleSendLink}
          loading={isLoading}
          style={styles.submitBtn}
        />

        <View style={styles.linksContainer}>
          <TextLink
            label="Use a different recovery method? Back to recovery options"
            onPress={() => router.push('/auth/forgot-password' as never)}
          />
        </View>

        {/* Non-disclosure security notice matching Figma CUS-AUTH-07 */}
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
