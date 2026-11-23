import { sampleStaffUser } from '@xtreme/mock-data';
import { MockAuthProvider } from '@xtreme/ui';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <MockAuthProvider initialUser={sampleStaffUser}>
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: '#FAF8F4' },
          headerTintColor: '#0B0C0E',
        }}
      />
    </MockAuthProvider>
  );
}
