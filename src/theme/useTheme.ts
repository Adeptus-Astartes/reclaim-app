import { useColorScheme } from 'react-native';

import { usePreferences } from '../settings/PreferencesProvider';
import { palettes } from './tokens';

export type ResolvedTheme = 'light' | 'dark';

export function useTheme() {
  const { prefs } = usePreferences();
  const systemScheme = useColorScheme();
  const mode: ResolvedTheme =
    prefs.theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : prefs.theme;

  return { mode, colors: palettes[mode] };
}
