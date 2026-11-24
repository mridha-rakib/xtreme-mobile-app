import { colors, palette, radii, shadows, spacing, typography } from '@xtreme/design-tokens';
import {
  DEFAULT_DEMO_IDS,
  sampleCustomer,
  sampleDriver,
  sampleOperationsUser,
  samplePersonas,
} from '@xtreme/mock-data';
import type {
  AssignmentStatus,
  BookingStatus,
  DemoPersona,
  DemoScenario,
  UserProfile,
} from '@xtreme/types';
import { StatusBar } from 'expo-status-bar';
import { createContext, type PropsWithChildren, type ReactNode, useContext, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const logoAsset = require('./assets/logo.png');

export * from './discovery-icons';
// Re-export design tokens for consumer convenience
export { colors, palette, radii, shadows, spacing, typography };

/**
 * Mock Authentication Context & Provider
 */
export interface MockAuthContextType {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  isDemoMode: boolean;
  activePersona: DemoPersona;
  scenario: DemoScenario;
  demoResourceIds: typeof DEFAULT_DEMO_IDS;
  login: (user?: UserProfile) => void;
  logout: () => void;
  setDemoMode: (enabled: boolean) => void;
  selectPersona: (persona: DemoPersona) => void;
  setScenario: (scenario: DemoScenario) => void;
  resetDemoState: () => void;
}

const defaultDemoIds = DEFAULT_DEMO_IDS;

const MockAuthContext = createContext<MockAuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  isDemoMode: typeof __DEV__ !== 'undefined' ? __DEV__ : false,
  activePersona: 'customer',
  scenario: 'success',
  demoResourceIds: defaultDemoIds,
  login: () => {},
  logout: () => {},
  setDemoMode: () => {},
  selectPersona: () => {},
  setScenario: () => {},
  resetDemoState: () => {},
});

export function MockAuthProvider({
  children,
  initialUser = null,
  initialAuthenticated = false,
  initialDemoMode = typeof __DEV__ !== 'undefined' ? __DEV__ : false,
}: {
  children: ReactNode;
  initialUser?: UserProfile | null;
  initialAuthenticated?: boolean;
  initialDemoMode?: boolean;
}) {
  // Security rule: Production variant ALWAYS disables demo bypass, regardless of any other flag.
  const isProduction = process.env.EXPO_PUBLIC_APP_VARIANT === 'production';
  const isDevBuild = typeof __DEV__ !== 'undefined' && __DEV__;
  const isExplicitPreview =
    process.env.EXPO_PUBLIC_APP_VARIANT === 'preview' ||
    process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

  const isDemoPermitted = !isProduction && (isDevBuild || isExplicitPreview);

  // Security rule: demo bypass can only exist in DEV or explicit preview builds
  const [isDemoMode, setIsDemoModeState] = useState(isDemoPermitted ? initialDemoMode : false);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUser);
  const [activePersona, setActivePersona] = useState<DemoPersona>('customer');
  const [scenario, setScenarioState] = useState<DemoScenario>('success');

  const setDemoMode = (enabled: boolean) => {
    if (isDemoPermitted) {
      setIsDemoModeState(enabled);
    }
  };

  const selectPersona = (persona: DemoPersona) => {
    setActivePersona(persona);
    if (persona === 'customer') {
      setCurrentUser(sampleCustomer);
    } else if (persona === 'driver') {
      setCurrentUser(sampleDriver);
    } else if (persona === 'operations') {
      setCurrentUser(sampleOperationsUser);
    }
    setIsAuthenticated(true);
  };

  const setScenario = (newScenario: DemoScenario) => {
    setScenarioState(newScenario);
  };

  const login = (user?: UserProfile) => {
    setIsAuthenticated(true);
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(samplePersonas[activePersona] || sampleCustomer);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const resetDemoState = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActivePersona('customer');
    setScenarioState('success');
    if (isDemoPermitted) {
      setIsDemoModeState(true);
    }
  };

  return (
    <MockAuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isDemoMode,
        activePersona,
        scenario,
        demoResourceIds: DEFAULT_DEMO_IDS,
        login,
        logout,
        setDemoMode,
        selectPersona,
        setScenario,
        resetDemoState,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  return useContext(MockAuthContext);
}

/**
 * ProtectedRoute Component - Mock Session Gate
 */
