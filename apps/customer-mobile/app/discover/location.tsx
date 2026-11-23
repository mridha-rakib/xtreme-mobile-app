import { palette } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

/** CUS-DISC-04 — Geography Selector. Placeholder until exact Figma layer/assets are available. */
export default function Screen() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>CUS-DISC-04</Text>
      <Text style={styles.title}>Geography Selector</Text>
      <Text style={styles.note}>
        Frontend preview route only. No API calls, payments, or user data.
      </Text>
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.button}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: palette.background, padding: 24, gap: 16 },
  eyebrow: { fontSize: 13, color: palette.muted },
  title: { fontSize: 29, fontWeight: '700', color: palette.ink },
  note: { fontSize: 15, color: palette.muted, lineHeight: 24 },
  button: { padding: 16, backgroundColor: palette.ink, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
