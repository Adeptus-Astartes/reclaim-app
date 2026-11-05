import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PlatformWebView } from '../src/components/PlatformWebView';
import { getPlatform } from '../src/platforms';

export default function PlatformScreen() {
  const { platform } = useLocalSearchParams<{ platform: string }>();
  const id = Array.isArray(platform) ? platform[0] : platform;
  const adapter = id ? getPlatform(id) : undefined;

  if (!adapter) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Reclaim' }} />
        <Text style={styles.missingTitle}>That app is not available yet.</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.back}>
          <Text style={styles.backText}>Choose an app</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: adapter.name }} />
      <PlatformWebView adapter={adapter} />
    </>
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    backgroundColor: '#101412',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  missingTitle: {
    color: '#f3f6f4',
    fontSize: 17,
    textAlign: 'center',
  },
  back: {
    backgroundColor: '#d7f26a',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backText: {
    color: '#142016',
    fontWeight: '700',
  },
});
