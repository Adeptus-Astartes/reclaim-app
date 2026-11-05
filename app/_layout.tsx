import { Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { BackIcon } from '../src/components/icons';
import { PreferencesProvider, usePreferences } from '../src/settings/PreferencesProvider';
import { useTheme } from '../src/theme/useTheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Montserrat_800ExtraBold });

  return (
    <PreferencesProvider>
      <RootNavigator fontsReady={fontsLoaded || Boolean(fontError)} />
    </PreferencesProvider>
  );
}

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { ready } = usePreferences();
  const { mode, colors } = useTheme();

  useEffect(() => {
    if (fontsReady && ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsReady, ready]);

  if (!fontsReady || !ready) return null;

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.replace('/');
              }}
              hitSlop={8}
              style={styles.headerBack}
            >
              <BackIcon color={colors.text} />
            </Pressable>
          ),
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Reclaim' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="[platform]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  headerBack: {
    marginLeft: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
