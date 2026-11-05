import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, PanResponder, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePreferences } from '../settings/PreferencesProvider';
import type { LogoPosition } from '../settings/preferences';

const SIZE = 56;
const MARGIN = 12;
const TAP_SLOP = 6;

type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

type Gesture = {
  position: LogoPosition;
  grant: LogoPosition;
  bounds: Bounds;
  placed: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export function FloatingLogoButton() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { prefs, update } = usePreferences();
  const [pan] = useState(() => new Animated.ValueXY({ x: 0, y: 0 }));
  const gesture = useRef<Gesture>({
    position: { x: 0, y: 0 },
    grant: { x: 0, y: 0 },
    bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
    placed: false,
  });

  useEffect(() => {
    const current = gesture.current;
    const bounds = {
      minX: insets.left + MARGIN,
      minY: insets.top + MARGIN,
      maxX: Math.max(insets.left + MARGIN, width - insets.right - MARGIN - SIZE),
      maxY: Math.max(insets.top + MARGIN, height - insets.bottom - MARGIN - SIZE),
    };
    current.bounds = bounds;
    if (current.placed || width === 0 || height === 0) return;
    const next = {
      x: clamp(prefs.logoPosition?.x ?? bounds.maxX, bounds.minX, bounds.maxX),
      y: clamp(prefs.logoPosition?.y ?? bounds.maxY, bounds.minY, bounds.maxY),
    };
    current.position = next;
    pan.setValue(next);
    current.placed = true;
  }, [pan, width, height, insets.top, insets.bottom, insets.left, insets.right, prefs.logoPosition]);

  const [panHandlers, setPanHandlers] = useState<
    ReturnType<typeof PanResponder.create>['panHandlers'] | null
  >(null);

  useEffect(() => {
    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, event) =>
        Math.abs(event.dx) > TAP_SLOP || Math.abs(event.dy) > TAP_SLOP,
      onPanResponderGrant: () => {
        gesture.current.grant = gesture.current.position;
      },
      onPanResponderMove: (_, event) => {
        const current = gesture.current;
        const next = {
          x: clamp(current.grant.x + event.dx, current.bounds.minX, current.bounds.maxX),
          y: clamp(current.grant.y + event.dy, current.bounds.minY, current.bounds.maxY),
        };
        current.position = next;
        pan.setValue(next);
      },
      onPanResponderRelease: (_, event) => {
        if (Math.hypot(event.dx, event.dy) <= TAP_SLOP) {
          router.replace('/');
          return;
        }
        const current = gesture.current;
        const mid = (current.bounds.minX + current.bounds.maxX) / 2;
        const snapped = {
          x: current.position.x < mid ? current.bounds.minX : current.bounds.maxX,
          y: clamp(current.position.y, current.bounds.minY, current.bounds.maxY),
        };
        current.position = snapped;
        Animated.spring(pan, {
          toValue: snapped,
          useNativeDriver: false,
          bounciness: 0,
        }).start();
        update({ logoPosition: snapped });
      },
    });
    setPanHandlers(responder.panHandlers);
  }, [gesture, pan, update]);

  return (
    <Animated.View
      accessibilityRole="button"
      accessibilityLabel="Reclaim home"
      {...(panHandlers ?? {})}
      style={[styles.logo, { transform: pan.getTranslateTransform() }]}
    >
      <View style={styles.disc} />
      <Image source={require('../../assets/graphics/ui/logo_v1_floating.png')} style={styles.image} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    top: 0,
    width: SIZE,
    height: SIZE,
  },
  disc: {
    position: 'absolute',
    left: SIZE * 0.12,
    top: SIZE * 0.12,
    width: SIZE * 0.76,
    height: SIZE * 0.76,
    borderRadius: SIZE,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
});
