import type { Meta, StoryObj } from '@storybook/react';
import { Text, TextProps } from './Text';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Text',
  component: Text,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  args: {
    children: 'Lorem ipsum solor sit amet',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
  },
} satisfies Meta<TextProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};

export const Title: Story = {
  args: {
    variant: 'title',
  },
};

export const Subtitle: Story = {
  args: {
    variant: 'subtitle',
  },
};

export const CardTitle: Story = {
  args: {
    variant: 'cardTitle',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
  },
};
