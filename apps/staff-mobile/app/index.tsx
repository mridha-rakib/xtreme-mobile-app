import { staffScreens } from '@xtreme/navigation';
import { palette, ScreenCard } from '@xtreme/ui';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

/** Foundation only: route preview, NOT a reproduction of Figma screens. */
export default function Home() {
  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 56 }}
    >
      <Text style={styles.title}>XTREME Staff App</Text>
      <Text style={styles.description}>
        Frontend-only screen routing preview. All records are fictional demo data.
      </Text>
      {staffScreens.map((screen) => (
        <Link key={screen.id} href={screen.path as never} asChild>
          <Pressable>
            <ScreenCard title={screen.title} subtitle={screen.id} />
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 25, fontWeight: '700', color: palette.ink, marginBottom: 8 },
  description: { color: palette.muted, marginBottom: 24 },
});
