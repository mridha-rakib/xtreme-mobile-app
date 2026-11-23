import {
  AuthHeader,
  BrandLogo,
  LegalFooter,
  RecoveryMethodCard,
  ScreenTopBar,
  TextLink,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

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
    <View style={styles.screen}>
      <ScreenTopBar onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          />

          <View style={styles.linksContainer}>
            <TextLink
              label="Back to sign in"
              onPress={() => router.push('/auth/sign-in' as never)}
            />
          </View>
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
  methodsContainer: {
    marginTop: 8,
  },
  linksContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
});
