import React from 'react';
import { themes } from '../styles/themes';

const themesNames = [
  'none',
  'zinc',
  'slate',
  'stone',
  'neutral',
  'gray',
  'orange',
  'rose',
  'red',
  'blue',
  'green',
  'yellow',
  'violet',
];
type ThemeTuple = typeof themesNames;
type Theme = ThemeTuple[number];
type DarkMode = 'enabled' | 'disabled';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme?: Theme;
  darkMode: DarkMode;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
}

const initialState: ThemeProviderState = {
  theme: undefined,
  darkMode: 'disabled',
  setTheme: () => null,
  toggleDarkMode: () => null,
};

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

const ThemeProvider = ({
  children,
  defaultTheme,
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = React.useState<Theme>(
    () => localStorage.getItem(storageKey)! ?? defaultTheme,
  );
  const [darkMode, setDarkMode] = React.useState<DarkMode>(
    () =>
      (localStorage.getItem('dark-mode') as DarkMode) ??
      window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('dark');

    if (darkMode === 'enabled') root.classList.add('dark');

    if (theme) {
      const selectedTheme = themes[theme];
      const lightVars = selectedTheme.light;
      const darkVars = selectedTheme.dark;

      const rootCssText = Object.entries(lightVars)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n');

      const darkCssText = Object.entries(darkVars)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n');

      const styleElement = document.createElement('style');

      styleElement.textContent = `
        :root {
          ${rootCssText}
        }
        .dark {
          ${darkCssText}
        }
      `;

      document.head.appendChild(styleElement);
    }
  }, [theme, darkMode]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    darkMode,
    toggleDarkMode: () => {
      localStorage.setItem(
        'dark-mode',
        darkMode === 'enabled' ? 'disabled' : 'enabled',
      );
      setDarkMode(darkMode === 'enabled' ? 'disabled' : 'enabled');
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useTheme, themesNames as themes };
export type { Theme };
