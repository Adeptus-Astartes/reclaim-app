import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { ShouldStartLoadRequest, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

import { buildInjectedScript } from '../engine/buildInjectedScript';
import { evaluateNavigation, redirectUrlFor } from '../engine/urlGuard';
import type { PlatformAdapter } from '../platforms/types';
import { useTheme } from '../theme/useTheme';
import { BlockedNotice } from './BlockedNotice';

const MOBILE_USER_AGENT = {
  ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  android:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
};

type Props = {
  adapter: PlatformAdapter;
};

export function PlatformWebView({ adapter }: Props) {
  const { colors } = useTheme();
  const webRef = useRef<WebView<Record<string, unknown>>>(null);
  const canGoBack = useRef(false);
  const redirecting = useRef(false);
  const [loading, setLoading] = useState(true);
  const [blockedPath, setBlockedPath] = useState<string | null>(null);

  const script = useMemo(() => buildInjectedScript(adapter), [adapter]);
  const userAgent =
    adapter.userAgent ?? (Platform.OS === 'android' ? MOBILE_USER_AGENT.android : MOBILE_USER_AGENT.ios);

  const showBlocked = useCallback((path: string) => {
    setBlockedPath(path);
  }, []);

  const dismissBlocked = useCallback(() => {
    setBlockedPath(null);
  }, []);

  const goToFeed = useCallback(() => {
    const target = redirectUrlFor(adapter);
    webRef.current?.injectJavaScript(`window.location.replace(${JSON.stringify(target)}); true;`);
    setBlockedPath(null);
  }, [adapter]);

  const redirectAway = useCallback(
    (redirectUrl: string, path: string) => {
      showBlocked(path);
      if (redirecting.current) return;
      redirecting.current = true;
      webRef.current?.injectJavaScript(`window.location.replace(${JSON.stringify(redirectUrl)}); true;`);
      setTimeout(() => {
        redirecting.current = false;
      }, 600);
    },
    [showBlocked],
  );

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack.current) return false;
      webRef.current?.goBack();
      return true;
    });
    return () => subscription.remove();
  }, []);

  const onShouldStartLoadWithRequest = useCallback(
    (request: ShouldStartLoadRequest) => {
      const decision = evaluateNavigation(adapter, request);
      if (decision.action === 'allow') return true;
      if (decision.action === 'external') {
        Linking.openURL(request.url).catch(() => {});
        return false;
      }
      redirectAway(decision.redirectUrl, decision.path);
      return false;
    },
    [adapter, redirectAway],
  );

  const onNavigationStateChange = useCallback(
    (nav: WebViewNavigation) => {
      canGoBack.current = nav.canGoBack;
      const decision = evaluateNavigation(adapter, { url: nav.url, isTopFrame: true });
      if (decision.action === 'block') {
        redirectAway(decision.redirectUrl, decision.path);
      }
    },
    [adapter, redirectAway],
  );

  const onMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message = JSON.parse(event.nativeEvent.data) as { type?: string; path?: string };
        if (message.type === 'blocked' && message.path) showBlocked(message.path);
      } catch {
        // Pages can post unrelated messages. Ignore them.
      }
    },
    [showBlocked],
  );

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      <WebView<Record<string, unknown>>
        ref={webRef}
        source={{ uri: adapter.homeUrl }}
        style={styles.fill}
        userAgent={userAgent}
        originWhitelist={['*']}
        injectedJavaScriptBeforeContentLoaded={script}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={onMessage}
        onLoadEnd={() => setLoading(false)}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        domStorageEnabled
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
        allowsBackForwardNavigationGestures
        setSupportMultipleWindows={false}
        autoManageStatusBarEnabled={false}
      />
      {loading ? (
        <View style={[styles.loading, { backgroundColor: colors.background }]}>
          <ActivityIndicator color={colors.text} />
        </View>
      ) : null}
      {blockedPath ? (
        <BlockedNotice platformName={adapter.name} onBackToFeed={goToFeed} onDismiss={dismissBlocked} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
