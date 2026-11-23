import {
  AuthHeader,
  AuthScreenContainer,
  InputField,
  LegalFooter,
  PasswordInput,
  PrimaryButton,
  TextLink,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const APPROVED_LANGUAGES = [
  { label: 'English', code: 'en' as const },
  { label: 'Français', code: 'fr' as const },
];

const E164_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * CUS-AUTH-02 — Create Account
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-02.svg)
 *
 * SPECIFICATION & ACCEPTANCE COMPLIANCE:
 * - Direct transition from header into fields (no badge per Figma spec).
 * - Language selection limited strictly to English and French.
 * - Cross-platform Safe Area & keyboard avoidance.
 * - Gated QA dev button behind __DEV__.
 */
export default function RegisterScreen() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [languageIndex, setLanguageIndex] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const cycleLanguage = () => {
    setLanguageIndex((prev) => (prev + 1) % APPROVED_LANGUAGES.length);
  };

  const handleFillDemo = () => {
    setPhone('+221 77 123 4567');
    setEmail('amadou.diallo@example.sn');
    setPassword('concierge2026');
    setFirstName('Amadou');
    setLastName('Diallo');
    setLanguageIndex(0);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Mobile phone number is required';
    } else if (!E164_PHONE_REGEX.test(cleanPhone)) {
      newErrors.phone = 'Enter a valid E.164 format number (e.g. +221771234567)';
    }

    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/auth/verify-phone',
        params: { phone: phone.trim() },
      } as never);
    }, 350);
  };

  return (
    <AuthScreenContainer>
      <AuthHeader title="Create Account" subtitle="Customer registration" />

      <View style={styles.formContainer}>
        <InputField
          label="Phone"
          placeholder="E.164 mobile number"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
          }}
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <InputField
          label="Email (optional)"
          placeholder="Email address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          placeholder="Minimum 8 characters"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={errors.password}
        />

        <InputField
          label="First name"
          placeholder="First name"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
          }}
          autoCapitalize="words"
          error={errors.firstName}
        />

        <InputField
          label="Last name"
          placeholder="Last name"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
          }}
          autoCapitalize="words"
          error={errors.lastName}
        />

        <View style={styles.languageGroup}>
          <Text style={styles.languageLabel}>Preferred language</Text>
          <Pressable
            accessibilityRole="button"
            onPress={cycleLanguage}
            style={styles.languageSelector}
          >
            <Text style={styles.languageValue}>{APPROVED_LANGUAGES[languageIndex].label}</Text>
            <Text style={styles.languageChevron}>⌄</Text>
          </Pressable>
        </View>

        <PrimaryButton
          label="Create account"
          onPress={handleRegister}
          loading={isLoading}
          style={styles.submitBtn}
        />

        <View style={styles.linksContainer}>
          <TextLink
            label="Return to sign in"
            onPress={() => router.push('/auth/sign-in' as never)}
          />
        </View>

        {__DEV__ ? (
          <View style={styles.devContainer}>
            <Pressable
              accessibilityRole="button"
              onPress={handleFillDemo}
              style={({ pressed }) => [styles.devButton, pressed && styles.devButtonPressed]}
            >
              <Text style={styles.devButtonText}>Dev: Fill Test Registration</Text>
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
    marginTop: 6,
  },
  languageGroup: {
    marginBottom: 14,
  },
  languageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    marginBottom: 6,
  },
  languageSelector: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageValue: {
    fontSize: 14,
    color: '#0B0C0E',
    fontWeight: '500',
  },
  languageChevron: {
    fontSize: 18,
    color: '#5B616B',
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 14,
    marginBottom: 12,
  },
  linksContainer: {
    alignItems: 'center',
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
