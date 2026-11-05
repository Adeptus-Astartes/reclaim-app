export interface PlatformFeedRule {
  /** Element that wraps one feed item, for example `article`. */
  containerSelector: string;
  /** If a container matches or contains any of these, it is hidden. */
  blockIfContains: string[];
}

/**
 * Declarative description of one social site.
 * The shared engine applies this; adding a site later is a new adapter file.
 * Patterns are serialized into the injected script, so a future version can
 * load the same shape from remote JSON.
 */
export interface PlatformAdapter {
  id: string;
  name: string;
  /** First page the WebView opens. */
  homeUrl: string;
  /**
   * Hosts that stay inside the WebView, matched exactly or as a parent domain
   * (`instagram.com` allows `www.instagram.com`). Anything else opens externally.
   */
  allowedHosts: string[];
  userAgent?: string;
  /** Tested against the URL pathname. */
  blockedPaths: RegExp[];
  /** Path to load instead of a blocked page. Resolved against `homeUrl`. */
  redirectTo: string;
  /** CSS selectors hidden as soon as the document exists. */
  hideSelectors: string[];
  feed?: PlatformFeedRule;
  /**
   * Extra JavaScript that runs inside the page guard, after `onSweep` is defined.
   * Call `onSweep(fn)` to run `fn` on each batched DOM pass.
   */
  extraScript?: string;
}
