import { sampleStaffUser } from '@xtreme/mock-data';
import {
  AuthHeader,
  AuthScreenContainer,
  BrandLogo,
  InputField,
  LegalFooter,
  PrimaryButton,
  useMockAuth,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * STF-AUTH-01 — Staff Sign In
 * Operations & Chauffeur authentication portal.
 *
 * SPECIFICATION & ACCEPTANCE COMPLIANCE:
 * - Empty fields by default (no unconditional prefill).
 * - Gated QA dev button behind __DEV__.
 * - Session-aware login transition setting staff state.
 */
export default function StaffSignInScreen() {
  const router = useRouter();
  const { login } = useMockAuth();

  const [driverId, setDriverId] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setDriverId('STF-DRV-001');
    setError(undefined);
  };

  const handleSignIn = () => {
    if (!driverId.trim()) {
      setError('Staff or Chauffeur ID is required');
      return;
    }

    setError(undefined);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(sampleStaffUser);
      router.replace('/assignments' as never);
    }, 350);
  };

  return (
    <AuthScreenContainer brand="XTREME STAFF">
      <AuthHeader title="Staff Portal" subtitle="Driver & Operations Sign In" />

      <View style={styles.badgeWrapper}>
        <BrandLogo variant="staff" />
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Staff / Chauffeur ID"
          placeholder="e.g. STF-DRV-001"
          value={driverId}
          onChangeText={(text) => {
            setDriverId(text);
            if (error) setError(undefined);
          }}
          autoCapitalize="characters"
          error={error}
        />

        <PrimaryButton
          label="Sign In as Staff"
          onPress={handleSignIn}
          loading={isLoading}
          variant="atlantic"
          style={styles.submitBtn}
        />

        {/* Development autofill gated behind __DEV__ */}
        {__DEV__ ? (
          <View style={styles.devContainer}>
            <Pressable
              accessibilityRole="button"
              onPress={handleFillDemo}
              style={({ pressed }) => [styles.devButton, pressed && styles.devButtonPressed]}
            >
              <Text style={styles.devButtonText}>Dev: Fill Staff ID (STF-DRV-001)</Text>
            </Pressable>
          </View>
        ) : null}
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
  devContainer: {
    marginTop: 14,
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
