import {
  AuthHeader,
  BrandLogo,
  InputField,
  LegalFooter,
  NeutralSecurityNotice,
  PrimaryButton,
  ScreenTopBar,
  TextLink,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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

  const handleFillDemo = () => {
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
    <View style={styles.screen}>
      <ScreenTopBar onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader title="Reset by Email" subtitle="Request a secure reset link" />

        <View style={styles.badgeWrapper}>
          <BrandLogo variant="customer" />
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Registered email"
            placeholder="Email address"
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
            <TextLink label="Back" onPress={() => router.back()} />
          </View>

          {/* Non-disclosure security notice matching Figma CUS-AUTH-07 */}
          <NeutralSecurityNotice
            title="Neutral request result"
            description="The response does not confirm whether an account exists."
          />

          {/* Development autofill gated behind __DEV__ */}
          {__DEV__ ? (
            <View style={styles.devContainer}>
              <Pressable
                accessibilityRole="button"
                onPress={handleFillDemo}
                style={({ pressed }) => [styles.devButton, pressed && styles.devButtonPressed]}
              >
                <Text style={styles.devButtonText}>Dev: Fill Test Email</Text>
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
