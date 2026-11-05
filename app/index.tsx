import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { platforms } from '../src/platforms';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 24 }]}>
      <Text style={styles.wordmark}>reclaim</Text>
      <Text style={styles.tagline}>Social apps, without the short-video feeds.</Text>
      <View style={styles.list}>
        {platforms.map((platform) => (
          <Pressable
            key={platform.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() =>
              router.push({
                pathname: '/[platform]',
                params: { platform: platform.id },
              })
            }
          >
            <View style={styles.mark}>
              <Text style={styles.markText}>{platform.name.slice(0, 1)}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{platform.name}</Text>
              <Text style={styles.cardMeta}>Short videos blocked</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101412',
    paddingHorizontal: 24,
  },
  wordmark: {
    color: '#f3f6f4',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 8,
    color: '#b7c2bb',
    fontSize: 17,
    lineHeight: 24,
    maxWidth: 280,
  },
  list: {
    marginTop: 36,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#1a2420',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardPressed: {
    opacity: 0.8,
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#24312b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: '#d7f26a',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    gap: 2,
  },
  cardTitle: {
    color: '#f3f6f4',
    fontSize: 17,
    fontWeight: '600',
  },
  cardMeta: {
    color: '#8f9c95',
    fontSize: 14,
  },
});
