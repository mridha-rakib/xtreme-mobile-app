import { CustomerBottomNav, NotFoundCard } from '@xtreme/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoHeader = require('../../assets/logo.png');

interface LegalDocConfig {
  slug: string;
  title: string;
  refCode: string;
}

const SUPPORTED_LEGAL_DOCS: Record<string, LegalDocConfig> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    refCode: 'DOC-PRIVACY-v1.0',
  },
  'terms-conditions': {
    slug: 'terms-conditions',
    title: 'Terms & Conditions',
    refCode: 'DOC-TERMS-v1.0',
  },
  'cancellation-policy': {
    slug: 'cancellation-policy',
    title: 'Cancellation & Refund Policy',
    refCode: 'DOC-CANCEL-REFUND-v1.0',
  },
  'general-notice': {
    slug: 'general-notice',
    title: 'General Notice & Disclaimers',
    refCode: 'DOC-NOTICE-v1.0',
  },
};

/**
 * CUS-LEG-01: Legal Document Viewer
 * Authoritative Figma Frame: 36:250 (CUS-LEG-01__Legal_Document_Viewer__Pending_Content)
 * State Reference Frame: 42:970 (CUS-LEG-01__Ready_Structure_Client_Content)
 */
export default function LegalDocumentViewerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slug?: string; id?: string }>();

  const activeSlug = (params.slug || params.id || 'privacy-policy').toLowerCase();

  const doc = useMemo(() => {
    return SUPPORTED_LEGAL_DOCS[activeSlug];
  }, [activeSlug]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/support' as never);
    }
  };

  if (!doc) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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

        <View style={{ padding: 20 }}>
          <NotFoundCard
            resourceName="Legal Document"
            resourceId={activeSlug}
            onBack={() => router.replace('/support' as never)}
          />
        </View>
      </View>
    );
  }

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
          <Text style={styles.pageTitle}>Legal Document Viewer</Text>
        </View>

        {/* Status Banner matching Figma node 36:255 */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>Legal content pending</Text>
          <Text style={styles.warningSubtitle}>
            Awaiting approved wording and EN/FR translation.
          </Text>
        </View>

        {/* Document Title matching Figma node 36:258 */}
        <Text style={styles.docTitle}>{doc.title}</Text>

        {/* Reading Card Frame matching Figma node 36:259 */}
        <View style={styles.readingCard}>
          <Text style={styles.cardTag}>PLACEHOLDER CONTENT</Text>

          {/* Skeleton lines matching Figma nodes 36:261 - 36:267 */}
          <View style={[styles.skeletonLine, { width: '92%' }]} />
          <View style={[styles.skeletonLine, { width: '100%' }]} />
          <View style={[styles.skeletonLine, { width: '88%' }]} />
          <View style={[styles.skeletonLine, { width: '96%' }]} />
          <View style={[styles.skeletonLine, { width: '82%' }]} />
          <View style={[styles.skeletonLine, { width: '94%' }]} />
          <View style={[styles.skeletonLine, { width: '90%' }]} />

          {/* Explicit client review notice matching Figma node 36:268 */}
          <Text style={styles.bodyNotice}>
            Final legal wording + EN/FR translation supplied by the client/legal owner will replace
            this placeholder.
          </Text>

          {/* Structured Document Metadata */}
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Document Ref:</Text>
              <Text style={styles.metaValue}>{doc.refCode}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Jurisdiction:</Text>
              <Text style={styles.metaValue}>Republic of Senegal • Dakar</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Status:</Text>
              <Text style={[styles.metaValue, { color: '#8A6A2B' }]}>
                Pending Client/Legal Review
              </Text>
            </View>
          </View>
        </View>

        {/* Back to Support & Legal Action matching Figma node 253:2141 */}
        <Pressable
          style={({ pressed }) => [styles.backLinkRow, pressed && styles.backLinkRowPressed]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back to Support & Legal"
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="#164D53"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.backLinkText}>Back to Support & Legal</Text>
        </Pressable>
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
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.3,
  },
  warningBanner: {
    marginHorizontal: 20,
    backgroundColor: '#FAF6EF',
    borderWidth: 1,
    borderColor: '#E4D7B5',
    borderRadius: 14,
    padding: 14,
    gap: 4,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A6A2B',
  },
  warningSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
    lineHeight: 16,
  },
  docTitle: {
    marginHorizontal: 20,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#0B0C0E',
  },
  readingCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 16,
    padding: 18,
  },
  cardTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A6A2B',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EDE8DF',
    marginBottom: 14,
  },
  bodyNotice: {
    fontSize: 13,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 16,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingTop: 12,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5B616B',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B0C0E',
  },
  backLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
    paddingVertical: 10,
  },
  backLinkRowPressed: {
    opacity: 0.7,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#164D53',
  },
});