export function ProtectedRoute({
  children,
  onSignIn,
}: {
  children: ReactNode;
  onSignIn?: () => void;
}) {
  const { isAuthenticated, isDemoMode } = useMockAuth();
  if (!isAuthenticated && !isDemoMode) {
    return (
      <View style={styles.protectedGate}>
        <Text style={styles.protectedTitle}>Authentication Required</Text>
        <Text style={styles.protectedDesc}>
          This screen requires an active session. Please sign in to access your concierge records.
        </Text>
        {onSignIn ? (
          <Button label="Go to Sign In" onPress={onSignIn} style={{ marginTop: 16 }} />
        ) : null}
      </View>
    );
  }
  return <>{children}</>;
}

/**
 * NotFoundCard Component - Safe handling for invalid or missing resource identifiers
 */
export function NotFoundCard({
  resourceName,
  resourceId,
  onBack,
}: {
  resourceName: string;
  resourceId?: string;
  onBack: () => void;
}) {
  return (
    <View style={styles.notFoundCard}>
      <Text style={styles.notFoundEyebrow}>Lookup Notice</Text>
      <Text style={styles.notFoundTitle}>{resourceName} Not Found</Text>
      <Text style={styles.notFoundDesc}>
        {resourceId
          ? `The requested ${resourceName.toLowerCase()} identifier "${resourceId}" could not be located in records.`
          : `No ${resourceName.toLowerCase()} identifier was provided in route parameters.`}
      </Text>
      <Button
        label="Return to Safety"
        variant="outline"
        onPress={onBack}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

/**
 * ScreenContainer / Page wrapper
 */
export interface ScreenContainerProps extends PropsWithChildren {
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export function ScreenContainer({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  if (scrollable) {
    return (
      <ScrollView
        style={[styles.container, style]}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.container, styles.contentContainer, style]}>{children}</View>;
}

export function Page({ children }: PropsWithChildren) {
  return <ScreenContainer>{children}</ScreenContainer>;
}

/**
 * ScreenCard - Used for screen navigation and high-level option cards
 */
export interface ScreenCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ScreenCard({ title, subtitle, badge, onPress, style }: ScreenCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadows.sm, pressed && styles.cardPressed, style]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {badge ? <Badge label={badge} variant="gold" /> : null}
      </View>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

/**
 * ArrowLeftIcon - Approved Vector Navigation Asset (Figma 264:229 / SimpleDS ArrowLeft)
 */
export interface ArrowLeftIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ArrowLeftIcon({
  size = 20,
  color = '#164D53',
  strokeWidth = 2,
}: ArrowLeftIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * BackButton - Approved Icon-Only Directional Navigation Control (Figma 1048:14367 & 14:79)
 * - True vector icon (no Unicode characters).
 * - Proper accessibilityRole="button" and accessibilityLabel="Go back".
 * - Generous touch target with hitSlop.
 */
export interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'circle' | 'minimal';
  accessibilityLabel?: string;
}

export function BackButton({
  onPress,
  style,
  variant = 'circle',
  accessibilityLabel = 'Go back',
}: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      onPress={onPress}
      style={({ pressed }) => [
        variant === 'circle' ? styles.backButtonCircle : styles.backButtonMinimal,
        pressed && styles.backButtonPressed,
        style,
      ]}
    >
      <ArrowLeftIcon size={18} color="#164D53" strokeWidth={2.2} />
    </Pressable>
  );
}

/**
 * Header / Navigation Bar Component
 */
export interface HeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export function Header({ title, subtitle, eyebrow, onBack, rightAction }: HeaderProps) {
  const cleanEyebrow =
    eyebrow && /^(CUS|STF)-[A-Z0-9-]+$/.test(eyebrow.trim()) ? undefined : eyebrow;
  return (
    <View style={styles.header}>
      {onBack ? (
        <View style={styles.headerBackRow}>
          <BackButton onPress={onBack} />
        </View>
      ) : null}
      {cleanEyebrow ? <Text style={styles.eyebrow}>{cleanEyebrow}</Text> : null}
      <View style={styles.headerRow}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.heading}>{title}</Text>
          {subtitle ? <Text style={styles.subheading}>{subtitle}</Text> : null}
        </View>
        {rightAction ? <View>{rightAction}</View> : null}
      </View>
    </View>
  );
}

/**
 * Button Component (Primary, Secondary, Outline, Danger)
 */
export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}: ButtonProps) {
  const buttonStyles = [
    styles.buttonBase,
    styles[`btn_${size}`],
    styles[`btn_${variant}`],
    disabled && styles.btnDisabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`btnText_${size}`],
    styles[`btnText_${variant}`],
    disabled && styles.btnTextDisabled,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [buttonStyles, pressed && !disabled && styles.btnPressed]}
    >
      <Text style={textStyles}>{label}</Text>
    </Pressable>
  );
}

