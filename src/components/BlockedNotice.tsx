import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/useTheme';

type Props = {
  platformName: string;
  onBackToFeed: () => void;
  onDismiss: () => void;
};

export function BlockedNotice({ platformName, onBackToFeed, onDismiss }: Props) {
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <View style={[styles.card, { backgroundColor: colors.notice }]}>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: colors.noticeText }]}>Short videos are blocked</Text>
          <Text style={[styles.body, { color: colors.noticeMuted }]}>Reclaim kept you on {platformName}.</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={onBackToFeed} style={[styles.primary, { backgroundColor: colors.accent }]}>
            <Text style={[styles.primaryText, { color: colors.accentText }]}>Back to feed</Text>
          </Pressable>
          <Pressable onPress={onDismiss} hitSlop={8} style={styles.dismiss}>
            <Text style={[styles.dismissText, { color: colors.noticeMuted }]}>Dismiss</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  copy: {
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primary: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dismiss: {
    paddingVertical: 8,
  },
  dismissText: {
    fontSize: 14,
  },
});
