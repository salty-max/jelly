import type { Meta, StoryFn } from '@storybook/react';
import { Button } from '../Button';
import { toast } from '../../hooks/useToast';
import { Toaster } from './Toaster';
import { ToastAction } from '.';

const meta = {
  title: 'Atoms/Toast',
  parameters: {
    componentSubtitle: 'A succinct message that is displayed temporarily.',
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryFn<typeof meta>;

export const Simple: Story = () => (
  <>
    <Toaster />
    <Button
      onClick={() =>
        toast({
          description: 'Your message has been sent.',
        })
      }
    >
      Show Toast
    </Button>
  </>
);

export const WithTitle: Story = () => (
  <>
    <Toaster />
    <Button
      onClick={() =>
        toast({
          title: 'Success',
          description: 'Your message has been sent.',
        })
      }
    >
      Show Toast
    </Button>
  </>
);

export const WithAction: Story = () => (
  <>
    <Toaster />
    <Button
      onClick={() =>
        toast({
          title: 'Upgrade available',
          description: 'A new version of your app is available. Download now.',
          action: <ToastAction altText="Download">Download</ToastAction>,
        })
      }
    >
      Show Toast
    </Button>
  </>
);

export const Destructive: Story = () => (
  <>
    <Toaster />
    <Button
      onClick={() =>
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    >
      Show Toast
    </Button>
  </>
);