/**
 * Badge & StatusBadge Component
 */
export interface BadgeProps {
  label: string;
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'info' | 'error';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  return (
    <View style={[styles.badgeBase, styles[`badge_${variant}`], style]}>
      <Text style={[styles.badgeText, styles[`badgeText_${variant}`]]}>{label}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: BookingStatus | AssignmentStatus | string }) {
  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return <Badge label={status} variant="success" />;
    case 'PENDING_VENDOR':
    case 'IN_REVIEW':
    case 'ASSIGNED':
      return <Badge label={status.replace('_', ' ')} variant="warning" />;
    case 'IN_PROGRESS':
    case 'EN_ROUTE':
    case 'ARRIVED':
    case 'ACCEPTED':
      return <Badge label={status.replace('_', ' ')} variant="info" />;
    case 'CANCELLED':
    case 'DECLINED':
    case 'INCIDENT_REPORTED':
      return <Badge label={status.replace('_', ' ')} variant="error" />;
    default:
      return <Badge label={status} variant="default" />;
  }
}

/**
 * BrandLogo Component - Faithfully replicates the approved Figma badge.
 *
 * BRANDING SPECIFICATION COMPLIANCE NOTE:
 * - The visual artwork in Figma is explicitly designated as a development placeholder
 *   ('logo placeholder' in subtext per XTREME_Concierge_Design_Tokens_v1.0.json line 7).
 * - This component represents the approved placeholder layout and must NOT be replaced
 *   with an invented logo.
 * - Final production vector branding will be integrated once officially delivered by the client.
 */
export interface BrandLogoProps {
  variant?: 'customer' | 'staff';
  style?: ViewStyle;
}

export function BrandLogo({ variant = 'customer', style }: BrandLogoProps) {
  const isStaff = variant === 'staff';
  return (
    <View style={[styles.brandLogoContainer, style]}>
      <Image source={logoAsset} style={styles.brandLogoImage} resizeMode="contain" />
      {isStaff ? (
        <View style={styles.brandLogoStaffPill}>
          <Text style={styles.brandLogoStaffPillText}>STAFF OPERATIONS</Text>
        </View>
      ) : null}
    </View>
  );
}

/**
 * ScreenTopBar - Native Device-Aware Brand Eyebrow Header
 *
 * SPECIFICATION COMPLIANCE:
 * - Hardcoded '9:41' mockup text removed in favor of native device status bar.
 * - Accurately aligns centered XTREME brand header matching Figma y=29.
 * - Divider line matching Figma line (18,44) -> (372,44).
 */
export function ScreenTopBar({
  brand = 'XTREME',
  showDivider = true,
  onBack: _onBack,
}: {
  brand?: string;
  showDivider?: boolean;
  onBack?: () => void;
}) {
  return (
    <View style={styles.screenTopBar}>
      <StatusBar style="dark" />
      <View style={styles.screenTopBarRow}>
        <Text style={styles.screenBrandText}>{brand}</Text>
      </View>
      {showDivider ? <View style={styles.screenTopDivider} /> : null}
    </View>
  );
}

/**
 * AuthScreenContainer - Complete cross-platform Safe Area & Keyboard Avoiding Wrapper
 *
 * SAFE AREA ARCHITECTURE:
 * - Applies exact insets.top to avoid camera notch/Dynamic Island without double-padding.
 * - Centers the XTREME brand header and status divider.
 * - Integrates KeyboardAvoidingView (iOS padding) and keyboardShouldPersistTaps.
 * - Enforces insets.bottom padding so footer/legal text floats above home indicators.
 */
export interface AuthScreenContainerProps {
  children: ReactNode;
  brand?: string;
  showDivider?: boolean;
  contentContainerStyle?: ViewStyle;
}

