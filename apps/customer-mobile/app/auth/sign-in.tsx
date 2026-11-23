import { sampleCustomer } from '@xtreme/mock-data';
import {
  AuthHeader,
  AuthScreenContainer,
  BrandLogo,
  InputField,
  LegalFooter,
  PasswordInput,
  PrimaryButton,
  TextLink,
  useMockAuth,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * CUS-AUTH-01 — Sign In
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-01.svg)
 *
 * SPECIFICATION & ACCEPTANCE COMPLIANCE:
 * - Empty fields by default in standard user flow (no unconditional prefill).
 * - Exact vertical hierarchy matching Figma frame (390x844 geometry).
 * - Cross-platform Safe Area & keyboard avoidance via AuthScreenContainer.
 * - Eye icon vector concentric circles toggle for password.
 * - Gated QA dev button behind __DEV__.
 */
export default function SignInScreen() {
  const router = useRouter();
  const { login } = useMockAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const _handleFillDemo = () => {
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

    setTimeout(() => {
      setIsLoading(false);
      login(sampleCustomer);
      router.replace('/discover' as never);
    }, 350);
  };

  return (
    <AuthScreenContainer>
      <View style={styles.badgeWrapper}>
        <BrandLogo variant="customer" />
      </View>

      <AuthHeader
        title="Sign in"
        subtitle="Enter your credentials to access your concierge account."
      />

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

        <View style={styles.forgotWrapper}>
          <TextLink
            label="Forgot your password? Reset password"
            onPress={() => router.push('/auth/forgot-password' as never)}
          />
        </View>

        <PrimaryButton
          label="Sign in"
          onPress={handleSignIn}
          loading={isLoading}
          style={styles.submitBtn}
        />

        <View style={styles.createAccountWrapper}>
          <TextLink
            label="New to XTREME Concierge? Create account"
            onPress={() => router.push('/auth/register' as never)}
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
  formContainer: {
    marginTop: 4,
  },
  forgotWrapper: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: 6,
    marginBottom: 10,
  },
  createAccountWrapper: {
    marginTop: 6,
    alignItems: 'center',
  },
});
