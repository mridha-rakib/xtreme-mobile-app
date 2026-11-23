import {
  AuthHeader,
  AuthScreenContainer,
  BrandLogo,
  LegalFooter,
  RecoveryMethodCard,
  TextLink,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/**
 * CUS-AUTH-04 — Forgot Password Method
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-04.svg)
 *
 * SPECIFICATION & NAVIGATION COMPLIANCE:
 * - Allows customer to choose between phone OTP and email reset link.
 * - Routes to /auth/reset-phone or /auth/reset-email.
 * - Back link returns to /auth/sign-in.
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <AuthScreenContainer>
      <View style={styles.badgeWrapper}>
        <BrandLogo variant="customer" />
      </View>

      <AuthHeader
        title="Reset your password"
        subtitle="Choose how you would like to receive your recovery instructions."
      />

      <View style={styles.methodsContainer}>
        <RecoveryMethodCard
          badgeLetter="P"
          badgeColor="#C6A15B"
          title="Phone OTP"
          description="Receive a 6-digit verification code on your verified mobile phone."
          onPress={() => router.push('/auth/reset-phone' as never)}
        />

        <RecoveryMethodCard
          badgeLetter="E"
          badgeColor="#164D53"
          title="Email link"
          description="Receive a secure password reset link at your registered email address."
          onPress={() => router.push('/auth/reset-email' as never)}
          style={styles.secondCard}
        />

        <View style={styles.linksContainer}>
          <TextLink
            label="Remember your password? Back to sign in"
            onPress={() => router.push('/auth/sign-in' as never)}
          />
        </View>
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
  methodsContainer: {
    marginTop: 8,
  },
  secondCard: {
    marginTop: 12,
  },
  linksContainer: {
    marginTop: 18,
    alignItems: 'center',
  },
});
