import type { PlatformAdapter } from '../platforms/types';

const PASSTHROUGH = /^(about:blank|about:srcdoc|blob:|data:)/i;

export type GuardDecision =
  | { action: 'allow' }
  | { action: 'block'; redirectUrl: string; path: string }
  | { action: 'external' };

export function isBlockedPath(adapter: PlatformAdapter, pathname: string): boolean {
  return adapter.blockedPaths.some((pattern) => pattern.test(pathname));
}

export function hostAllowed(hostname: string, allowedHosts: string[]): boolean {
  const host = hostname.toLowerCase();
  return allowedHosts.some((entry) => {
    const allowed = entry.toLowerCase();
    return host === allowed || host.endsWith(`.${allowed}`);
  });
}

export function redirectUrlFor(adapter: PlatformAdapter): string {
  return new URL(adapter.redirectTo, adapter.homeUrl).href;
}

/**
 * Decides what the WebView should do with a navigation.
 * Subframes and non-document URLs are allowed so images and API calls still load.
 */
export function evaluateNavigation(
  adapter: PlatformAdapter,
  request: { url: string; isTopFrame?: boolean },
): GuardDecision {
  const { url } = request;
  if (!url || request.isTopFrame === false || PASSTHROUGH.test(url)) {
    return { action: 'allow' };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { action: 'external' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { action: 'external' };
  }

  if (!hostAllowed(parsed.hostname, adapter.allowedHosts)) {
    return { action: 'external' };
  }

  if (isBlockedPath(adapter, parsed.pathname)) {
    return {
      action: 'block',
      redirectUrl: redirectUrlFor(adapter),
      path: parsed.pathname,
    };
  }

  return { action: 'allow' };
}
