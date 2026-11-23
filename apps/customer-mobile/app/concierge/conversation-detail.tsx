import { sampleMessages } from '@xtreme/mock-data';
import { Header, palette, ScreenContainer } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/** CUS-CON-05 — Concierge Conversation Detail. Preserves conversationId and displays dialogue thread. */
export default function Screen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; conversationId?: string }>();
  const activeConvId = params.conversationId || params.id || 'conv-demo-001';

  return (
    <ScreenContainer>
      <Header
        eyebrow="CUS-CON-05"
        title="Concierge Dialogue"
        subtitle={`Conversation ID: ${activeConvId}`}
        onBack={() => router.back()}
      />

      <View style={styles.threadContainer}>
        {sampleMessages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.bubble, msg.isStaff ? styles.bubbleStaff : styles.bubbleUser]}
          >
            <Text style={styles.sender}>{msg.senderName}</Text>
            <Text style={[styles.content, msg.isStaff ? styles.contentStaff : styles.contentUser]}>
              {msg.content}
            </Text>
            <Text style={styles.time}>{msg.timestamp.slice(11, 16)} GMT</Text>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  threadContainer: {
    gap: 12,
  },
  bubble: {
    padding: 14,
    borderRadius: 14,
    maxWidth: '85%',
  },
  bubbleStaff: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.line,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: palette.ink,
  },
  sender: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.accent,
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  contentStaff: {
    color: palette.ink,
  },
  contentUser: {
    color: '#FFFFFF',
  },
  time: {
    fontSize: 11,
    color: palette.muted,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
});
