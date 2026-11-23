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
      <AuthHeader title="Forgot Password" subtitle="Choose an approved recovery method" />

      <View style={styles.badgeWrapper}>
        <BrandLogo variant="customer" />
      </View>

      <View style={styles.methodsContainer}>
        <RecoveryMethodCard
          badgeLetter="P"
          badgeColor="#A88343"
          title="Phone OTP"
          description="Recover using the registered mobile number."
          onPress={() => router.push('/auth/reset-phone' as never)}
        />

        <RecoveryMethodCard
          badgeLetter="E"
          badgeColor="#164D53"
          title="Email reset link"
          description="Recover through the registered email address."
          onPress={() => router.push('/auth/reset-email' as never)}
          style={styles.secondCard}
        />

        <View style={styles.linksContainer}>
          <TextLink label="Back to sign in" onPress={() => router.push('/auth/sign-in' as never)} />
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
    marginVertical: 14,
    alignItems: 'center',
  },
  methodsContainer: {
    marginTop: 8,
  },
  secondCard: {
    marginTop: 10,
  },
  linksContainer: {
    marginTop: 14,
    alignItems: 'center',
  },
});
