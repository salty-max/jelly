/* eslint-disable import/no-extraneous-dependencies */
import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within, expect } from '@storybook/test';
import { Button, ButtonProps } from './Button';
import { Icon } from '../Icon';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  args: {
    children: 'Click me',
    onClick: fn(),
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    children: {
      options: ['Link', 'Div'],
      mapping: {
        Link: (
          <a
            href="https://github.com/salty-max/jelly"
            target="_blank"
            rel="noreferrer"
          >
            <Icon className="mr-2 w-4 h-4 size-4" name="Github" />
            Github
          </a>
        ),
        Div: <div>Div</div>,
      },
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
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
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    icon: 'Trash2',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const IconOnly: Story = {
  args: {
    'aria-label': 'Bell',
    children: undefined,
    size: 'icon',
    icon: 'Bell',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Edit',
    icon: 'Pencil',
    iconPosition: 'left',
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: (
      <a
        data-testid="link"
        href="https://github.com/salty-max/jelly"
        target="_blank"
        rel="noreferrer"
      >
        <Icon className="size-4" name="Github" />
        Github
      </a>
    ),
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId('link'));
    await expect(canvas.getByTestId('link')).toHaveAttribute(
      'href',
      'https://github.com/salty-max/jelly',
    );
  },
};
