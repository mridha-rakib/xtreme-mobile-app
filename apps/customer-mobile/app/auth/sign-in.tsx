import { sampleCustomer } from '@xtreme/mock-data';
import {
  AuthHeader,
  BrandLogo,
  InputField,
  LegalFooter,
  PasswordInput,
  PrimaryButton,
  ScreenTopBar,
  TextLink,
  useMockAuth,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * CUS-AUTH-01 — Sign In
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-01.svg)
 *
 * SPECIFICATION & ACCEPTANCE COMPLIANCE:
 * - Empty fields by default in standard user flow (no unconditional prefill).
 * - Explicit development mechanism for testing ("Dev: Fill Demo Account").
 * - Frontend validation for non-empty identifier and password.
 * - Clear separation of simulated mock session from live production auth.
 */
export default function SignInScreen() {
  const router = useRouter();
  const { login } = useMockAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Explicit development mechanism for quick test access
  const handleFillDemo = () => {
    setIdentifier('+221 77 123 4567');
    setPassword('demo-concierge');
    setIdentifierError(undefined);
    setPasswordError(undefined);
  };

  const handleSignIn = () => {
    let hasError = false;
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      setIdentifierError('Registered email or mobile number is required');
      hasError = true;
    } else {
      setIdentifierError(undefined);
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else {
      setPasswordError(undefined);
    }

    if (hasError) return;

    setIsLoading(true);

    // Mock authentication transition without live network calls
    setTimeout(() => {
      setIsLoading(false);
      login(sampleCustomer);
      router.replace('/discover' as never);
    }, 350);
  };

  return (
    <View style={styles.screen}>
      <ScreenTopBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader title="Sign In" subtitle="Customer App" />

        <View style={styles.badgeWrapper}>
          <BrandLogo variant="customer" />
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Identifier"
            placeholder="Registered email or mobile number"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (identifierError) setIdentifierError(undefined);
            }}
            keyboardType="default"
            autoCapitalize="none"
            error={identifierError}
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError(undefined);
            }}
            error={passwordError}
          />

          <PrimaryButton
            label="Sign in"
            onPress={handleSignIn}
            loading={isLoading}
            style={styles.submitBtn}
          />

          <View style={styles.linksContainer}>
            <TextLink
              label="Create account"
              onPress={() => router.push('/auth/register' as never)}
            />
            <TextLink
              label="Forgot password"
              onPress={() => router.push('/auth/forgot-password' as never)}
            />
          </View>

          {/* Explicit Development Mechanism */}
          <View style={styles.devContainer}>
            <Pressable
              accessibilityRole="button"
              onPress={handleFillDemo}
              style={({ pressed }) => [styles.devButton, pressed && styles.devButtonPressed]}
            >
              <Text style={styles.devButtonText}>Dev: Fill Demo Account</Text>
            </Pressable>
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
  formContainer: {
    marginTop: 8,
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 8,
  },
  linksContainer: {
    marginTop: 8,
    gap: 4,
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
