import React from 'react';
import { ComponentPropsWithoutRef, Primitive } from '../Primitive';

const NAME = 'Arrow';

type ArrowElement = React.ElementRef<typeof Primitive.svg>;
type PrimitiveSvgProps = ComponentPropsWithoutRef<typeof Primitive.svg>;
export type ArrowProps = PrimitiveSvgProps;

export const Arrow = React.forwardRef<ArrowElement, ArrowProps>(
  ({ children, width = 10, height = 5, ...arrowProps }, forwardedRef) => (
    <Primitive.svg
      {...arrowProps}
      ref={forwardedRef}
      width={width}
      height={height}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      {/* We use their children if they're slotting to replace the whole svg */}
      {arrowProps.asChild ? children : <polygon points="0,0 30,0 15,10" />}
    </Primitive.svg>
  ),
);
Arrow.displayName = NAME;
