import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  clearPreferences,
  defaultPreferences,
  loadPreferences,
  savePreferences,
  type Preferences,
} from './preferences';

type PreferencesContextValue = {
  prefs: Preferences;
  ready: boolean;
  update: (partial: Partial<Preferences>) => void;
  reset: () => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadPreferences()
      .then((stored) => {
        if (active) setPrefs(stored);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((partial: Partial<Preferences>) => {
    setPrefs((current) => {
      const next = { ...current, ...partial };
      void savePreferences(next);
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    setPrefs(defaultPreferences);
    await clearPreferences();
  }, []);

  const value = useMemo(() => ({ prefs, ready, update, reset }), [prefs, ready, update, reset]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return value;
}
