import { Image, type ImageSourcePropType } from 'react-native';

type IconProps = {
  color: string;
  size?: number;
};

const sources = {
  back: require('../../assets/graphics/ui/back.png'),
  settings: require('../../assets/graphics/ui/settings.png'),
  check: require('../../assets/graphics/ui/checkmark.png'),
} satisfies Record<string, ImageSourcePropType>;

function Icon({ source, color, size }: { source: ImageSourcePropType; color: string; size: number }) {
  return (
    <Image source={source} tintColor={color} resizeMode="contain" style={{ width: size, height: size }} />
  );
}

export function BackIcon({ color, size = 22 }: IconProps) {
  return <Icon source={sources.back} color={color} size={size} />;
}

export function SettingsIcon({ color, size = 22 }: IconProps) {
  return <Icon source={sources.settings} color={color} size={size} />;
}

export function CheckIcon({ color, size = 18 }: IconProps) {
  return <Icon source={sources.check} color={color} size={size} />;
}
