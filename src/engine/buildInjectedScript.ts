import type { PlatformAdapter } from '../platforms/types';

/**
 * Page script applied to every platform. It hides selectors, refuses blocked
 * history navigations, and strips matching feed items as the DOM changes.
 * `extraScript` runs in this closure and may call `onSweep(fn)`.
 */
export function buildInjectedScript(adapter: PlatformAdapter): string {
  const config = {
    blockedPaths: adapter.blockedPaths.map((pattern) => ({
      source: pattern.source,
      flags: pattern.flags,
    })),
    redirectTo: adapter.redirectTo,
    hideSelectors: adapter.hideSelectors,
    feed: adapter.feed ?? null,
  };

  return `;(function () {
  if (window.__reclaim) return true;
  var config = ${JSON.stringify(config)};
  var blocked = config.blockedPaths.map(function (item) {
    return new RegExp(item.source, item.flags);
  });

  function pathOf(input) {
    try {
      return new URL(String(input), location.origin).pathname;
    } catch (e) {
      return '';
    }
  }

  function isBlocked(pathname) {
    for (var i = 0; i < blocked.length; i++) {
      if (blocked[i].test(pathname)) return true;
    }
    return false;
  }

  function notify(pathname) {
    if (!window.ReactNativeWebView || !pathname) return;
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'blocked', path: pathname }));
  }

  function leave(pathname) {
    notify(pathname);
    if (location.pathname !== config.redirectTo) {
      location.replace(config.redirectTo);
    }
  }

  function installStyle() {
    if (!config.hideSelectors.length) return;
    var css = config.hideSelectors
      .map(function (selector) {
        return selector + '{display:none !important;}';
      })
      .join('');
    var style = document.getElementById('reclaim-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'reclaim-style';
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = css;
  }

  var sweepHooks = [];
  function onSweep(fn) {
    sweepHooks.push(fn);
  }

  function hideContainer(el) {
    if (!el || el.getAttribute('data-reclaim-hidden') === '1') return;
    el.style.setProperty('display', 'none', 'important');
    el.setAttribute('data-reclaim-hidden', '1');
    var videos = el.querySelectorAll ? el.querySelectorAll('video') : [];
    for (var v = 0; v < videos.length; v++) {
      try {
        videos[v].pause();
      } catch (e) {}
    }
  }

  function hideFeedNode(node) {
    if (!config.feed || !node) return;
    if (node.nodeType === 11) {
      var kids = node.childNodes;
      for (var k = 0; k < kids.length; k++) hideFeedNode(kids[k]);
      return;
    }
    if (node.nodeType !== 1) return;
    var selectors = config.feed.blockIfContains;
    var containerSelector = config.feed.containerSelector;
    var containers = [];
    try {
      if (node.matches && node.matches(containerSelector)) containers.push(node);
      if (node.closest) {
        var parent = node.closest(containerSelector);
        if (parent) containers.push(parent);
      }
      if (node.querySelectorAll) {
        var nested = node.querySelectorAll(containerSelector);
        for (var i = 0; i < nested.length; i++) containers.push(nested[i]);
      }
    } catch (e) {
      return;
    }
    for (var c = 0; c < containers.length; c++) {
      var el = containers[c];
      if (el.getAttribute('data-reclaim-hidden') === '1') continue;
      for (var s = 0; s < selectors.length; s++) {
        try {
          if (
            (el.matches && el.matches(selectors[s])) ||
            (el.querySelector && el.querySelector(selectors[s]))
          ) {
            hideContainer(el);
            break;
          }
        } catch (err) {}
      }
    }
  }

  var pending = [];
  var scheduled = false;
  function schedule(node) {
    pending.push(node);
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      var batch = pending;
      pending = [];
      for (var i = 0; i < batch.length; i++) hideFeedNode(batch[i]);
      for (var h = 0; h < sweepHooks.length; h++) {
        try {
          sweepHooks[h]();
        } catch (e) {}
      }
    });
  }

  try {
    ${adapter.extraScript ?? ''}
  } catch (e) {}

  var pushState = history.pushState;
  var replaceState = history.replaceState;
  history.pushState = function (state, title, url) {
    if (url != null && isBlocked(pathOf(url))) {
      leave(pathOf(url));
      return;
    }
    return pushState.apply(history, arguments);
  };
  history.replaceState = function (state, title, url) {
    if (url != null && isBlocked(pathOf(url))) {
      leave(pathOf(url));
      return;
    }
    return replaceState.apply(history, arguments);
  };
  window.addEventListener('popstate', function () {
    if (isBlocked(location.pathname)) leave(location.pathname);
  });

  function start() {
    installStyle();
    if (isBlocked(location.pathname)) {
      leave(location.pathname);
      return;
    }
    if (!config.feed && !sweepHooks.length) return;
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.type === 'attributes') schedule(mutation.target);
        var added = mutation.addedNodes;
        for (var j = 0; j < added.length; j++) schedule(added[j]);
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href'],
    });
    schedule(document.body || document.documentElement);
  }

  window.__reclaim = true;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
true;`;
}
