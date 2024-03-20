/* eslint-disable no-console */
import { Meta, StoryFn } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '.';
import { Input } from '../Input';
import { Button } from '../Button';

const meta = {
  title: 'Molecules/Form',
  parameters: {
    componentSubtitle: 'Form builder with React Hook Form',
    layout: 'centered',
  },
  args: {},
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryFn<typeof meta>;

const PokemonFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
});

export const Basic: Story = () => {
  const form = useForm<z.infer<typeof PokemonFormSchema>>({
    resolver: zodResolver(PokemonFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const { handleSubmit, control } = form;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="space-y-8"
      >
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
  );
};
