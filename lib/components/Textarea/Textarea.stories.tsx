import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { fn } from '@storybook/test';
import { Textarea } from './Textarea';
import { Label } from '../Label';
import { Button } from '../Button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../Form';
import { toast } from '../../hooks/useToast';

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: {
    componentSubtitle:
      'Displays a form textarea or a component that looks like a textarea.',
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Type your message here...',
    disabled: true,
  },
};

export const WithLabel: Story = {
  args: {
    id: 'message',
    placeholder: 'Type your message here...',
  },
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={args.id}>Your message</Label>
      <Textarea {...args} />
    </div>
  ),
};

export const WithText: Story = {
  args: {
    id: 'message',
    placeholder: 'Type your message here...',
  },
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={args.id}>Your message</Label>
      <Textarea {...args} />
      <p className="text-sm text-muted-foreground">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
};

export const WithButton: Story = {
  args: {
    id: 'message',
    placeholder: 'Type your message here...',
  },
  render: (args) => (
    <div className="grid w-full gap-2">
      <Textarea {...args} />
      <Button>Send message</Button>
    </div>
  ),
};

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
});

export const WithForm: StoryFn = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
