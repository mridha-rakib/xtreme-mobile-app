import { CustomerBottomNav } from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const logoHeader = require('../assets/logo.png');

interface ContactCardItem {
  id: string;
  title: string;
  value: string;
  type: 'email' | 'phone' | 'whatsapp' | 'hours';
}

const CONTACT_ITEMS: ContactCardItem[] = [
  {
    id: 'contact-email',
    title: 'Email Concierge',
    value: 'concierge@xtreme-mvp.sn',
    type: 'email',
  },
  {
    id: 'contact-phone',
    title: 'VIP Client Line',
    value: '+221 33 800 0000',
    type: 'phone',
  },
  {
    id: 'contact-whatsapp',
    title: 'Dedicated WhatsApp',
    value: '+221 77 000 1234',
    type: 'whatsapp',
  },
  {
    id: 'contact-hours',
    title: 'Operational Hours',
    value: '24/7 Dedicated Client Support',
    type: 'hours',
  },
];

interface LegalItem {
  id: string;
  title: string;
  slug: string;
}

const LEGAL_ITEMS: LegalItem[] = [
  {
    id: 'leg-privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
  },
  {
    id: 'leg-terms',
    title: 'Terms & Conditions',
    slug: 'terms-conditions',
  },
  {
    id: 'leg-cancellation',
    title: 'Cancellation & Refund Policy',
    slug: 'cancellation-policy',
  },
  {
    id: 'leg-notice',
    title: 'General Notice & Disclaimers',
    slug: 'general-notice',
  },
];

/**
 * CUS-SUP-01: Support & Legal Screen
 * Authoritative Figma Frame: 36:188 (CUS-SUP-01__Support_Legal__Pending_Content)
 */
export default function SupportLegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/account/profile' as never);
    }
  };

  const handleLegalPress = (slug: string) => {
    router.push({
      pathname: '/legal/document',
      params: { slug },
    } as never);
  };

  const handleContactPress = async (item: ContactCardItem) => {
    if (item.type === 'email') {
      const url = `mailto:${item.value}?subject=XTREME%20Concierge%20Client%20Inquiry`;
      const canOpen = await Linking.canOpenURL(url).catch(() => false);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Email Concierge', `Direct concierge email: ${item.value}`);
      }
    } else if (item.type === 'phone') {
      const telUrl = `tel:${item.value.replace(/[^0-9+]/g, '')}`;
      const canOpen = await Linking.canOpenURL(telUrl).catch(() => false);
      if (canOpen) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert('VIP Client Line', `Direct line: ${item.value}`);
      }
    } else if (item.type === 'whatsapp') {
      const cleanPhone = item.value.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}`;
      const canOpen = await Linking.canOpenURL(waUrl).catch(() => false);
      if (canOpen) {
        await Linking.openURL(waUrl);
      } else {
        Alert.alert('WhatsApp Support', `Dedicated WhatsApp channel: ${item.value}`);
      }
    } else {
      Alert.alert(
        'Operational Hours',
        '24/7 dedicated client support available via concierge dispatch in Dakar, Senegal.',
      );
    }
  };

  const renderContactIcon = (type: ContactCardItem['type']) => {
    if (type === 'email') {
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Rect x={3} y={5} width={18} height={14} rx={2} stroke="#164D53" strokeWidth={2} />
          <Path
            d="M3 7L12 13L21 7"
            stroke="#164D53"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    }
    if (type === 'phone') {
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4741 21.8325 20.7293C21.7209 20.9845 21.5573 21.2137 21.3521 21.4019C21.1468 21.5901 20.9046 21.733 20.6407 21.8215C20.3769 21.9101 20.0974 21.9423 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44823 7.27099 2.11999 4.18C2.0978 3.90352 2.12987 3.62502 2.21415 3.36204C2.29844 3.09906 2.43309 2.85743 2.60947 2.65243C2.78584 2.44743 3.00003 2.28362 3.23844 2.17144C3.47685 2.05926 3.73424 2.0012 3.99999 2H6.99999C7.49603 1.99522 7.97708 2.17173 8.35334 2.49673C8.7296 2.82173 8.97607 3.27364 9.04999 3.77C9.18799 4.75518 9.42907 5.72264 9.76999 6.65C9.91427 7.03961 9.94054 7.46416 9.84555 7.86877C9.75056 8.27338 9.53856 8.63999 9.23999 8.92L7.96999 10.19C9.37825 12.6685 11.4115 14.7018 13.89 16.11L15.16 14.84C15.44 14.5414 15.8066 14.3294 16.2112 14.2344C16.6158 14.1394 17.0404 14.1657 17.43 14.31C18.3574 14.6509 19.3248 14.892 20.31 15.03C20.8115 15.1044 21.2676 15.3541 21.5932 15.7341C21.9188 16.1141 22.0926 16.5996 22.09 17.1L22 16.92Z"
            stroke="#164D53"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    }
    if (type === 'whatsapp') {
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
            stroke="#164D53"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    }
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} stroke="#164D53" strokeWidth={2} />
        <Path d="M12 6V12L16 14" stroke="#164D53" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    );
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
        {/* Brand Header Row */}
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
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Support & Legal</Text>
        </View>

        {/* Section: Contact XTREME */}
        <Text style={styles.sectionHeading}>Contact XTREME</Text>

        {/* Staging Notice Banner */}
        <View style={styles.stagingBanner}>
          <Text style={styles.stagingBannerTitle}>Direct Client Channels</Text>
          <Text style={styles.stagingBannerSubtitle}>
            Staging channels active. Official production telephone and WhatsApp numbers await final
            client provisioning.
          </Text>
        </View>

        <View style={styles.contactList}>
          {CONTACT_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.contactCard, pressed && styles.contactCardPressed]}
              onPress={() => handleContactPress(item)}
              accessibilityRole="button"
              accessibilityLabel={`Contact via ${item.title}`}
            >
              <View style={styles.contactIconWrap}>{renderContactIcon(item.type)}</View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{item.title}</Text>
                <Text style={styles.contactValue}>{item.value}</Text>
              </View>
              {item.type !== 'hours' ? (
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M9 5L16 12L9 19"
                    stroke="#164D53"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              ) : null}
            </Pressable>
          ))}
        </View>

        {/* Section: Legal */}
        <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Legal</Text>
        <View style={styles.legalList}>
          {LEGAL_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.legalCard, pressed && styles.legalCardPressed]}
              onPress={() => handleLegalPress(item.slug)}
              accessibilityRole="button"
              accessibilityLabel={`View ${item.title}`}
            >
              <Text style={styles.legalTitle}>{item.title}</Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 5L16 12L9 19"
                  stroke="#164D53"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Customer Bottom Navigation Bar */}
      <CustomerBottomNav
        activeTab="Profile"
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
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  brandLogo: {
    width: 140,
    height: 28,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    opacity: 0.72,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
  },
  titleRow: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.3,
  },
  sectionHeading: {
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  stagingBanner: {
    marginHorizontal: 20,
    backgroundColor: '#FAF6EF',
    borderWidth: 1,
    borderColor: '#E4D7B5',
    borderRadius: 14,
    padding: 12,
    gap: 4,
    marginBottom: 14,
  },
  stagingBannerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A6A2B',
  },
  stagingBannerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
  },
  contactList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  contactCardPressed: {
    backgroundColor: '#F9F7F2',
  },
  contactIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1E7D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B0C0E',
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#164D53',
  },
  legalList: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  legalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legalCardPressed: {
    backgroundColor: '#F9F7F2',
  },
  legalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
  },
});
