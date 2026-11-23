import {
  AuthHeader,
  InputField,
  LegalFooter,
  PasswordInput,
  PrimaryButton,
  ScreenTopBar,
  TextLink,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const LANGUAGES = ['English', 'Français', 'Wolof'];

/**
 * CUS-AUTH-02 — Create Account
 * Visual fidelity matched to approved Figma frame (CUS-AUTH-02.svg)
 */
export default function RegisterScreen() {
  const router = useRouter();

  const [phone, setPhone] = useState('+221 77 123 4567');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [languageIndex, setLanguageIndex] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const cycleLanguage = () => {
    setLanguageIndex((prev) => (prev + 1) % LANGUAGES.length);
  };

  const handleRegister = () => {
    if (!phone.trim()) {
      setError('Please provide a mobile phone number');
      return;
    }
    setError(undefined);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Navigate to phone verification per approved user flow
      router.push({
        pathname: '/auth/verify-phone',
        params: { phone },
      } as never);
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
        <AuthHeader title="Create Account" subtitle="Customer registration" />

        <View style={styles.formContainer}>
          <InputField
            label="Phone"
            placeholder="E.164 mobile number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (error) setError(undefined);
            }}
            keyboardType="phone-pad"
            error={error}
          />

          <InputField
            label="Email (optional)"
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <PasswordInput
            label="Password"
            placeholder="Minimum 8 characters"
            value={password}
            onChangeText={setPassword}
          />

          <InputField
            label="First name"
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <InputField
            label="Last name"
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <View style={styles.languageGroup}>
            <Text style={styles.languageLabel}>Preferred language</Text>
            <Pressable
              accessibilityRole="button"
              onPress={cycleLanguage}
              style={styles.languageSelector}
            >
              <Text style={styles.languageValue}>{LANGUAGES[languageIndex]}</Text>
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
  },
  formContainer: {
    marginTop: 4,
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
    paddingHorizontal: 16,
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
    marginTop: 12,
    marginBottom: 8,
  },
  linksContainer: {
    marginTop: 6,
  },
});