export function AuthScreenContainer({
  children,
  brand = 'XTREME',
  showDivider = true,
  contentContainerStyle,
}: AuthScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.authScreenRoot, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.screenTopBarRow}>
        <Text style={styles.screenBrandText}>{brand}</Text>
      </View>
      {showDivider ? <View style={styles.screenTopDivider} /> : null}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.authScrollView}
          contentContainerStyle={[
            styles.authScrollContent,
            contentContainerStyle,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/**
 * EyeIcon - Vector Concentric Circles matching Figma Password Visibility Toggle
 * Exactly replicates:
 * <circle cx="344" cy="293" r="7" fill="none" stroke="#A6A19A" />
 * <circle cx="344" cy="293" r="2" fill="#A6A19A" stroke="none" />
 */
export function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <View style={styles.eyeIconContainer}>
      <View style={styles.eyeOuterCircle}>
        <View style={styles.eyeInnerPupil} />
        {!visible ? <View style={styles.eyeSlashLine} /> : null}
      </View>
    </View>
  );
}

/**
 * RecoveryMethodCard - CUS-AUTH-04 Method Selection Card
 */
export interface RecoveryMethodCardProps {
  badgeLetter: string;
  badgeColor?: string;
  title: string;
  description: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function RecoveryMethodCard({
  badgeLetter,
  badgeColor = '#A88343',
  title,
  description,
  onPress,
  style,
}: RecoveryMethodCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.recoveryCard,
        shadows.sm,
        pressed && styles.recoveryCardPressed,
        style,
      ]}
    >
      <View style={[styles.recoveryBadgeCircle, { borderColor: badgeColor }]}>
        <Text style={[styles.recoveryBadgeLetter, { color: badgeColor }]}>{badgeLetter}</Text>
      </View>
      <View style={styles.recoveryTextGroup}>
        <Text style={styles.recoveryCardTitle}>{title}</Text>
        <Text style={styles.recoveryCardDescription}>{description}</Text>
      </View>
      <Text style={styles.recoveryChevron}>›</Text>
    </Pressable>
  );
}

/**
 * NeutralSecurityNotice - CUS-AUTH-05 & CUS-AUTH-07 Non-Disclosure Security Card
 */
export function NeutralSecurityNotice({
  title = 'Neutral request result',
  description = 'The response does not confirm whether an account exists.',
  style,
}: {
  title?: string;
  description?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.neutralNoticeContainer, style]}>
      <Text style={styles.neutralNoticeTitle}>{title}</Text>
      <Text style={styles.neutralNoticeDesc}>{description}</Text>
    </View>
  );
}

/**
 * ContextBanner - CUS-AUTH-08 Token Context Security Card
 */
export function ContextBanner({
  title = 'Secure reset context',
  description = 'The reset token is handled securely and is not displayed.',
  style,
}: {
  title?: string;
  description?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.contextBannerContainer, style]}>
      <View style={styles.contextBadgeCircle}>
        <Text style={styles.contextCheckmark}>✓</Text>
      </View>
      <View style={styles.contextTextGroup}>
        <Text style={styles.contextBannerTitle}>{title}</Text>
        <Text style={styles.contextBannerDesc}>{description}</Text>
      </View>
    </View>
  );
}

/**
 * AuthHeader - Approved Screen Title and Subtitle with Gold Marker & Eyebrow
 */
export interface AuthHeaderProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  style?: ViewStyle;
}

export function AuthEyebrow({
  label = 'CUSTOMER ACCESS',
  style,
}: {
  label?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.authEyebrowRow, style]}>
      <View style={styles.authEyebrowBar} />
      <Text style={styles.authEyebrowText}>{label}</Text>
    </View>
  );
}

export function AuthHeader({
  title,
  subtitle,
  eyebrow = 'CUSTOMER ACCESS',
  style,
}: AuthHeaderProps) {
  return (
    <View style={[styles.authHeaderContainer, style]}>
      {eyebrow ? <AuthEyebrow label={eyebrow} /> : null}
      <Text style={styles.authTitle}>{title}</Text>
      <Text style={styles.authSubtitle}>{subtitle}</Text>
    </View>
  );
}

/**
 * OperationalNoticeBox - Approved Staff Notice Box (Figma STF-AUTH-01)
 */
