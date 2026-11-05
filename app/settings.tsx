import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { clearAllWebData } from '../modules/web-data-cleaner/src';
import { CheckIcon } from '../src/components/icons';
import { usePreferences } from '../src/settings/PreferencesProvider';
import type { NavControl, ThemeMode } from '../src/settings/preferences';
import { useTheme } from '../src/theme/useTheme';

const themes: { id: ThemeMode; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

const navControls: { id: NavControl; label: string }[] = [
  { id: 'backArrow', label: 'Back arrow' },
  { id: 'floatingLogo', label: 'Floating logo' },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { prefs, update, reset } = usePreferences();

  function confirmErase() {
    Alert.alert(
      'Erase all data?',
      'This signs you out of every site in Reclaim and resets your settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase',
          style: 'destructive',
          onPress: () => {
            void erase();
          },
        },
      ],
    );
  }

  async function erase() {
    try {
      await clearAllWebData();
      await reset();
      router.replace('/');
    } catch {
      Alert.alert('Could not erase data', 'Try again in a moment.');
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.section, { color: colors.mutedText }]}>Appearance</Text>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        {themes.map((theme, index) => (
          <OptionRow
            key={theme.id}
            label={theme.label}
            selected={prefs.theme === theme.id}
            divider={index > 0}
            onPress={() => update({ theme: theme.id })}
          />
        ))}
      </View>

      <Text style={[styles.section, { color: colors.mutedText }]}>Navigation</Text>
      <Text style={[styles.hint, { color: colors.mutedText }]}>How you return home from a site.</Text>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        {navControls.map((control, index) => (
          <OptionRow
            key={control.id}
            label={control.label}
            selected={prefs.navControl === control.id}
            divider={index > 0}
            onPress={() => update({ navControl: control.id })}
          />
        ))}
      </View>

      <Text style={[styles.section, { color: colors.mutedText }]}>Data</Text>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <Pressable onPress={confirmErase} style={styles.row}>
          <Text style={[styles.erase, { color: colors.danger }]}>Erase all data</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function OptionRow({
  label,
  selected,
  divider,
  onPress,
}: {
  label: string;
  selected: boolean;
  divider: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, divider && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      {selected ? <CheckIcon color={colors.text} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 8,
    paddingBottom: 40,
  },
  section: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  hint: {
    fontSize: 14,
    marginBottom: 4,
  },
  group: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
  },
  erase: {
    fontSize: 16,
    fontWeight: '600',
  },
});
