import {
  AuthHeader,
  AuthScreenContainer,
  ContextBanner,
  LegalFooter,
  PasswordInput,
  PrimaryButton,
  TextLink,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * CUS-AUTH-08 — Email Reset Confirmation (Set New Password)
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-08.svg)
 *
 * SPECIFICATION & SECURITY COMPLIANCE:
 * - Secure context card indicating reset token is handled safely in background.
 * - Password input with visibility toggle enforcing minimum 8 characters.
 * - Simulated reset completion transitions to sign-in.
 * - Note: No BrandLogo badge in Figma frame; ContextBanner provides top context.
 */
export default function ResetEmailConfirmScreen() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const _handleFillDemo = () => {
    setNewPassword('secureNewPass2026');
    setError(undefined);
  };

  const handleResetPassword = () => {
    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError(undefined);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Simulated password update; transition to sign-in
      router.replace('/auth/sign-in' as never);
    }, 400);
  };

  return (
    <AuthScreenContainer>
      <AuthHeader
        title="Set a new password"
        subtitle="Enter your new password to complete the recovery process."
      />

      {/* Secure context card matching Figma CUS-AUTH-08 */}
      <ContextBanner
        title="Secure reset context"
        description="The reset token is handled securely and is not displayed."
        style={styles.bannerSpacing}
      />

      <View style={styles.formContainer}>
        <PasswordInput
          label="New password"
          placeholder="Minimum 8 characters"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (error) setError(undefined);
          }}
          error={error}
        />

        <PrimaryButton
          label="Reset password"
          onPress={handleResetPassword}
          loading={isLoading}
          style={styles.submitBtn}
        />

        <View style={styles.linksContainer}>
          <TextLink
            label="Already reset your password? Return to sign in"
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
  bannerSpacing: {
    marginTop: 14,
    marginBottom: 8,
  },
  formContainer: {
    marginTop: 6,
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 8,
  },
  linksContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
});
