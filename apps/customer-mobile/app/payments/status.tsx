import { Button, DetailRow, Header, palette, ScreenContainer, StatusBadge } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * CUS-PAY-03 — Payment Detail / Status.
 * Compliance: Confirms payment transaction outcome while maintaining independent booking lifecycle state.
 */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookingId?: string;
    status?: string;
  }>();
  const bookingId = params.bookingId || 'bkg-demo-001';
  const paymentStatus = params.status || 'SUCCEEDED';

  return (
    <ScreenContainer>
      <Header
        eyebrow="PAYMENT STATUS"
        title="Payment Receipt"
        subtitle="Stripe Transaction Status"
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Transaction State" value={<StatusBadge status={paymentStatus} />} />
        <DetailRow label="Linked Booking ID" value={bookingId} />
        <DetailRow label="Gateway Provider" value="Stripe Payments (Simulated)" />
        <DetailRow label="Card Info" value="Visa •••• 4242" />
        <DetailRow label="Amount Charged" value="95,000 XOF" />
        <DetailRow label="Charge Reference" value="ch_demo_stripe_9901" />
      </View>

      <Text style={styles.stateNotice}>
        NOTICE: Payment authorization confirms transaction settlement only. Booking operational
        dispatch is tracked independently in your bookings dashboard.
      </Text>

      <Button
        label="Return to Booking Detail"
        onPress={() => router.replace(`/bookings/detail?bookingId=${bookingId}` as never)}
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
  stateNotice: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 8,
  },
});
