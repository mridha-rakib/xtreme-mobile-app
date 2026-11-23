import { Button, DetailRow, Header, palette, ScreenContainer } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * CUS-PAY-01 — Payment Choice.
 * Compliance: Final SRS v1.1 — Exclusively approved Stripe card payment model.
 * Zero unsupported payment gateways (no Orange Money, Wave, or Wire Transfer).
 */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    serviceId?: string;
    bookingId?: string;
  }>();
  const bookingId = params.bookingId || 'bkg-demo-001';

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-PAY-01"
        title="Payment Method"
        subtitle="Approved Mobile MVP Stripe Payment Model"
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Target Booking ID" value={bookingId} />
        <DetailRow label="Amount Due" value="95,000 XOF" />
        <DetailRow label="Approved Gateway" value="Stripe (Mobile Elements)" />
      </View>

      <Text style={styles.sectionTitle}>Select Payment Option</Text>

      <View style={styles.optionCard}>
        <Text style={styles.optionHeading}>Credit or Debit Card</Text>
        <Text style={styles.optionSub}>
          Visa, Mastercard, American Express via Stripe PaymentSheet
        </Text>
      </View>

      <Button
        label="Proceed with Stripe Payment"
        onPress={() =>
          router.push(
            `/payments/checkout-preview?bookingId=${bookingId}&method=STRIPE_CARD` as never,
          )
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.ink,
    marginBottom: 12,
  },
  optionCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: palette.accent,
    marginBottom: 20,
  },
  optionHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.ink,
  },
  optionSub: {
    fontSize: 13,
    color: palette.muted,
    marginTop: 4,
  },
  actionBtn: {
    marginTop: 8,
  },
});
