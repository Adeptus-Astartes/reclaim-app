export type ThemeColors = {
  background: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  mutedText: string;
  accent: string;
  accentText: string;
  border: string;
  notice: string;
  noticeText: string;
  noticeMuted: string;
  danger: string;
  floating: string;
  floatingText: string;
};

export const darkColors: ThemeColors = {
  background: '#101412',
  surface: '#1a2420',
  surfaceRaised: '#24312b',
  text: '#f3f6f4',
  mutedText: '#8f9c95',
  accent: '#d7f26a',
  accentText: '#142016',
  border: '#2a3530',
  notice: '#17211c',
  noticeText: '#f3f6f4',
  noticeMuted: '#b7c2bb',
  danger: '#e15b4f',
  floating: 'rgba(20, 32, 22, 0.82)',
  floatingText: '#f3f6f4',
};

export const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#f3f5f4',
  surfaceRaised: '#e6ece8',
  text: '#142016',
  mutedText: '#5e6d66',
  accent: '#d7f26a',
  accentText: '#142016',
  border: '#e1e7e3',
  notice: '#17211c',
  noticeText: '#f3f6f4',
  noticeMuted: '#b7c2bb',
  danger: '#b42318',
  floating: 'rgba(255, 255, 255, 0.92)',
  floatingText: '#142016',
};

export const palettes = {
  light: lightColors,
  dark: darkColors,
} as const;
