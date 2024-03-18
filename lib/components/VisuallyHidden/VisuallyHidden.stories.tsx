import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './VisuallyHidden';
import { Button } from '../Button';

const meta = {
  title: 'Utils/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  render: () => (
    <Button>
      <VisuallyHidden>Save the file</VisuallyHidden>
      <span aria-hidden>💾</span>
    </Button>
  ),
};
