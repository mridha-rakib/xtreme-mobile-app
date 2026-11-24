import { Button, DetailRow, Header, palette, ScreenContainer } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * CUS-PAY-02 — Stripe Payment Action (Simulated PaymentSheet).
 * Compliance: Simulated client payment action. No real card charge or API key exposure.
 */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookingId?: string;
    method?: string;
  }>();
  const bookingId = params.bookingId || 'bkg-demo-001';

  return (
    <ScreenContainer>
      <Header
        eyebrow="CHECKOUT"
        title="Stripe Card Payment"
        subtitle="Simulated Stripe PaymentSheet"
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Target Booking ID" value={bookingId} />
        <DetailRow label="Processing Engine" value="Stripe Mobile SDK (Simulated)" />
        <DetailRow label="Currency" value="XOF" />
        <DetailRow label="Amount" value="95,000" />
        <DetailRow label="Card Number" value="•••• •••• •••• 4242 (Demo)" />
      </View>

      <Text style={styles.disclaimer}>
        SAFETY NOTICE: Simulated frontend payment action. No live Stripe API call or banking
        transaction occurs.
      </Text>

      <Button
        label="Authorize Payment & Submit"
        onPress={() =>
          router.replace(
            `/booking/submitted?bookingId=${bookingId}&reference=XT-DKR-2026-081&paymentStatus=SUCCEEDED&bookingMode=INSTANT` as never,
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
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 8,
  },
});
