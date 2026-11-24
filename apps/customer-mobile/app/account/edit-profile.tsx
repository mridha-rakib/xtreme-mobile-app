import { Header, palette } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

/** CUS-PRO-02 — Edit Profile. Placeholder until exact Figma layer/assets are available. */
export default function Screen() {
  const router = useRouter();
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/account/profile' as never);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header
        eyebrow="PROFILE"
        title="Edit Profile"
        subtitle="Manage your personal information and preferences"
        onBack={handleBack}
      />
      <Text style={styles.note}>
        Frontend preview route only. No API calls, payments, or user data.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: palette.background, padding: 24, gap: 16 },
  note: { fontSize: 15, color: palette.muted, lineHeight: 24 },
});
