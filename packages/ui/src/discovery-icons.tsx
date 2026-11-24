import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

export interface SvgIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Figma 1048:14335 - Icon/Location Pin
 */
export function LocationPinIcon({ size = 18, color = '#164D53' }: SvgIconProps) {
  return (
    <Svg width={size} height={size * (18 / 16)} viewBox="0 0 16 18" fill="none">
      <Path
        d="M8 17C8 17 14 11.5 14 6.75C14 3.57 11.31 1 8 1C4.69 1 2 3.57 2 6.75C2 11.5 8 17 8 17Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 8.95C9.21503 8.95 10.2 7.96503 10.2 6.75C10.2 5.53497 9.21503 4.55 8 4.55C6.78497 4.55 5.8 5.53497 5.8 6.75C5.8 7.96503 6.78497 8.95 8 8.95Z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * Figma 1048:14342 - Icon/Chevron Down
 */
export function ChevronDownIcon({ size = 10, color = '#164D53' }: SvgIconProps) {
  return (
    <Svg width={size} height={size * (8 / 10)} viewBox="0 0 10 8" fill="none">
      <Path
        d="M1.5 2.25L5 5.75L8.5 2.25"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Figma 769:2932 / 324:2834 - Icon/Chevron Right
 */
export function ChevronRightIcon({ size = 12, color = '#164D53' }: SvgIconProps) {
  return (
    <Svg width={size * (8 / 12)} height={size} viewBox="0 0 8 12" fill="none">
      <Path
        d="M2 1.5L6.5 6L2 10.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Figma 264:257 - Icon/Search
 */
export function SearchIcon({ size = 20, color = '#164D53' }: SvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 10.5C17 14.0899 14.0899 17 10.5 17C6.91015 17 4 14.0899 4 10.5C4 6.91015 6.91015 4 10.5 4C14.0899 4 17 6.91015 17 10.5Z"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path d="M15.5 15.5L20.5 20.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Figma 1048:14321 - Notification Bell with Red Dot
 */
export function BellNotificationIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect x={6} y={4} width={36} height={36} rx={18} fill="#FFFFFF" />
      <Path
        d="M29 18.6667C29 17.3406 28.4732 16.0688 27.5355 15.1311C26.5979 14.1935 25.3261 13.6667 24 13.6667C22.6739 13.6667 21.4021 14.1935 20.4645 15.1311C19.5268 16.0688 19 17.3406 19 18.6667C19 24.0833 16.9167 24.6667 16.5 25.75H31.5C31.0833 24.6667 29 24.0833 29 18.6667Z"
        stroke="#164D53"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path d="M22.3333 28.6667H25.6667" stroke="#164D53" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={34} cy={11} r={4} fill="#F53038" />
    </Svg>
  );
}

/**
 * Figma 805:533 - NavIcon/Home
 */
export function NavHomeIcon({ active = true, size = 24 }: { active?: boolean; size?: number }) {
  const color = active ? '#164D53' : '#5B616B';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L19.7942 12.5H4.20577L12 2Z" stroke={color} strokeWidth={2} />
      <Rect
        x={5.75}
        y={12.75}
        width={12.5}
        height={8.5}
        rx={1.25}
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

/**
 * Figma 805:539 - NavIcon/Bookings
 */
export function NavBookingsIcon({
  active = false,
  size = 24,
}: {
  active?: boolean;
  size?: number;
}) {
  const color = active ? '#164D53' : '#5B616B';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3.75}
        y={4.75}
        width={16.5}
        height={14.5}
        rx={2.25}
        stroke={color}
        strokeWidth={1.5}
      />
      <Line x1={6} y1={8.25} x2={18} y2={8.25} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

/**
 * Figma 805:545 - NavIcon/Concierge
 */
export function NavConciergeIcon({
  active = false,
  size = 24,
}: {
  active?: boolean;
  size?: number;
}) {
  const color = active ? '#164D53' : '#5B616B';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3.75}
        y={5.75}
        width={16.5}
        height={12.5}
        rx={4.25}
        stroke={color}
        strokeWidth={1.5}
      />
      <Circle cx={8.5} cy={12.5} r={1.5} fill={color} />
      <Circle cx={15.5} cy={12.5} r={1.5} fill={color} />
    </Svg>
  );
}

/**
 * Figma 805:551 - NavIcon/Profile
 */
export function NavProfileIcon({ active = false, size = 24 }: { active?: boolean; size?: number }) {
  const color = active ? '#164D53' : '#5B616B';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={7} r={3.25} stroke={color} strokeWidth={1.5} />
      <Rect
        x={3.75}
        y={13.75}
        width={16.5}
        height={7.5}
        rx={3.75}
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

/**
 * Category Circular Badge Vector Icons (16x16 on 32x32 circular badge)
 */
export function CategoryBadgeIcon({
  category,
  size = 15,
}: {
  category: 'Airport Transfer' | 'Luxury Cars' | 'Villas' | 'Yachts' | 'Activities' | 'Nightlife';
  size?: number;
}) {
  switch (category) {
    case 'Airport Transfer':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M2 11L14 5.66667M5.33333 10L3.66667 13.3333M9.66667 8.33333L11.6667 12M6.66667 3.33333L8 7.33333"
            stroke="white"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M2.66667 7L5.66667 8.33333L12.3333 5.66667L10.3333 3.66667"
            stroke="white"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'Luxury Cars':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M2.66667 9.33333L4.13333 6.33333C4.4 5.73333 4.93333 5.33333 5.6 5.33333H10.4C11.0667 5.33333 11.6 5.73333 11.8667 6.33333L13.3333 9.33333"
            stroke="white"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d="M2 9.33333H14V12.3333C14 12.8667 13.5333 13.3333 13 13.3333H12C11.4667 13.3333 11 12.8667 11 12.3333H5C5 12.8667 4.53333 13.3333 4 13.3333H3C2.46667 13.3333 2 12.8667 2 12.3333V9.33333Z"
            stroke="white"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M4.33333 10.6667H5M11 10.6667H11.6667"
            stroke="white"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'Villas':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M2 7.33333L8 2.66667L14 7.33333"
            stroke="white"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M3.66667 6.66667V13.3333H12.3333V6.66667M6.33333 13.3333V9.33333H9.66667V13.3333"
            stroke="white"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'Yachts':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M2.66667 11.3333H13.3333L11.6667 13.3333H4.66667L2.66667 11.3333Z"
            stroke="white"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M8 2.66667V10.6667M8 3.33333L4 9.33333H8M8.66667 4L12 9.33333H8.66667"
            stroke="white"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'Activities':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M13.3333 8C13.3333 10.9455 10.9455 13.3333 8 13.3333C5.05448 13.3333 2.66667 10.9455 2.66667 8C2.66667 5.05448 5.05448 2.66667 8 2.66667C10.9455 2.66667 13.3333 5.05448 13.3333 8Z"
            stroke="white"
            strokeWidth={1.8}
          />
          <Path
            d="M10 6L8.66667 8.66667L6 10L7.33333 7.33333L10 6Z"
            stroke="white"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'Nightlife':
      return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
          <Path
            d="M3.33333 3.33333H12.6667L8 8.66667L3.33333 3.33333Z"
            stroke="white"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M8 8.66667V12.6667M6 13.3333H10"
            stroke="white"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );
  }
}
