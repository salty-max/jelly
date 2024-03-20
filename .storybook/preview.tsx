import React from 'react';
import type { Preview, ReactRenderer } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { ThemeProvider, Toaster } from '../lib';

import '../lib/tailwind.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
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
