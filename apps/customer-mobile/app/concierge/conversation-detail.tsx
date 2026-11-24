import {
  addMessage,
  getConversationById,
  getMessagesByConversationId,
  markConversationAsRead,
} from '@xtreme/mock-data';
import type { ConciergeMessage } from '@xtreme/types';
import { CustomerBottomNav, NotFoundCard } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

/**
 * CUS-CON-05: Concierge Conversation Detail Screen
 * Authoritative Figma Frame: 60:1091 (CUS-CON-05__Concierge_Conversation_Detail__Ready)
 */
export default function ConciergeConversationDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    conversationId?: string;
    id?: string;
    requestId?: string;
  }>();

  const activeConvId = params.conversationId || params.id || 'conv-demo-001';

  const conversation = useMemo(() => {
    if (!activeConvId) return undefined;
    return getConversationById(activeConvId);
  }, [activeConvId]);

  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [inputText, setInputText] = useState('');

  // Load live messages and mark conversation as read
  useEffect(() => {
    if (activeConvId) {
      markConversationAsRead(activeConvId);
      setMessages(getMessagesByConversationId(activeConvId));
    }
  }, [activeConvId]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/concierge/conversations' as never);
    }
  };

  const handleSendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0',
    )}`;

    const newMsg: ConciergeMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConvId,
      senderId: 'demo-cus-001',
      senderName: 'You',
      isStaff: false,
      content: trimmed,
      timestamp: timeStr,
    };

    addMessage(newMsg);
    setMessages(getMessagesByConversationId(activeConvId));
    setInputText('');
  };

  if (!conversation) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19L8 12L15 5"
                stroke="#164D53"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
          <Text style={styles.pageSubtitle}>Conversation</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={{ padding: 20 }}>
          <NotFoundCard
            resourceName="Concierge Conversation"
            resourceId={activeConvId}
            onBack={() => router.replace('/concierge/conversations' as never)}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 8, paddingBottom: 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header Row with back chevron */}
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M15 19L8 12L15 5"
                  stroke="#164D53"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
            <View style={styles.headerSpacer} />
          </View>

          {/* Title matching Figma node 60:1095 */}
          <View style={styles.titleWrap}>
            <Text style={styles.pageTitle}>Concierge Conversation Detail</Text>
            <Text style={styles.pageSubtitle}>Concierge Conversation</Text>
          </View>

          {/* Dialogue Thread matching Figma frame 60:1091 */}
          <View style={styles.threadContainer}>
            {messages.map((msg) => {
              const isCustomer = !msg.isStaff;
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    isCustomer ? styles.bubbleCustomer : styles.bubbleConcierge,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.content}</Text>
                  <Text
                    style={[
                      styles.messageMeta,
                      isCustomer ? styles.metaCustomer : styles.metaConcierge,
                    ]}
                  >
                    {isCustomer ? `${msg.timestamp} • You` : `${msg.timestamp} • Concierge`}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Message Input Composer matching Figma node 60:1112 pinned above bottom nav */}
        <View style={styles.composerWrapper}>
          <View style={styles.composerCard}>
            <TextInput
              style={styles.composerInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Write a message"
              placeholderTextColor="#5B616B"
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
            />
            <Pressable
              style={styles.sendButton}
              onPress={handleSendMessage}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </Pressable>
          </View>

          {/* Persistence Notice matching Figma node 60:1116 */}
          <Text style={styles.persistenceNotice}>
            Messages persist with sender, timestamp and read state.
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <CustomerBottomNav
        activeTab="Concierge"
        bottomInset={insets.bottom}
        onTabPress={(tab) => {
          if (tab === 'Home') router.push('/discover' as never);
          else if (tab === 'Bookings') router.push('/bookings' as never);
          else if (tab === 'Trips') router.push('/trips' as never);
          else if (tab === 'Concierge') router.push('/concierge/requests' as never);
          else if (tab === 'Profile') router.push('/account/profile' as never);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 45,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  titleWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 32,
  },
  pageSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
    lineHeight: 26,
  },
  threadContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  messageBubble: {
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: '82%',
    gap: 4,
  },
  bubbleConcierge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  bubbleCustomer: {
    alignSelf: 'flex-end',
    backgroundColor: '#F1E7D2',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0B0C0E',
    lineHeight: 22,
  },
  messageMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  metaConcierge: {
    textAlign: 'left',
  },
  metaCustomer: {
    textAlign: 'right',
  },
  composerWrapper: {
    backgroundColor: '#FAF8F4',
    paddingTop: 8,
    paddingBottom: 4,
  },
  composerCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 54,
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  composerInput: {
    flex: 1,
    fontSize: 14,
    color: '#0B0C0E',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    height: 38,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  persistenceNotice: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    textAlign: 'center',
    letterSpacing: 0.1,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
});
