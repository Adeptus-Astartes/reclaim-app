import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  platformName: string;
  onBackToFeed: () => void;
  onDismiss: () => void;
};

export function BlockedNotice({ platformName, onBackToFeed, onDismiss }: Props) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 16 }]}>
      <View style={styles.card}>
        <View style={styles.copy}>
          <Text style={styles.title}>Short videos are blocked</Text>
          <Text style={styles.body}>Reclaim kept you on {platformName}.</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={onBackToFeed} style={styles.primary}>
            <Text style={styles.primaryText}>Back to feed</Text>
          </Pressable>
          <Pressable onPress={onDismiss} hitSlop={8} style={styles.dismiss}>
            <Text style={styles.dismissText}>Dismiss</Text>
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
    backgroundColor: '#17211c',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  copy: {
    gap: 2,
  },
  title: {
    color: '#f3f6f4',
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    color: '#b7c2bb',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primary: {
    backgroundColor: '#d7f26a',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  primaryText: {
    color: '#142016',
    fontSize: 14,
    fontWeight: '700',
  },
  dismiss: {
    paddingVertical: 8,
  },
  dismissText: {
    color: '#d5ddd8',
    fontSize: 14,
  },
});
