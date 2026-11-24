import { sampleBookings } from '@xtreme/mock-data';
import {
  Button,
  DetailRow,
  Header,
  NotFoundCard,
  palette,
  ScreenContainer,
  StatusBadge,
} from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/** CUS-BKG-06 — Booking Detail. Preserves bookingId, resilient error handling, separate state display. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; bookingId?: string }>();
  const activeBookingId = params.bookingId || params.id;

  const booking = activeBookingId
    ? sampleBookings.find((b) => b.id === activeBookingId)
    : sampleBookings[0];

  if (!booking) {
    return (
      <ScreenContainer>
        <Header eyebrow="BOOKING DETAIL" title="Booking Detail" onBack={() => router.back()} />
        <NotFoundCard
          resourceName="Booking"
          resourceId={activeBookingId}
          onBack={() => router.replace('/bookings' as never)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        eyebrow="BOOKING DETAIL"
        title={booking.serviceName}
        subtitle={`Ref: ${booking.reference}`}
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Operational State" value={<StatusBadge status={booking.status} />} />
        <DetailRow
          label="Payment Transaction"
          value={<StatusBadge status={booking.paymentStatus} />}
        />
        <DetailRow label="Booking ID" value={booking.id} />
        <DetailRow label="Date & Time" value={`${booking.date} at ${booking.time || '14:30'}`} />
        <DetailRow label="Pickup Point" value={booking.pickupLocation} />
        {booking.dropoffLocation ? (
          <DetailRow label="Dropoff Point" value={booking.dropoffLocation} />
        ) : null}
        <DetailRow label="Passengers" value={booking.passengers} />
        <DetailRow
          label="Total Amount"
          value={`${booking.amount.toLocaleString()} ${booking.currency}`}
        />
        <DetailRow label="Payment Gateway" value="Stripe (Credit/Debit Card)" />
      </View>

      <Button
        label="Request Modification"
        variant="outline"
        onPress={() => router.push(`/bookings/request-change?bookingId=${booking.id}` as never)}
        style={styles.btn}
      />
      <Button
        label="Request Cancellation"
        variant="danger"
        onPress={() => router.push(`/bookings/request-cancel?bookingId=${booking.id}` as never)}
        style={styles.btn}
      />
      <Button
        label="View Payment Receipt"
        variant="secondary"
        onPress={() => router.push(`/payments/status?bookingId=${booking.id}` as never)}
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
    marginBottom: 20,
  },
  btn: {
    marginBottom: 10,
  },
});
