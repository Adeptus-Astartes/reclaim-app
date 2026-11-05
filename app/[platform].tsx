import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingBackButton } from '../src/components/FloatingBackButton';
import { FloatingLogoButton } from '../src/components/FloatingLogoButton';
import { PlatformWebView } from '../src/components/PlatformWebView';
import { getPlatform } from '../src/platforms';
import { usePreferences } from '../src/settings/PreferencesProvider';
import { useTheme } from '../src/theme/useTheme';

export default function PlatformScreen() {
  const { platform } = useLocalSearchParams<{ platform: string }>();
  const id = Array.isArray(platform) ? platform[0] : platform;
  const adapter = id ? getPlatform(id) : undefined;
  const { colors } = useTheme();
  const { prefs } = usePreferences();

  if (!adapter) {
    return <MissingPlatform />;
  }

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.fill} edges={['top', 'right', 'bottom', 'left']}>
        <PlatformWebView adapter={adapter} />
      </SafeAreaView>
      {prefs.navControl === 'floatingLogo' ? <FloatingLogoButton /> : <FloatingBackButton />}
    </View>
  );
}

function MissingPlatform() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.missing,
        { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={[styles.missingTitle, { color: colors.text }]}>That app is not available yet.</Text>
      <Pressable onPress={() => router.replace('/')} style={[styles.back, { backgroundColor: colors.accent }]}>
        <Text style={[styles.backText, { color: colors.accentText }]}>Choose an app</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  missingTitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  back: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backText: {
    fontWeight: '700',
  },
});
