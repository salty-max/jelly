import React from 'react';
import type * as Jelly from '../Primitive';
import { Primitive } from '../Primitive';

const NAME = 'VisuallyHidden';

type VisuallyHiddenElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Jelly.ComponentPropsWithoutRef<typeof Primitive.span>;
type VisuallyHiddenProps = PrimitiveSpanProps;

/**
 * Visually hides its children from the screen but remains accessible to assistive technologies
 * such as screen readers. This component is useful for accessibility improvements, like hidden
 * labels or skip links.
 *
 * @component
 * @param {PrimitiveSpanProps} props - The props to pass to the underlying Primitive.span component.
 * @param {React.CSSProperties} [props.style] - Custom styles to apply to the span element. The visually hidden styles are applied by default but can be extended with this prop.
 * @param {React.Ref<VisuallyHiddenElement>} forwardedRef - A ref to forward to the underlying span element.
 * @returns {React.ReactElement} A React element that renders a visually hidden span.
 */
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
