import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../lib/contexts/Theme';

import '../lib/tailwind.css';

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
