import React from 'react';
import ReactDOM from 'react-dom';
import { Slot } from '../Slot';

const NODES = [
  'a',
  'button',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'svg',
  'label',
  'input',
  'form',
  'ol',
  'ul',
  'li',
  'nav',
] as const;

// Temporary while we await merge of this fix:
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55396
type PropsWithoutRef<P> = P extends any
  ? 'ref' extends keyof P
    ? Pick<P, Exclude<keyof P, 'ref'>>
    : P
  : P;
type ComponentPropsWithoutRef<T extends React.ElementType> = PropsWithoutRef<
  React.ComponentProps<T>
>;

type PrimitivePropsWithRef<E extends React.ElementType> =
  React.ComponentPropsWithRef<E> & {
    asChild?: boolean;
  };

type PrimitiveForwardRefComponent<E extends React.ElementType> =
  React.ForwardRefExoticComponent<PrimitivePropsWithRef<E>>;

type Primitives = {
  [E in (typeof NODES)[number]]: PrimitiveForwardRefComponent<E>;
};

const Primitive = NODES.reduce((primitive, node) => {
  const Node = React.forwardRef(
    (props: PrimitivePropsWithRef<typeof node>, forwardedRed: any) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? Slot : node;

      React.useEffect(() => {
        (window as any)[Symbol.for('jelly-ui')] = true;
      });

      // @ts-expect-error ts(2322)
      return <Comp {...primitiveProps} ref={forwardedRed} />;
    },
  );

  Node.displayName = `Primitive${node}`;

  return { ...primitive, [node]: Node };
}, {} as Primitives);

const Root = Primitive;

function dispatchDiscreteCustomEvent<E extends CustomEvent>(
  target: E['target'],
  event: E,
) {
  if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
}

function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  newEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return newEventHandler?.(event);
    }
  };
}

export { Primitive, Root, composeEventHandlers, dispatchDiscreteCustomEvent };
export type { ComponentPropsWithoutRef, PrimitivePropsWithRef };
