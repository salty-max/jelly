import type { Meta, StoryObj } from '@storybook/react';
import { Arrow, ArrowProps } from './Arrow';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Utils/Arrow',
  component: Arrow,
  parameters: {},
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    width: { control: 'number' },
    height: { control: 'number' },
    asChild: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<ArrowProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const RECOMMENDED_CSS__ARROW__ROOT = {
  verticalAlign: 'middle',
};

export const Styled: Story = {
  args: {
    width: 20,
    height: 10,
    style: {
      ...RECOMMENDED_CSS__ARROW__ROOT,
      fill: 'crimson',
    },
  },
};

export const CustomSizes: Story = {
  args: {},
  render: () => (
    <>
      <Arrow
        style={{ ...RECOMMENDED_CSS__ARROW__ROOT }}
        width={40}
        height={10}
      />
      <Arrow
        style={{ ...RECOMMENDED_CSS__ARROW__ROOT }}
        width={50}
        height={30}
      />
      <Arrow
        style={{ ...RECOMMENDED_CSS__ARROW__ROOT }}
        width={20}
        height={100}
      />
    </>
  ),
};

export const CustomArrow: Story = {
  args: {},
  render: () => (
    <Arrow asChild>
      <div
        style={{
          width: 20,
          height: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          backgroundColor: 'tomato',
        }}
      />
    </Arrow>
  ),
};
