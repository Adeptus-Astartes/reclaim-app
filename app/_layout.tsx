import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#101412' },
          headerTintColor: '#f3f6f4',
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: '#101412' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Reclaim' }} />
        <Stack.Screen name="[platform]" options={{ headerShown: true }} />
      </Stack>
    </>
  );
}
