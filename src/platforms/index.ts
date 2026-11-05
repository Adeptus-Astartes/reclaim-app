import { instagram } from './instagram';
import type { PlatformAdapter } from './types';

/** Add a platform by defining an adapter and appending it here. */
export const platforms: PlatformAdapter[] = [instagram];

export function getPlatform(id: string): PlatformAdapter | undefined {
  return platforms.find((platform) => platform.id === id);
}

export type { PlatformAdapter, PlatformFeedRule } from './types';
