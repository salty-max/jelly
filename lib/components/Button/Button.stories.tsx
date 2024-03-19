import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button, ButtonProps } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    componentSubtitle:
      'Displays a button or a component that looks like a button.',
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  args: {
    onClick: fn(),
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    icon: { control: 'text' },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    asChild: { control: 'boolean' },
    variant: {
      control: 'select',
      options: [
        'primary',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
  },
  tags: ['autodocs'],
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    children: 'Click me',
  },
};

/**
 * 6 variants are supported.
 */
export const Variants: Story = {
  args: {
    children: 'Click me',
  },
  render: (args) => (
    <div className="flex space-x-4">
      <Button {...args} variant="primary">
        Click me
      </Button>
      <Button {...args} variant="destructive">
        Click me
      </Button>
      <Button {...args} variant="outline">
        Click me
      </Button>
      <Button {...args} variant="secondary">
        Click me
      </Button>
      <Button {...args} variant="ghost">
        Click me
      </Button>
      <Button {...args} variant="link">
        Click me
      </Button>
    </div>
  ),
};

/**
 * 4 sizes are supported.
 */
export const Sizes: Story = {
  args: {},
  render: (args) => (
    <div className="flex space-x-4">
      <Button {...args} size="lg">
        Click me
      </Button>
      <Button {...args} size="default">
        Click me
      </Button>
      <Button {...args} size="icon" icon="Bell" />
      <Button {...args} size="sm">
        Click me
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: 'Send',
    loading: true,
    disabled: true,
  },
};
