import { sampleBookings } from '@xtreme/mock-data';
import { Button, DetailRow, Header, palette, ScreenContainer, TextField } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/** CUS-CHG-01 — Request Booking Modification. Preserves target booking identity. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const bookingId = params.bookingId || 'bkg-demo-001';
  const booking = sampleBookings.find((b) => b.id === bookingId) || sampleBookings[0];

  const [requestedDate, setRequestedDate] = useState(booking.date);
  const [reason, setReason] = useState('Schedule change / flight reschedule');

  return (
    <ScreenContainer>
      <Header
        eyebrow="MODIFICATION REQUEST"
        title="Modify Booking"
        subtitle={`Booking: ${booking.reference}`}
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Service" value={booking.serviceName} />
        <DetailRow label="Current Date" value={booking.date} />
        <DetailRow label="Status" value={booking.status} />
      </View>

      <TextField
        label="Requested New Date"
        value={requestedDate}
        onChangeText={setRequestedDate}
        placeholder="YYYY-MM-DD"
      />
      <TextField
        label="Reason for Modification"
        value={reason}
        onChangeText={setReason}
        placeholder="Provide reason for request"
      />

      <Button
        label="Submit Modification Request (Demo)"
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
    marginBottom: 20,
  },
  actionBtn: {
    marginTop: 12,
  },
});