export function OperationalNoticeBox({
  message = 'Operational access only. Customer registration is not available in the Staff App.',
  style,
}: {
  message?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.operationalNoticeContainer, style]}>
      <Text style={styles.operationalNoticeText}>{message}</Text>
    </View>
  );
}

/**
 * InputField - Figma-matched Form Input with Error and Right Action support
 */
export interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rightElement?: ReactNode;
  editable?: boolean;
  error?: string;
  style?: ViewStyle;
}

export function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightElement,
  editable = true,
  error,
  style,
}: InputFieldProps) {
  return (
    <View style={[styles.fieldContainer, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View
        style={[
          styles.fieldInputWrapper,
          !editable && styles.fieldDisabled,
          error ? styles.fieldErrorBorder : null,
        ]}
      >
        <TextInput
          style={styles.fieldTextInput}
          placeholder={placeholder}
          placeholderTextColor="#A6A19A"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
        />
        {rightElement ? <View style={styles.fieldRightElement}>{rightElement}</View> : null}
      </View>
      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
    </View>
  );
}

/**
 * PasswordInput - InputField with visibility toggle
 */
export function PasswordInput({
  label = 'Password',
  placeholder = 'Password',
  value,
  onChangeText,
  error,
  style,
}: {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: ViewStyle;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <InputField
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      autoCapitalize="none"
      error={error}
      style={style}
      rightElement={
        <Pressable
          accessibilityRole="button"
          onPress={() => setVisible((prev) => !prev)}
          hitSlop={12}
        >
          <EyeIcon visible={visible} />
        </Pressable>
      }
    />
  );
}

/**
 * PrimaryButton - Approved Figma 48px Action Button
 */
export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'atlantic';
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}: PrimaryButtonProps) {
  const bgStyle =
    variant === 'atlantic'
      ? styles.primaryBtnAtlantic
      : variant === 'secondary'
        ? styles.primaryBtnSecondary
        : styles.primaryBtnDefault;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.primaryBtnBase,
        bgStyle,
        (disabled || loading) && styles.primaryBtnDisabled,
        pressed && !disabled && !loading && styles.primaryBtnPressed,
        style,
      ]}
    >
      <Text
        style={[styles.primaryBtnText, variant === 'secondary' && styles.primaryBtnSecondaryText]}
      >
        {loading ? 'Please wait...' : label}
      </Text>
    </Pressable>
  );
}

/**
 * TextLink - Approved Figma Luxury Brand Action Link
 */
export interface TextLinkProps {
  label: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function TextLink({ label, onPress, color = '#164D53', style, textStyle }: TextLinkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.textLinkWrapper, pressed && styles.textLinkPressed, style]}
    >
      <Text style={[styles.textLinkContent, { color }, textStyle]}>{label}</Text>
    </Pressable>
  );
}

/**
 * NoticeBanner - Verification and System Notice Card (Figma CUS-AUTH-03)
 */
export function NoticeBanner({
  title,
  message,
  style,
}: {
  title: string;
  message: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.noticeBannerContainer, style]}>
      <Text style={styles.noticeBannerTitle}>{title}</Text>
      <Text style={styles.noticeBannerMessage}>{message}</Text>
    </View>
  );
}

/**
 * LegalFooter - Approved Privacy & Terms Navigation Links
 */
export function LegalFooter({
  onPrivacyPress,
  onTermsPress,
  style,
}: {
  onPrivacyPress: () => void;
  onTermsPress: () => void;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.legalFooterContainer, style]}>
      <View style={styles.legalDivider} />
      <View style={styles.legalLinksRow}>
        <Pressable accessibilityRole="button" onPress={onPrivacyPress}>
          <Text style={styles.legalLinkText}>Privacy Policy</Text>
        </Pressable>
        <Text style={styles.legalDot}>•</Text>
        <Pressable accessibilityRole="button" onPress={onTermsPress}>
          <Text style={styles.legalLinkText}>Terms & Conditions</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * DetailRow Component for Key/Value pairs
 */
export function DetailRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string | number | ReactNode;
  valueStyle?: TextStyle;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
}

/**
 * TextField / Input Component
 */
export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  helperText?: string;
  editable?: boolean;
}

