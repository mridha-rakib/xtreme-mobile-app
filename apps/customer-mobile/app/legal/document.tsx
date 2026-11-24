import { Header, palette } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

/** CUS-LEG-01 — Legal Document Viewer. Placeholder until exact Figma layer/assets are available. */
export default function Screen() {
  const router = useRouter();
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/support' as never);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header
        eyebrow="LEGAL"
        title="Legal Document Viewer"
        subtitle="Terms of service, privacy policy and disclaimers"
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
