import React from 'react';

type Theme = 'neutral' | 'zinc' | 'orange' | 'red' | 'blue' | 'green';
type DarkMode = 'enabled' | 'disabled';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  darkMode: DarkMode;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
}

const initialState: ThemeProviderState = {
  theme: 'neutral',
  darkMode: 'disabled',
  setTheme: () => null,
  toggleDarkMode: () => null,
};

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

const ThemeProvider = ({
  children,
  defaultTheme = 'neutral',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) ?? defaultTheme,
  );
  const [darkMode, setDarkMode] = React.useState<DarkMode>(
    () => (localStorage.getItem('dark-mode') as DarkMode) ?? 'disabled',
  );

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.forEach((className) => {
      if (className.startsWith('theme-')) {
        root.classList.remove(className);
      }
    });
    root.classList.remove('dark');

    root.classList.add(`theme-${theme}`);
    if (
      darkMode === 'enabled' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      root.classList.add('dark');
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

export { ThemeProvider, useTheme };
export type { Theme };
