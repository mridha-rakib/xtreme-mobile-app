import { DEFAULT_OTP_CONFIG } from '@xtreme/types';
import {
  AuthHeader,
  AuthScreenContainer,
  InputField,
  LegalFooter,
  PasswordInput,
  PrimaryButton,
  TextLink,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const E164_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

/**
 * CUS-AUTH-06 — Phone Reset Confirmation
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-06.svg)
 *
 * SPECIFICATION & SECURITY COMPLIANCE:
 * - Allows user to set a new password after receiving SMS OTP.
 * - OTP code is empty by default; adheres to DEFAULT_OTP_CONFIG bounds.
 * - Minimum 8-character password validation.
 * - Transitions back to sign-in upon simulated password reset.
 * - Note: No BrandLogo badge in Figma frame for compact form layout.
 */
export default function ResetPhoneConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();

  const [phone, setPhone] = useState(params.phone || '');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    if (!phone) setPhone('+221 77 123 4567');
    setOtpCode('123456');
    setNewPassword('newPassword2026');
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!E164_PHONE_REGEX.test(cleanPhone)) {
      newErrors.phone = 'Enter a valid E.164 phone number';
    }

    if (!otpCode.trim()) {
      newErrors.otp = 'Verification code is required';
    } else if (
      otpCode.length < DEFAULT_OTP_CONFIG.minLength ||
      otpCode.length > DEFAULT_OTP_CONFIG.maxLength
    ) {
      newErrors.otp = `Verification code must be ${DEFAULT_OTP_CONFIG.minLength}-${DEFAULT_OTP_CONFIG.maxLength} digits`;
    }

    if (!newPassword) {
      newErrors.password = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = () => {
    if (!validate()) return;

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
        title="Confirm Phone Reset"
        subtitle="Set a new password after OTP verification"
      />

      <View style={styles.formContainer}>
        <InputField
          label="Phone"
          placeholder="Registered mobile number"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
          }}
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <InputField
          label="OTP code"
          placeholder="Verification code"
          value={otpCode}
          onChangeText={(text) => {
            setOtpCode(text);
            if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }));
          }}
          keyboardType="numeric"
          error={errors.otp}
        />

        <PasswordInput
          label="New password"
          placeholder="Minimum 8 characters"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={errors.password}
        />

        <PrimaryButton
          label="Reset password"
          onPress={handleResetPassword}
          loading={isLoading}
          style={styles.submitBtn}
        />

        <View style={styles.linksContainer}>
          <TextLink label="Back / retry request" onPress={() => router.back()} />
        </View>

        {/* Development autofill gated behind __DEV__ */}
        {__DEV__ ? (
          <View style={styles.devContainer}>
            <Pressable
              accessibilityRole="button"
              onPress={handleFillDemo}
              style={({ pressed }) => [styles.devButton, pressed && styles.devButtonPressed]}
            >
              <Text style={styles.devButtonText}>Dev: Fill Test Reset</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <LegalFooter
        onPrivacyPress={() => router.push('/legal/document' as never)}
        onTermsPress={() => router.push('/legal/document' as never)}
      />
    </AuthScreenContainer>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 12,
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
