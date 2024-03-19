import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../common';
import { Primitive } from '../Primitive';

import type * as Jelly from '../Primitive';

const NAME = 'Label';

type LabelElement = React.ElementRef<typeof Primitive.label>;
type PrimitiveLabelProps = Jelly.ComponentPropsWithoutRef<
  typeof Primitive.label
>;
type LabelProps = PrimitiveLabelProps;

const LabelPrimitive = React.forwardRef<LabelElement, PrimitiveLabelProps>(
  ({ className, ...labelProps }, forwardedRef) => (
    <Primitive.label
      {...labelProps}
      ref={forwardedRef}
      className={cn(NAME, className)}
      onMouseDown={(e) => {
        // Only prevent text selection if clicking inside the label itself
        const target = e.target as HTMLElement;
        if (target.closest('button, input, select, textarea')) return;

        labelProps.onMouseDown?.(e);
        // Prevent text selection when double clicking label
        if (!e.defaultPrevented && e.detail > 1) e.preventDefault();
      }}
    />
  ),
);
LabelPrimitive.displayName = NAME;

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive
    ref={ref}
    className={labelVariants({ className })}
    {...props}
  />
));
Label.displayName = LabelPrimitive.displayName;

export { Label };
export type { LabelProps };
