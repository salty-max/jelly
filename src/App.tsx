import { cn } from '../lib/common/utils';
import { Button, themes, useTheme } from '../lib';

function App() {
  const { setTheme, darkMode, toggleDarkMode } = useTheme();

  return (
    <main data-testid="app-wrapper" className="p-4">
      <div className="flex space-x-4">
        <Button
          icon={darkMode === 'enabled' ? 'Moon' : 'Sun'}
          onClick={toggleDarkMode}
        />
        <div className="flex space-x-2 items-center">
          {themes.map((theme) => (
            <div
              className={cn(
                `theme-${theme}`,
                'rounded-full w-6 h-6 bg-primary',
              )}
              key={theme}
              onClick={() => setTheme(theme)}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      <h1>Hello, World!</h1>
    </main>
  );
}

export default App;
