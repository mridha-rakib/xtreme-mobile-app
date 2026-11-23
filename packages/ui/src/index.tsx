import { colors, palette, radii, shadows, spacing, typography } from '@xtreme/design-tokens';
import type { AssignmentStatus, BookingStatus, UserProfile } from '@xtreme/types';
import { StatusBar } from 'expo-status-bar';
import { createContext, type PropsWithChildren, type ReactNode, useContext, useState } from 'react';
import {
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

// Re-export design tokens for consumer convenience
export { colors, palette, radii, shadows, spacing, typography };

/**
 * Mock Authentication Context & Provider
 */
export interface MockAuthContextType {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  login: (user?: UserProfile) => void;
  logout: () => void;
}

const MockAuthContext = createContext<MockAuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  login: () => {},
  logout: () => {},
});

export function MockAuthProvider({
  children,
  initialUser = null,
  initialAuthenticated = false,
}: {
  children: ReactNode;
  initialUser?: UserProfile | null;
  initialAuthenticated?: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUser);

  const login = (user?: UserProfile) => {
    setIsAuthenticated(true);
    if (user) setCurrentUser(user);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <MockAuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
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
  const { isAuthenticated } = useMockAuth();
  if (!isAuthenticated) {
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
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      ) : null}
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
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
    <View style={[styles.brandLogoBadge, isStaff && styles.brandLogoStaffBadge, style]}>
      <Text style={styles.brandLogoTitle}>XTREME</Text>
      <Text style={[styles.brandLogoSubtitle, isStaff && styles.brandLogoStaffSubtitle]}>
        {isStaff ? 'STAFF OPS' : 'logo placeholder'}
      </Text>
    </View>
  );
}

/**
 * ScreenTopBar - Native Device-Aware Brand Eyebrow Header
 *
 * SPECIFICATION COMPLIANCE:
 * - Hardcoded '9:41' mockup text removed in favor of native device status bar.
 * - Respects physical safe area insets (notches, Dynamic Island, status bar heights).
 * - Ensures dark status bar text and icons against the Ivory Sand canvas.
 */
export function ScreenTopBar({
  brand = 'XTREME',
  showDivider = true,
  onBack,
}: {
  brand?: string;
  showDivider?: boolean;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screenTopBar, { paddingTop: Math.max(insets.top, 8) }]}>
      <StatusBar style="dark" />
      <View style={styles.screenTopBarRow}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            hitSlop={8}
            style={styles.topBarBack}
          >
            <Text style={styles.topBarBackText}>← Back</Text>
          </Pressable>
        ) : (
          <View style={{ width: 44 }} />
        )}
        <Text style={styles.screenBrandText}>{brand}</Text>
        <View style={{ width: 44 }} />
      </View>
      {showDivider ? <View style={styles.screenTopDivider} /> : null}
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
 * AuthHeader - Approved Screen Title and Subtitle
 */
export interface AuthHeaderProps {
  title: string;
  subtitle: string;
  style?: ViewStyle;
}

export function AuthHeader({ title, subtitle, style }: AuthHeaderProps) {
  return (
    <View style={[styles.authHeaderContainer, style]}>
      <Text style={styles.authTitle}>{title}</Text>
      <Text style={styles.authSubtitle}>{subtitle}</Text>
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
          hitSlop={8}
        >
          <Text style={styles.toggleVisibilityText}>{visible ? 'Hide' : 'Show'}</Text>
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
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  backButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.ink,
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
  // Phase 2.1 High-Fidelity Additions
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
    paddingTop: 12,
    paddingBottom: 4,
  },
  screenTopBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginTop: 10,
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
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
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
    fontWeight: '700',
    color: '#FFFFFF',
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
    marginTop: 24,
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
    fontSize: 11,
    fontWeight: '500',
    color: '#5B616B',
  },
  legalDot: {
    fontSize: 11,
    color: '#5B616B',
    marginHorizontal: 8,
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
});