export function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  helperText,
  editable = true,
}: TextFieldProps) {
  return (
    <View style={styles.inputGroup}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput
        style={[styles.inputField, !editable && styles.inputDisabled]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedLight}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
      />
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

/**
 * Divider Component
 */
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  backButtonChevron: {
    fontSize: 22,
    fontWeight: '300',
    color: colors.atlantic,
    marginRight: 4,
    marginTop: -2,
  },
  backButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.atlantic,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextGroup: {
    flex: 1,
  },
  eyebrow: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.accentGoldDark,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing['2xs'],
  },
  heading: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
    marginTop: spacing['2xs'],
    lineHeight: typography.sizes.sm * 1.4,
  },
  card: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  cardPressed: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.accentGold,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.ink,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  buttonBase: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btn_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  btn_md: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
  btn_lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  btn_primary: {
    backgroundColor: colors.ink,
  },
  btn_secondary: {
    backgroundColor: colors.accentGold,
  },
  btn_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  btn_danger: {
    backgroundColor: colors.status.cancelled.bg,
    borderWidth: 1,
    borderColor: colors.status.cancelled.border,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontWeight: typography.weights.semibold,
  },
  btnText_sm: {
    fontSize: typography.sizes.xs,
  },
  btnText_md: {
    fontSize: typography.sizes.sm,
  },
  btnText_lg: {
    fontSize: typography.sizes.base,
  },
  btnText_primary: {
    color: colors.inverseText,
  },
  btnText_secondary: {
    color: colors.ink,
  },
  btnText_outline: {
    color: colors.ink,
  },
  btnText_danger: {
    color: colors.status.cancelled.text,
  },
  btnTextDisabled: {
    color: colors.mutedLight,
  },
  badgeBase: {
    paddingVertical: 3,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: typography.sizes['2xs'],
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge_default: {
    backgroundColor: colors.lineSubtle,
  },
  badgeText_default: {
    color: colors.inkSecondary,
  },
  badge_gold: {
    backgroundColor: colors.accentGoldLight,
  },
  badgeText_gold: {
    color: colors.accentGoldDark,
  },
  badge_success: {
    backgroundColor: colors.status.confirmed.bg,
  },
  badgeText_success: {
    color: colors.status.confirmed.text,
  },
  badge_warning: {
    backgroundColor: colors.status.pending.bg,
  },
  badgeText_warning: {
    color: colors.status.pending.text,
  },
  badge_info: {
    backgroundColor: colors.status.inProgress.bg,
  },
  badgeText_info: {
    color: colors.status.inProgress.text,
  },
  badge_error: {
    backgroundColor: colors.status.cancelled.bg,
  },
  badgeText_error: {
    color: colors.status.cancelled.text,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.ink,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  inputField: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.ink,
  },
  inputDisabled: {
    backgroundColor: colors.lineSubtle,
    color: colors.muted,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    color: colors.muted,
    marginTop: spacing['2xs'],
  },
  divider: {
    height: 1,
    backgroundColor: colors.lineSubtle,
    marginVertical: spacing.md,
  },
  protectedGate: {
    padding: spacing.xl,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  protectedTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  protectedDesc: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  notFoundCard: {
    padding: spacing.xl,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.status.cancelled.border,
    marginTop: spacing.md,
  },
  notFoundEyebrow: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.status.cancelled.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  notFoundTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  notFoundDesc: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
    lineHeight: 20,
  },
  // Phase 2.1 & Phase 2.2 Authoritative Figma Visual Redesign
  brandLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  brandLogoImage: {
    width: 148,
    height: 63,
  },
  brandLogoStaffPill: {
    backgroundColor: '#164D53',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  brandLogoStaffPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FAF8F4',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  authEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authEyebrowBar: {
    width: 28,
    height: 2,
    backgroundColor: '#C6A15B',
    borderRadius: 1,
    marginRight: 8,
  },
  authEyebrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#164D53',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  operationalNoticeContainer: {
    backgroundColor: '#F1E7D2',
    borderWidth: 1,
    borderColor: '#C6A15B',
    borderRadius: 8,
    padding: 14,
    marginVertical: 14,
  },
  operationalNoticeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0B0C0E',
    lineHeight: 17,
  },
  brandLogoBadge: {
    width: 108,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#0B0C0E',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  brandLogoStaffBadge: {
    backgroundColor: '#164D53',
  },
  brandLogoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  brandLogoSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D7C39A',
    marginTop: 2,
  },
  brandLogoStaffSubtitle: {
    color: '#F1E7D2',
  },
  screenTopBar: {
    backgroundColor: '#FAF8F4',
  },
  screenTopBarRow: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  screenTimeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B0C0E',
  },
  screenBrandText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: 0.7,
  },
  screenTopDivider: {
    height: 1,
    backgroundColor: '#DDD8CF',
  },
  authHeaderContainer: {
    marginTop: 16,
    marginBottom: 14,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B0C0E',
    letterSpacing: -0.2,
  },
  authSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#5B616B',
    marginTop: 4,
    lineHeight: 18,
  },
  fieldContainer: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B616B',
    marginBottom: 6,
  },
  fieldInputWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldTextInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#0B0C0E',
  },
  fieldDisabled: {
    backgroundColor: '#EEE9E0',
  },
  fieldErrorBorder: {
    borderColor: '#B33A3A',
  },
  fieldErrorText: {
    fontSize: 11,
    color: '#B33A3A',
    marginTop: 4,
  },
  fieldRightElement: {
    marginLeft: 8,
  },
  toggleVisibilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#164D53',
  },
  primaryBtnBase: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryBtnDefault: {
    backgroundColor: '#0B0C0E',
  },
  primaryBtnAtlantic: {
    backgroundColor: '#164D53',
  },
  primaryBtnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnPressed: {
    opacity: 0.85,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  primaryBtnSecondaryText: {
    color: '#0B0C0E',
  },
  textLinkWrapper: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  textLinkPressed: {
    opacity: 0.7,
  },
  textLinkContent: {
    fontSize: 13,
    fontWeight: '600',
  },
  noticeBannerContainer: {
    backgroundColor: '#DDEBEC',
    borderRadius: 12,
    padding: 14,
    marginVertical: 12,
  },
  noticeBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#164D53',
    marginBottom: 4,
  },
  noticeBannerMessage: {
    fontSize: 12,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 16,
  },
  legalFooterContainer: {
    marginTop: 28,
    paddingBottom: 16,
  },
  legalDivider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    marginBottom: 16,
  },
  legalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLinkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#164D53',
  },
  legalDot: {
    fontSize: 12,
    color: '#A6A19A',
    marginHorizontal: 10,
  },
  topBarBack: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  topBarBackText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#164D53',
  },
  recoveryCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDD8CF',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recoveryCardPressed: {
    backgroundColor: '#EEE9E0',
    borderColor: '#C6A15B',
  },
  recoveryBadgeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#FAF8F4',
  },
  recoveryBadgeLetter: {
    fontSize: 13,
    fontWeight: '700',
  },
  recoveryTextGroup: {
    flex: 1,
  },
  recoveryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0C0E',
    marginBottom: 4,
  },
  recoveryCardDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 16,
  },
  recoveryChevron: {
    fontSize: 22,
    color: '#5B616B',
    marginLeft: 8,
  },
  neutralNoticeContainer: {
    backgroundColor: '#EEE9E0',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  neutralNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B0C0E',
    marginBottom: 4,
  },
  neutralNoticeDesc: {
    fontSize: 12,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 16,
  },
  contextBannerContainer: {
    backgroundColor: '#DDEBEC',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  contextBadgeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#164D53',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contextCheckmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contextTextGroup: {
    flex: 1,
  },
  contextBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B0C0E',
    marginBottom: 2,
  },
  contextBannerDesc: {
    fontSize: 11.5,
    fontWeight: '400',
    color: '#5B616B',
    lineHeight: 15,
  },
  // Phase 2.2 Fidelity & Cross-Platform Safe Area Styles
  authScreenRoot: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  authTopBrandBar: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  authScrollView: {
    flex: 1,
  },
  authScrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  eyeIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeOuterCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.4,
    borderColor: '#A6A19A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeInnerPupil: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: '#A6A19A',
  },
  eyeSlashLine: {
    position: 'absolute',
    width: 18,
    height: 1.4,
    backgroundColor: '#A6A19A',
    transform: [{ rotate: '45deg' }],
  },
  // BackButton & Vector Navigation Styles
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  backButtonMinimal: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.7,
    backgroundColor: '#F3EFE6',
  },
  headerBackRow: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
