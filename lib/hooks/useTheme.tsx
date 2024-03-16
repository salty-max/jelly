import { useEffect, useState } from 'react';

export enum Theme {
  ZINC = 'theme-zinc',
  ORANGE = 'theme-orange',
  RED = 'theme-red',
  BLUE = 'theme-blue',
  GREEN = 'theme-green',
}

const THEME_STORAGE_KEY = 'theme';

export const useTheme = () => {
  // State to store the current theme
  const [theme, setTheme] = useState<Theme>(() => {
    // Read theme from local storage or default
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme ? (storedTheme as Theme) : Theme.ZINC;
  });

  // State to store the current dark mode status
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    const currentTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (currentTheme) document.body.classList.remove(currentTheme);
    document.body.classList.add(theme);

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, isDarkMode]);

  return {
    theme,
    isDarkMode,
    applyTheme,
    toggleDarkMode,
  };
};
