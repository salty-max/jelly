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

/**
 * Dynamically constructs a collection of Primitive components from NODES,
 * each component supporting forwarding refs and an optional `asChild` prop
 * to render as a `Slot` instead of its default node. Additionally, it registers
 * a flag in the window object to indicate the use of Jelly UI primitives.
 *
 * @type {Primitives} A collection of dynamically created Primitive components
 *                    keyed by their node names from NODES. Each component is
 *                    a React component that forwards a ref to the underlying DOM
 *                    element or Slot component and accepts all props valid for
 *                    its node type, with the addition of an `asChild` boolean prop.
 *
 * @example
 * <Primitive.div /> // Renders a div element
 * <Primitive.span asChild /> // Renders a Slot instead of a span element
 *
 * @remarks
 * The `PrimitivePropsWithRef` type should define common props expected by all
 * Primitive components, including standard HTML attributes and any custom props
 * like `asChild`. The `asChild` prop allows rendering a Slot component, useful for
 * customization and composition scenarios in design systems.
 *
 * The use of `React.forwardRef` and `React.useEffect` within each Node ensures
 * that refs are properly forwarded to the correct element and side effects are
 * managed correctly.
 */
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

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

/**
 * Flush custom event dispatch
 * https://github.com/radix-ui/primitives/pull/1378
 *
 * React batches *all* event handlers since version 18, this introduces certain considerations when using custom event types.
 *
 * Internally, React prioritises events in the following order:
 *  - discrete
 *  - continuous
 *  - default
 *
 * https://github.com/facebook/react/blob/a8a4742f1c54493df00da648a3f9d26e3db9c8b5/packages/react-dom/src/events/ReactDOMEventListener.js#L294-L350
 *
 * `discrete` is an  important distinction as updates within these events are applied immediately.
 * React however, is not able to infer the priority of custom event types due to how they are detected internally.
 * Because of this, it's possible for updates from custom events to be unexpectedly batched when
 * dispatched by another `discrete` event.
 *
 * In order to ensure that updates from custom events are applied predictably, we need to manually flush the batch.
 * This utility should be used when dispatching a custom event from within another `discrete` event, this utility
 * is not nessesary when dispatching known event types, or if dispatching a custom type inside a non-discrete event.
 * For example:
 *
 * dispatching a known click 👎
 * target.dispatchEvent(new Event(‘click’))
 *
 * dispatching a custom type within a non-discrete event 👎
 * onScroll={(event) => event.target.dispatchEvent(new CustomEvent(‘customType’))}
 *
 * dispatching a custom type within a `discrete` event 👍
 * onPointerDown={(event) => dispatchDiscreteCustomEvent(event.target, new CustomEvent(‘customType’))}
 *
 * Note: though React classifies `focus`, `focusin` and `focusout` events as `discrete`, it's  not recommended to use
 * this utility with them. This is because it's possible for those handlers to be called implicitly during render
 * e.g. when focus is within a component as it is unmounted, or when managing focus on mount.
 */
function dispatchDiscreteCustomEvent<E extends CustomEvent>(
  target: E['target'],
  event: E,
) {
  if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
}

/**
 * Composes two event handler functions into a single event handler.
 * The new event handler can be conditionally called based on the `checkForDefaultPrevented` option
 * and whether the original event handler called `event.preventDefault()`.
 *
 * @template E The event type that the event handlers will receive.
 * @param {((event: E) => void)} [originalEventHandler] The original event handler to be called first.
 * @param {((event: E) => void)} [newEventHandler] The new event handler to be called after the original event handler.
 * @param {{ checkForDefaultPrevented?: boolean }} [{ checkForDefaultPrevented = true }={}] Options object.
 *        `checkForDefaultPrevented` determines if `newEventHandler` should be called when the original
 *        event handler calls `event.preventDefault()`. The default is `true`.
 * @returns {(event: E) => void} A composed event handler that encapsulates the invocation logic of the original
 *          and new event handlers based on the provided options.
 */
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
