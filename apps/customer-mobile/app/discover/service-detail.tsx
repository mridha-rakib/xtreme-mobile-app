import { sampleServices } from '@xtreme/mock-data';
import { Button, DetailRow, Header, NotFoundCard, palette, ScreenContainer } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/** CUS-DISC-03 — Service Detail. Resilient resource identity & missing parameter handling. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ serviceId?: string; id?: string }>();
  const activeServiceId = params.serviceId || params.id;

  const service = activeServiceId
    ? sampleServices.find((s) => s.id === activeServiceId)
    : sampleServices[0];

  if (!service) {
    return (
      <ScreenContainer>
        <Header eyebrow="CUS-DISC-03" title="Service Detail" onBack={() => router.back()} />
        <NotFoundCard
          resourceName="Service"
          resourceId={activeServiceId}
          onBack={() => router.replace('/discover/services' as never)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-DISC-03"
        title={service.name}
        subtitle={`Resource ID: ${service.id}`}
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <Text style={styles.tagline}>{service.tagline}</Text>
        <Text style={styles.desc}>{service.description}</Text>
        <DetailRow label="Destination" value={service.destination} />
        <DetailRow
          label="Price"
          value={
            service.displayPrice
              ? `${service.displayPrice.toLocaleString()} ${service.currency}`
              : 'Concierge Quote'
          }
        />
        <DetailRow label="Booking Mode" value={service.bookingMode} />
        {service.vehicleModel ? <DetailRow label="Vehicle" value={service.vehicleModel} /> : null}
      </View>

      <Button
        label="Proceed to Booking Input"
        onPress={() => router.push(`/booking/input?serviceId=${service.id}` as never)}
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
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.ink,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: palette.muted,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionBtn: {
    marginTop: 8,
  },
});
