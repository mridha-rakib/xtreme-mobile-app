import { colors, palette, radii, shadows, spacing, typography } from '@xtreme/design-tokens';
import type { AssignmentStatus, BookingStatus, UserProfile } from '@xtreme/types';
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
  isAuthenticated: true,
  currentUser: null,
  login: () => {},
  logout: () => {},
});

export function MockAuthProvider({
  children,
  initialUser,
  initialAuthenticated = true,
}: {
  children: ReactNode;
  initialUser?: UserProfile | null;
  initialAuthenticated?: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUser ?? null);

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
});
