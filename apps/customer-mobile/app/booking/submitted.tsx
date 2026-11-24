import type { BookingMode } from '@xtreme/types';
import { Button, DetailRow, Header, palette, ScreenContainer, StatusBadge } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * CUS-BKG-04 — Booking Submitted / Reference.
 * Compliance: Final SRS v1.1 canonical state machine.
 * Correctly distinguishes Instant Booking (CONFIRMED) vs Request to Book (PENDING_VENDOR).
 * Does NOT assume every booking requires a vendor decision.
 */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    bookingId?: string;
    reference?: string;
    paymentStatus?: string;
    bookingMode?: BookingMode;
  }>();
  const bookingId = params.bookingId || 'bkg-demo-001';
  const reference = params.reference || 'XT-DKR-2026-081';
  const paymentStatus = params.paymentStatus || 'SUCCEEDED';
  const bookingMode: BookingMode = params.bookingMode || 'INSTANT';

  // Determine operational state based on canonical booking mode
  const operationalState =
    bookingMode === 'INSTANT'
      ? 'CONFIRMED'
      : bookingMode === 'REQUEST_TO_BOOK'
        ? 'PENDING_VENDOR'
        : 'IN_REVIEW';

  return (
    <ScreenContainer>
      <Header
        eyebrow="BOOKING CONFIRMATION"
        title="Booking Submitted"
        subtitle={`Reference: ${reference}`}
      />

      <View style={styles.card}>
        <DetailRow label="Payment Status" value={<StatusBadge status={paymentStatus} />} />
        <DetailRow
          label="Booking Operational State"
          value={<StatusBadge status={operationalState} />}
        />
        <DetailRow label="Booking Reference" value={reference} />
        <DetailRow label="Booking Mode" value={bookingMode} />
        <DetailRow label="Service" value="Blaise Diagne VIP Fast-Track & Chauffeur" />
        <DetailRow label="Scheduled Date" value="2026-12-05 at 14:30" />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoHeading}>
          {bookingMode === 'INSTANT'
            ? 'Instant Confirmation Notice'
            : bookingMode === 'REQUEST_TO_BOOK'
              ? 'Vendor Allocation Notice'
              : 'Concierge Review Notice'}
        </Text>
        <Text style={styles.infoBody}>
          {bookingMode === 'INSTANT'
            ? 'Your payment transaction of 95,000 XOF has succeeded. Because this service operates with Instant Booking, your reservation is CONFIRMED immediately without requiring a manual vendor decision.'
            : bookingMode === 'REQUEST_TO_BOOK'
              ? 'Your payment authorization has succeeded. This experience requires partner confirmation and is now in PENDING_VENDOR review while fleet dispatch is finalized.'
              : 'Your bespoke concierge request has been submitted and is currently in review with our operations desk.'}
        </Text>
      </View>

      <Button
        label="View Booking Details"
        onPress={() => router.replace(`/bookings/detail?bookingId=${bookingId}` as never)}
        style={styles.btn}
      />

      <Button
        label="Explore More Services"
        variant="outline"
        onPress={() => router.replace('/discover' as never)}
        style={styles.btn}
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
  infoBox: {
    padding: 16,
    backgroundColor: '#F5F2EB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: 20,
  },
  infoHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.ink,
    marginBottom: 4,
  },
  infoBody: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
  },
  btn: {
    marginBottom: 10,
  },
});
