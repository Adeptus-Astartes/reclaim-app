import { StyleSheet, Text } from 'react-native';

import { useTheme } from '../theme/useTheme';

export function AppTitle() {
  const { colors } = useTheme();

  return <Text style={[styles.title, { color: colors.text }]}>Reclaim</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 40,
    letterSpacing: -1,
  },
});
