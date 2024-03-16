import { cn } from '../lib/common/utils';
import { Button, Theme, useTheme } from '../lib';

function App() {
  const { isDarkMode, applyTheme, toggleDarkMode } = useTheme();

  return (
    <main data-testid="app-wrapper" className="p-4">
      <div className="flex space-x-4">
        <Button icon={isDarkMode ? 'Moon' : 'Sun'} onClick={toggleDarkMode} />
        <div className="flex space-x-2 items-center">
          {Object.values(Theme).map((theme) => (
            <div
              className={cn('rounded-full w-6 h-6 bg-primary', theme)}
              onClick={() => applyTheme(theme)}
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
