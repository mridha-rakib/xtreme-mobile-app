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
import { ScrollView, StyleSheet, View } from 'react-native';

/**
 * CUS-AUTH-01 — Sign In
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-01.svg)
 */
export default function SignInScreen() {
  const router = useRouter();
  const { login } = useMockAuth();

  const [identifier, setIdentifier] = useState('+221 77 123 4567');
  const [password, setPassword] = useState('demo-concierge');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    if (!identifier.trim()) {
      setError('Please enter your registered email or mobile number');
      return;
    }
    setError(undefined);
    setIsLoading(true);

    // Mock authentication transition without live network calls
    setTimeout(() => {
      setIsLoading(false);
      login(sampleCustomer);
      router.replace('/discover' as never);
    }, 400);
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
              if (error) setError(undefined);
            }}
            keyboardType="default"
            autoCapitalize="none"
            error={error}
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
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
});
