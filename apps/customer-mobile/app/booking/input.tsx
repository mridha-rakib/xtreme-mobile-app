import { sampleServices } from '@xtreme/mock-data';
import { Button, DetailRow, Header, palette, ScreenContainer, TextField } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/** CUS-BKG-01 — Dynamic Booking Input. Preserves serviceId from catalog. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ serviceId?: string }>();
  const activeServiceId = params.serviceId || 'svc-airport-fasttrack';
  const service = sampleServices.find((s) => s.id === activeServiceId) || sampleServices[0];

  const [pickup, setPickup] = useState('Blaise Diagne Airport (DSS)');
  const [passengers, setPassengers] = useState('2');

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-BKG-01"
        title="Booking Input"
        subtitle={`Service: ${service.name}`}
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Selected Service ID" value={activeServiceId} />
        <DetailRow label="Booking Mode" value={service.bookingMode} />
      </View>

      <TextField
        label="Pickup Location"
        value={pickup}
        onChangeText={setPickup}
        placeholder="Enter pickup address in Senegal"
      />
      <TextField
        label="Passengers"
        value={passengers}
        onChangeText={setPassengers}
        keyboardType="numeric"
      />

      <Button
        label="Select Availability"
        onPress={() => router.push(`/booking/availability?serviceId=${service.id}` as never)}
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
