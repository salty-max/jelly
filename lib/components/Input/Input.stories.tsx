import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input, InputProps } from './Input';
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
import { Toaster } from '../Toast';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    componentSubtitle:
      'Displays a form input field or a component that looks like an input field.',
    layout: 'centered',
  },
  args: {},
  tags: ['autodocs'],
} satisfies Meta<InputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    type: 'email',
    placeholder: 'Email',
  },
};

export const WithLabel: Story = {
  args: {
    id: 'email',
    type: 'email',
    placeholder: 'Email',
  },
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={args.id}>Email</Label>
      <Input {...args} />
    </div>
  ),
};

export const File: Story = {
  args: {
    id: 'picture',
    type: 'file',
  },
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={args.id}>Picture</Label>
      <Input {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    type: 'email',
    placeholder: 'Email',
    disabled: true,
  },
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={args.id}>Email</Label>
      <Input {...args} />
    </div>
  ),
};

export const WithButton: Story = {
  args: {
    type: 'email',
    placeholder: 'Email',
  },
  render: (args) => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input {...args} />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
};

const PokemonFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
});

export const WithForm: StoryFn = () => {
  const form = useForm<z.infer<typeof PokemonFormSchema>>({
    resolver: zodResolver(PokemonFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = (data: z.infer<typeof PokemonFormSchema>) => {
    toast({
      title: 'Submitted',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 dark:bg-slate-300 p-4">
          <code className="text-white dark:text-slate-950">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      ),
    });
  };

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pikachu" {...field} />
                </FormControl>
                <FormDescription>The name of your pokemon</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};
