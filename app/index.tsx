import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTitle } from '../src/components/AppTitle';
import { SettingsIcon } from '../src/components/icons';
import { platforms } from '../src/platforms';
import { useTheme } from '../src/theme/useTheme';

const platformIcons: Partial<Record<string, ImageSourcePropType>> = {
  instagram: require('../assets/graphics/vendors/ig.png'),
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.heading}>
          <AppTitle />
          <Text style={[styles.tagline, { color: colors.mutedText }]}>
            Take back your time and attention.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [
            styles.gear,
            { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <SettingsIcon color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.list}>
        {platforms.map((platform) => (
          <Pressable
            key={platform.id}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() =>
              router.push({
                pathname: '/[platform]',
                params: { platform: platform.id },
              })
            }
          >
            <View
              style={[
                styles.mark,
                platformIcons[platform.id] ? null : { backgroundColor: colors.surfaceRaised },
              ]}
            >
              {platformIcons[platform.id] ? (
                <Image source={platformIcons[platform.id]!} style={styles.markImage} />
              ) : (
                <Text style={[styles.markText, { color: colors.text }]}>{platform.name.slice(0, 1)}</Text>
              )}
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{platform.name}</Text>
              <Text style={[styles.cardMeta, { color: colors.mutedText }]}>Short videos blocked</Text>
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
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  heading: {
    flex: 1,
    gap: 8,
  },
  tagline: {
    fontSize: 17,
    lineHeight: 24,
    maxWidth: 280,
  },
  gear: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    marginTop: 36,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markImage: {
    width: 44,
    height: 44,
  },
  markText: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    gap: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cardMeta: {
    fontSize: 14,
  },
});
