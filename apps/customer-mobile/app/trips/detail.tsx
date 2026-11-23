import { sampleTrips } from '@xtreme/mock-data';
import { DetailRow, Header, NotFoundCard, palette, ScreenContainer, StatusBadge } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/** CUS-TRIP-02 — Trip Detail / Itinerary. Resilient resource identity & schedule display. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; tripId?: string }>();
  const activeTripId = params.tripId || params.id;

  const trip = activeTripId ? sampleTrips.find((t) => t.id === activeTripId) : sampleTrips[0];

  if (!trip) {
    return (
      <ScreenContainer>
        <Header eyebrow="CUS-TRIP-02" title="Trip Detail" onBack={() => router.back()} />
        <NotFoundCard
          resourceName="Trip"
          resourceId={activeTripId}
          onBack={() => router.replace('/trips' as never)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-TRIP-02"
        title={trip.title}
        subtitle={`Ref: ${trip.reference}`}
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Trip Status" value={<StatusBadge status={trip.status} />} />
        <DetailRow label="Destination" value={trip.destination} />
        <DetailRow label="Duration" value={`${trip.startDate} to ${trip.endDate}`} />
      </View>

      <Text style={styles.sectionHeading}>Daily Itinerary</Text>
      {trip.days.map((day) => (
        <View key={day.dayNumber} style={styles.dayCard}>
          <Text style={styles.dayTitle}>
            Day {day.dayNumber} — {day.title}
          </Text>
          <Text style={styles.dayDate}>{day.date}</Text>
          {day.stops.map((stop) => (
            <View key={stop.id} style={styles.stopRow}>
              <Text style={styles.stopTime}>{stop.time}</Text>
              <View style={styles.stopContent}>
                <Text style={styles.stopTitle}>{stop.title}</Text>
                <Text style={styles.stopLoc}>{stop.location}</Text>
                <Text style={styles.stopDesc}>{stop.description}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
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
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.ink,
    marginBottom: 12,
  },
  dayCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.ink,
  },
  dayDate: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 12,
  },
  stopRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE1',
  },
  stopTime: {
    width: 60,
    fontSize: 13,
    fontWeight: '600',
    color: palette.ink,
  },
  stopContent: {
    flex: 1,
  },
  stopTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.ink,
  },
  stopLoc: {
    fontSize: 12,
    color: palette.accent,
    marginVertical: 2,
  },
  stopDesc: {
    fontSize: 13,
    color: palette.muted,
  },
});
