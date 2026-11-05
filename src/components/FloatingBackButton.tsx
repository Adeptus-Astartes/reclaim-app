import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme/useTheme';
import { BackIcon } from './icons';

export function FloatingBackButton() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to home"
      onPress={() => {
        if (router.canGoBack()) router.back();
        else router.replace('/');
      }}
      style={[
        styles.button,
        {
          top: insets.top + 8,
          left: insets.left + 12,
          backgroundColor: colors.floating,
        },
      ]}
    >
      <BackIcon color={colors.floatingText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
