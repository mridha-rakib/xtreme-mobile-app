import { sampleStaffUser } from '@xtreme/mock-data';
import {
  AuthHeader,
  AuthScreenContainer,
  BrandLogo,
  InputField,
  LegalFooter,
  OperationalNoticeBox,
  PasswordInput,
  PrimaryButton,
  useMockAuth,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * STF-AUTH-01 — Staff Sign In
 * Operations & Chauffeur authentication portal.
 * Matched to approved Figma node 71:2 (STF-AUTH-01__Sign_In__Ready)
 */
export default function StaffSignInScreen() {
  const router = useRouter();
  const { login } = useMockAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    let hasError = false;
    if (!identifier.trim()) {
      setIdentifierError('Staff email or operational ID is required');
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
      login(sampleStaffUser);
      router.replace('/assignments' as never);
    }, 350);
  };

  return (
    <AuthScreenContainer brand="XTREME STAFF">
      <View style={styles.badgeWrapper}>
        <BrandLogo variant="staff" />
      </View>

      <AuthHeader
        eyebrow="OPERATIONAL ACCESS"
        title="Sign In"
        subtitle="Operational authentication for drivers, concierge staff, and system administrators."
      />

      <View style={styles.formContainer}>
        <InputField
          label="Identifier"
          placeholder="Staff email or operational ID"
          value={identifier}
          onChangeText={(text) => {
            setIdentifier(text);
            if (identifierError) setIdentifierError(undefined);
          }}
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

        <OperationalNoticeBox message="Operational access only. Customer registration is not available in the Staff App." />
      </View>

      <LegalFooter
        onPrivacyPress={() => router.push('/assignments' as never)}
        onTermsPress={() => router.push('/assignments' as never)}
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
    marginTop: 10,
    marginBottom: 6,
  },
});
