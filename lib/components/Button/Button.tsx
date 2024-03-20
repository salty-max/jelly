import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';
import { Slot } from '../Slot';
import { cn } from '../../common';
import { Icon } from '../Icon';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-x-1.5 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ButtonProps
  extends ButtonElementProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconPosition = 'left',
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-label={
          typeof children === 'string' ? children : props['aria-label']
        }
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Icon name="LoaderCircle" className="animate-spin" />}
            {!loading && icon && iconPosition === 'left' && (
              <Icon data-testid="button-icon-left" name={icon} />
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <Icon data-testid="button-icon-right" name={icon} />
            )}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';
