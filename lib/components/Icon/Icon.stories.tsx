import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconProps } from './Icon';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    componentSubtitle: 'Icon component is based on Lucide icons library.',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  args: {
    children: 'Lorem ipsum solor sit amet',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    name: {
      control: 'string',
    },
  },
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Standard: Story = {
  args: {
    name: 'Bell',
  },
};
