import assert from 'node:assert/strict';

import { buildInjectedScript } from './buildInjectedScript';
import { evaluateNavigation } from './urlGuard';
import { instagram } from '../platforms/instagram';

function expectAction(url: string, action: 'allow' | 'block' | 'external', isTopFrame = true) {
  const decision = evaluateNavigation(instagram, { url, isTopFrame });
  assert.equal(decision.action, action, url);
  return decision;
}

expectAction('https://www.instagram.com/', 'allow');
expectAction('https://www.instagram.com/reels/', 'block');
expectAction('https://www.instagram.com/reels', 'block');
expectAction('https://www.instagram.com/reels/DezPoWNzXMt/', 'block');
expectAction('https://www.instagram.com/jasondchen/reels/', 'block');
expectAction('https://www.instagram.com/jasondchen/reel/abc/', 'block');
expectAction('https://www.instagram.com/jasondchen/', 'allow');
expectAction('https://www.instagram.com/p/abc123/', 'allow');
expectAction('https://instagram.com/reels/?hl=en', 'block');
expectAction('https://www.instagram.com/reel/abc123/', 'block');
expectAction('https://www.instagram.com/explore/reels/', 'block');
expectAction('https://www.instagram.com/explore/reels', 'block');
expectAction('https://www.instagram.com/explore/', 'allow');
expectAction('https://www.instagram.com/direct/inbox/', 'allow');
expectAction('https://www.instagram.com/stories/someone/', 'allow');
expectAction('https://www.instagram.com/someuser/', 'allow');
expectAction('https://www.instagram.com/accounts/login/', 'allow');
expectAction('https://www.instagram.com/reelsomething/', 'allow');
expectAction('https://www.facebook.com/login.php', 'allow');
expectAction('https://m.facebook.com/', 'allow');
expectAction('https://example.com/reels/', 'external');
expectAction('instagram://reels', 'external');
expectAction('about:blank', 'allow');
expectAction('https://example.com/pixel', 'allow', false);

const blocked = expectAction('https://www.instagram.com/reel/xyz/', 'block');
if (blocked.action === 'block') {
  assert.equal(blocked.redirectUrl, 'https://www.instagram.com/');
  assert.equal(blocked.path, '/reel/xyz/');
}

const script = buildInjectedScript(instagram);
new Function(script);
assert.match(script, /MutationObserver/);
assert.match(script, /pushState/);
assert.match(script, /popstate/);
assert.match(script, /ReactNativeWebView/);
assert.match(script, /reels/);

console.log('url guard and injected script ok');
