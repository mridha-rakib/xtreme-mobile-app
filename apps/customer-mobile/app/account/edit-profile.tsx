import { getCustomerProfile, updateCustomerProfile } from '@xtreme/mock-data';
import { CustomerBottomNav } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../../assets/logo.png');

/**
 * CUS-PRO-02: Edit Profile Screen
 * Authoritative Figma Frame: 36:135 (CUS-PRO-02__Edit_Profile__Ready)
 */
export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const initial = getCustomerProfile();

  const [firstName, setFirstName] = useState(initial.firstName || '');
  const [lastName, setLastName] = useState(initial.lastName || '');
  const [email, setEmail] = useState(initial.email || '');
  const [phone] = useState(initial.phone || '+221 77 123 45 67');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'fr'>(
    initial.preferredLanguage === 'fr' ? 'fr' : 'en',
  );
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/account/profile' as never);
    }
  };

  const handleSave = () => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst || !trimmedLast) {
      setErrorText('Please enter your first and last name.');
      return;
    }

    if (!trimmedEmail?.includes('@') || !trimmedEmail.includes('.')) {
      setErrorText('Please enter a valid email address.');
      return;
    }

    setErrorText(null);

    // Save changes to shared store
    updateCustomerProfile({
      firstName: trimmedFirst,
      lastName: trimmedLast,
      email: trimmedEmail,
      preferredLanguage,
    });

    handleBack();
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 90 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header Row */}
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 19L8 12L15 5"
                  stroke="#164D53"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
            <View style={styles.logoWrap}>
              <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Title Row */}
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Edit Profile</Text>
          </View>

          {/* Inline Error Message */}
          {errorText ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorText}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Field: First Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={(t) => {
                  setFirstName(t);
                  if (errorText) setErrorText(null);
                }}
                placeholder="Enter first name"
                placeholderTextColor="#A0A4AC"
                autoCapitalize="words"
              />
            </View>

            {/* Field: Last Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={lastName}
                onChangeText={(t) => {
                  setLastName(t);
                  if (errorText) setErrorText(null);
                }}
                placeholder="Enter last name"
                placeholderTextColor="#A0A4AC"
                autoCapitalize="words"
              />
            </View>

            {/* Field: Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errorText) setErrorText(null);
                }}
                placeholder="Enter email address"
                placeholderTextColor="#A0A4AC"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Field: Phone (Read-only verified) */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <Text style={styles.verifiedTag}>Verified</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={phone}
                editable={false}
              />
            </View>

            {/* Field: Preferred Language */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Preferred Language</Text>
              <View style={styles.languageToggleRow}>
                <Pressable
                  style={[
                    styles.langOption,
                    preferredLanguage === 'en' && styles.langOptionSelected,
                  ]}
                  onPress={() => setPreferredLanguage('en')}
                  accessibilityRole="button"
                  accessibilityLabel="English"
                  accessibilityState={{ selected: preferredLanguage === 'en' }}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      preferredLanguage === 'en' && styles.langOptionTextSelected,
                    ]}
                  >
                    English (EN)
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.langOption,
                    preferredLanguage === 'fr' && styles.langOptionSelected,
                  ]}
                  onPress={() => setPreferredLanguage('fr')}
                  accessibilityRole="button"
                  accessibilityLabel="Français"
                  accessibilityState={{ selected: preferredLanguage === 'fr' }}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      preferredLanguage === 'fr' && styles.langOptionTextSelected,
                    ]}
                  >
                    Français (FR)
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Action CTA Buttons */}
          <View style={styles.actionsContainer}>
            {/* Primary Save Button */}
            <Pressable
              style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Save Changes"
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>

            {/* Secondary Cancel Link */}
            <Pressable
              style={styles.cancelBtn}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Customer Bottom Navigation Bar */}
      <CustomerBottomNav
        activeTab="Profile"
        bottomInset={insets.bottom}
        onTabPress={(tab) => {
          if (tab === 'Home') router.push('/discover' as never);
          else if (tab === 'Bookings') router.push('/bookings' as never);
          else if (tab === 'Trips') router.push('/trips' as never);
          else if (tab === 'Concierge') router.push('/concierge/requests' as never);
          else if (tab === 'Profile') router.push('/account/profile' as never);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  brandLogo: {
    width: 140,
    height: 28,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    opacity: 0.72,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
  },
  titleRow: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.3,
  },
  errorBanner: {
    marginHorizontal: 20,
    backgroundColor: '#FDE8E8',
    borderWidth: 1,
    borderColor: '#F8B4B4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9B1C1C',
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  verifiedTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#164D53',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0B0C0E',
  },
  disabledInput: {
    backgroundColor: '#F7F6F2',
    color: '#5B616B',
  },
  languageToggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  langOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langOptionSelected: {
    backgroundColor: '#F6EFE3',
    borderColor: '#C6A15B',
    borderWidth: 1.5,
  },
  langOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5B616B',
  },
  langOptionTextSelected: {
    fontWeight: '700',
    color: '#164D53',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  saveBtn: {
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnPressed: {
    opacity: 0.88,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  cancelBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B616B',
  },
});
