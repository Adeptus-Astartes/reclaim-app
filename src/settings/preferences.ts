import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'reclaim.preferences';

export type ThemeMode = 'system' | 'light' | 'dark';
export type NavControl = 'backArrow' | 'floatingLogo';

export type LogoPosition = {
  x: number;
  y: number;
};

export type Preferences = {
  theme: ThemeMode;
  navControl: NavControl;
  logoPosition?: LogoPosition;
};

export const defaultPreferences: Preferences = {
  theme: 'system',
  navControl: 'backArrow',
};

export async function loadPreferences(): Promise<Preferences> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultPreferences;
  try {
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return { ...defaultPreferences, ...parsed };
  } catch {
    return defaultPreferences;
  }
}

export async function savePreferences(preferences: Preferences): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export async function clearPreferences(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
