import { getAllConversations } from '@xtreme/mock-data';
import type { ConciergeConversation } from '@xtreme/types';
import { ConversationReadPill, CustomerBottomNav } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logoHeader = require('../../assets/logo.png');

/**
 * CUS-CON-04: Concierge Conversations Screen
 * Authoritative Figma Frame: 60:1043 (CUS-CON-04__Concierge_Conversations__Ready)
 */
export default function ConciergeConversationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const conversations = useMemo(() => getAllConversations(), []);

  const handleConversationPress = (conv: ConciergeConversation) => {
    router.push({
      pathname: '/concierge/conversation-detail',
      params: { conversationId: conv.id, requestId: conv.requestId },
    } as never);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header Row matching Figma node 1065:14459 */}
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title */}
        <View style={styles.titleWrap}>
          <Text style={styles.pageTitle}>Concierge Conversations</Text>
        </View>

        {/* Conversations List matching Figma frame 60:1043 */}
        <View style={styles.listContainer}>
          {conversations.map((conv) => (
            <Pressable
              key={conv.id}
              style={styles.convCard}
              onPress={() => handleConversationPress(conv)}
              accessibilityRole="button"
              accessibilityLabel={`${conv.subject}, ${conv.status || 'READ'}`}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardSubject} numberOfLines={1}>
                  {conv.subject}
                </Text>
                <Text style={styles.cardSnippet} numberOfLines={1}>
                  {conv.lastMessageSnippet}
                </Text>
              </View>

              <View style={styles.cardRight}>
                <ConversationReadPill
                  status={conv.status || (conv.unreadCount > 0 ? 'NEW' : 'READ')}
                />
              </View>
            </Pressable>
          ))}

          {/* Persistent History Notice matching Figma node 60:1078 */}
          <Text style={styles.historyNotice}>
            Persistent history and read/unread state are retained.
          </Text>
        </View>
      </ScrollView>

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
  logoWrap: {
    width: 82,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: 82,
    height: 35,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    marginHorizontal: 20,
    marginTop: 4,
  },
  titleWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 32,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  convCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 82,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
    marginRight: 12,
  },
  cardSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  cardSnippet: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    letterSpacing: 0.1,
  },
  cardRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  historyNotice: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    textAlign: 'center',
    letterSpacing: 0.1,
    marginTop: 14,
    marginBottom: 8,
  },
});
