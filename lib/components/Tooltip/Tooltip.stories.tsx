import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
import { Icon } from '../Icon';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Tooltip',
  component: TooltipContent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    sideOffset: {
      control: 'number',
    },
  },
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    children: "Hello, I'm a tooltip",
  },
  render: (args) => (
    <Tooltip>
      <TooltipTrigger>
        <Icon name="MessageCircleMore" />
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
};
