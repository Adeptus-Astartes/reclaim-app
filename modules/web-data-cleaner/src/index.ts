import { requireNativeModule } from 'expo-modules-core';

type WebDataCleanerModule = {
  clearAllWebData(): Promise<void>;
};

const WebDataCleaner = requireNativeModule<WebDataCleanerModule>('WebDataCleaner');

export function clearAllWebData(): Promise<void> {
  return WebDataCleaner.clearAllWebData();
}
