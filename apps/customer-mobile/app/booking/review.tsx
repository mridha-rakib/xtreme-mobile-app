import { Button, DetailRow, Header, palette, ScreenContainer } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/** CUS-BKG-03 — Booking Review. Preserves serviceId and booking configuration. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    serviceId?: string;
    date?: string;
    time?: string;
  }>();
  const serviceId = params.serviceId || 'svc-airport-fasttrack';
  const date = params.date || '2026-12-05';

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-BKG-03"
        title="Booking Review"
        subtitle="Verify all reservation details"
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Service ID" value={serviceId} />
        <DetailRow label="Date" value={date} />
        <DetailRow label="Pickup" value="Blaise Diagne Airport (DSS)" />
        <DetailRow label="Estimated Total" value="95,000 XOF" />
      </View>

      <Button
        label="Proceed to Payment Choice"
        onPress={() => router.push(`/payments/choice?serviceId=${serviceId}&date=${date}` as never)}
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
