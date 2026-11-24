import { sampleBookings } from '@xtreme/mock-data';
import { Button, DetailRow, Header, palette, ScreenContainer } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/** CUS-CHG-02 — Request Booking Cancellation. Preserves booking context and policy disclaimer. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingId = params.bookingId || 'bkg-demo-001';
  const booking = sampleBookings.find((b) => b.id === bookingId) || sampleBookings[0];

  return (
    <ScreenContainer>
      <Header
        eyebrow="CANCELLATION REQUEST"
        title="Cancel Booking"
        subtitle={`Booking: ${booking.reference}`}
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Service" value={booking.serviceName} />
        <DetailRow label="Date" value={booking.date} />
        <DetailRow
          label="Paid Amount"
          value={`${booking.amount.toLocaleString()} ${booking.currency}`}
        />
      </View>

      <Text style={styles.policy}>
        Cancellation Policy: Free cancellation up to 24 hours before pickup. Full refund will be
        credited to original payment method.
      </Text>

      <Button
        label="Confirm Cancellation Request (Demo)"
        variant="danger"
        onPress={() => router.back()}
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
    marginBottom: 16,
  },
  policy: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 8,
  },
});
