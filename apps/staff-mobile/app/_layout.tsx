import { MockAuthProvider } from '@xtreme/ui';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Staff Mobile Root Layout
 * - Initializes unauthenticated session by default.
 * - Suppresses duplicate Expo Router navigation headers.
 * - Wraps in SafeAreaProvider for accurate physical notch/insets handling.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MockAuthProvider initialAuthenticated={false} initialUser={null}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FAF8F4' },
          }}
        />
      </MockAuthProvider>
    </SafeAreaProvider>
  );
}
