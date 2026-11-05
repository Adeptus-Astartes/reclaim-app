import type { PlatformAdapter } from './types';

/**
 * Instagram mobile web. Reels routes and in-feed Reels are blocked.
 * Posts, stories, explore, and DMs stay available.
 */
export const instagram: PlatformAdapter = {
  id: 'instagram',
  name: 'Instagram',
  homeUrl: 'https://www.instagram.com/',
  allowedHosts: ['instagram.com', 'facebook.com', 'fb.com'],
  blockedPaths: [
    /^\/reels(\/|$)/,
    /^\/reel\//,
    /^\/explore\/reels(\/|$)/,
    // Profile tabs and clips: /username/reels/ and /username/reel/...
    /^\/[^/]+\/reels(\/|$)/,
    /^\/[^/]+\/reel\//,
  ],
  redirectTo: '/',
  hideSelectors: [
    'a[href="/reels"]',
    'a[href="/reels/"]',
    'a[href^="/reels/"]',
    'a[href^="/reels?"]',
    'a[href*="/reel/"]',
    'a[href*="/reels/"]',
    'a[href$="/reels"]',
    'a[href*="applink.instagram.com"]',
    'a[href^="instagram://"]',
    '[aria-label="Reels"]',
    '[aria-label="Reel"]',
  ],
  feed: {
    containerSelector: 'article',
    blockIfContains: ['a[href*="/reel/"]', 'a[href*="/reels/"]', 'a[href$="/reels"]'],
  },
  extraScript: String.raw`
    onSweep(function () {
      var nodes = document.querySelectorAll('a, button, [role="tab"]');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var text = (node.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        if (
          text === 'reels' ||
          text === 'open app' ||
          text === 'open instagram' ||
          text === 'use the app' ||
          text === 'get the app'
        ) {
          node.style.setProperty('display', 'none', 'important');
        }
      }
      var links = document.querySelectorAll('a[href*="/reel/"], a[href*="/reels/"], a[href$="/reels"]');
      for (var j = 0; j < links.length; j++) {
        var link = links[j];
        if (link.closest('article')) continue;
        var parent = link.parentElement;
        if (!parent || parent === document.body || parent === document.documentElement) continue;
        if (parent.querySelectorAll('a').length === 1) {
          parent.style.setProperty('display', 'none', 'important');
        }
      }
    });
  `,
};
