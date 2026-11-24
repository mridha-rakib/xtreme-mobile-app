import { sampleConciergeRequests } from '@xtreme/mock-data';
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
import { StyleSheet, Text, View } from 'react-native';

/** CUS-CON-03 — Concierge Request Detail. Resilient parameter handling & chat transition. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; requestId?: string }>();
  const activeRequestId = params.requestId || params.id;

  const req = activeRequestId
    ? sampleConciergeRequests.find((r) => r.id === activeRequestId)
    : sampleConciergeRequests[0];

  if (!req) {
    return (
      <ScreenContainer>
        <Header
          eyebrow="CONCIERGE REQUEST"
          title="Concierge Request"
          onBack={() => router.back()}
        />
        <NotFoundCard
          resourceName="Concierge Request"
          resourceId={activeRequestId}
          onBack={() => router.replace('/concierge/requests' as never)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        eyebrow="CONCIERGE REQUEST"
        title={req.title}
        subtitle={`Ref: ${req.reference}`}
        onBack={() => router.back()}
      />
      <View style={styles.card}>
        <DetailRow label="Status" value={<StatusBadge status={req.status} />} />
        <DetailRow label="Request ID" value={req.id} />
        <DetailRow label="Target Date" value={req.startDate || 'Flexible'} />
        <DetailRow label="Guests" value={req.guestCount || 3} />
        <DetailRow label="Budget Standard" value={req.budgetNotes || 'Premium'} />
        <Text style={styles.detailsLabel}>Special Instructions:</Text>
        <Text style={styles.detailsText}>{req.details}</Text>
      </View>

      <Button
        label="Open Concierge Chat"
        onPress={() =>
          router.push(
            `/concierge/conversation-detail?conversationId=conv-demo-001&requestId=${req.id}` as never,
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
  detailsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.ink,
    marginTop: 12,
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    color: palette.muted,
    lineHeight: 20,
  },
  actionBtn: {
    marginTop: 8,
  },
});
