import type { Decorator, Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Text } from '../Text';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
} from './Tooltip';

const decorator: Decorator = (Story) => (
  <TooltipProvider>
    <Story />
  </TooltipProvider>
);

const meta = {
  title: 'Atoms/Tooltip',
  tags: ['autodocs'],
  decorators: [decorator],
  parameters: {
    componentSubtitle:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryFn<typeof meta>;

export const Styled: Story = () => (
  <Tooltip delayDuration={300}>
    <TooltipTrigger asChild>
      <Text>Hover or Focus me</Text>
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent align="center" side="bottom" sideOffset={5}>
        Nicely done!
      </TooltipContent>
    </TooltipPortal>
  </Tooltip>
);

export const Controlled: Story = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Tooltip delayDuration={300} open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Text>{`I'm controlled, look I'm ${open ? 'open' : 'closed'}`}</Text>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent align="center" side="bottom" sideOffset={5}>
          Nicely done!
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
