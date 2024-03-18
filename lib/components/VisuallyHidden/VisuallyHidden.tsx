import React from 'react';
import type * as Jelly from '../Primitive';
import { Primitive } from '../Primitive';

const NAME = 'VisuallyHidden';

type VisuallyHiddenElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Jelly.ComponentPropsWithoutRef<typeof Primitive.span>;
type VisuallyHiddenProps = PrimitiveSpanProps;

const VisuallyHidden = React.forwardRef<
  VisuallyHiddenElement,
  VisuallyHiddenProps
>(({ style, ...props }, forwardedRef) => (
  <Primitive.span
    {...props}
    ref={forwardedRef}
    style={{
      position: 'absolute',
      border: 0,
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      wordWrap: 'normal',
      ...style,
    }}
  />
));
VisuallyHidden.displayName = NAME;

const Root = VisuallyHidden;

export { VisuallyHidden, Root };

export type { VisuallyHiddenProps };
