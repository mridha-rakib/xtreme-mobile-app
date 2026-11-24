import { Button, DetailRow, Header, palette, ScreenContainer } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/** CUS-BKG-02 — Availability Selection. Preserves serviceId. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ serviceId?: string }>();
  const serviceId = params.serviceId || 'svc-airport-fasttrack';

  return (
    <ScreenContainer>
      <Header
        eyebrow="RESERVATION"
        title="Availability Selection"
        subtitle={`Service ID: ${serviceId}`}
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Selected Date" value="2026-12-05" />
        <DetailRow label="Available Slot" value="14:30 GMT" />
        <DetailRow label="Chauffeur Status" value="Available (Moussa Camara)" />
      </View>

      <Button
        label="Review Booking"
        onPress={() =>
          router.push(`/booking/review?serviceId=${serviceId}&date=2026-12-05&time=14:30` as never)
        }
        style={styles.actionBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 12,
  },
});
