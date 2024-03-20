import type { Meta, StoryObj } from '@storybook/react';
import { Label, LabelProps } from './Label';
import { Text } from '../Text';
import { Input } from '../Input';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    componentSubtitle: 'Renders an accessible label associated with controls.',
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  args: {},
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
} satisfies Meta<LabelProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const WithControl: Story = {
  args: {},
  render: () => (
    <>
      <div className="space-y-2 pb-4">
        <Text variant="cardTitle">Wrapping control</Text>
        <Label>
          Label
          <Input type="text" placeholder="Input" />
        </Label>
      </div>

      <div className="space-y-2">
        <Text variant="cardTitle">Referencing control</Text>
        <Label htmlFor="input">Label</Label>
        <Input type="text" placeholder="Input" id="input" />
      </div>
    </>
  ),
};

export const WithInputNumber: Story = {
  args: {},
  render: () => (
    <Label>
      <span>Age:</span>
      <Input type="number" />
    </Label>
  ),
};
