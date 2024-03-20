/**
 * This file defines a DismissableLayer component that can be used to manage the dismissal
 * of content based on interactions outside of the layer (such as clicking outside or pressing
 * the escape key). It leverages React context to handle nested layers and manage interactions
 * that should dismiss the layer. This setup is particularly useful for modals, dropdowns,
 * and other similar components where outside interactions can trigger dismissal.
 *
 * The DismissableLayer component supports disabling pointer events on elements outside of it,
 * handling escape keydown events, pointer down outside events, focus outside events, and general
 * interact outside events, offering a comprehensive API for managing outside interactions.
 *
 * Additionally, the file defines a DismissableLayerBranch component that can be used within
 * a DismissableLayer to exempt certain elements from triggering the layer's dismissal, effectively
 * creating a branch of elements that are considered part of the layer despite not being physically
 * nested within it.
 *
 * The implementation utilizes custom hooks and contexts to track the state and behavior of the
 * layers and branches, ensuring proper event handling and state management across potentially
 * complex nested structures.
 */
import React from 'react';
import {
  Primitive,
  composeEventHandlers,
  dispatchDiscreteCustomEvent,
} from '../Primitive';
import type * as Jelly from '../Primitive';
import { useComposedRefs } from '../../common/utils';
import { useCallbackRef } from '../..';
import { useEscapeKeydown } from '../../hooks/useEscapeKeydown';

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

const DISMISSABLE_LAYER_NAME = 'DismissableLayer';
const CONTEXT_UPDATE = 'dismissableLayer.update';
const POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside';
const FOCUS_OUTSIDE = 'dismissableLayer.focusOutside';

let originalBodyPointerEvents: string;

const DismissableLayerContext = React.createContext({
  layers: new Set<DismissableLayerElement>(),
  layersWithOutsidePointerEventsDisabled: new Set<DismissableLayerElement>(),
  branches: new Set<DismissableLayerBranchElement>(),
});

type DismissableLayerElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Jelly.ComponentPropsWithoutRef<typeof Primitive.div>;
interface DismissableLayerProps extends PrimitiveDivProps {
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside
   * the `DismissableLayer`. Users will need to click twice on outside elements to
   * interact with them: once to close the `DismissableLayer`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean;
  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
  /**
   * Event handler called when the focus moves outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void;
  /**
   * Event handler called when an interaction happens outside the `DismissableLayer`.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: (
    event: PointerDownOutsideEvent | FocusOutsideEvent,
  ) => void;
  /**
   * Handler called when the `DismissableLayer` should be dismissed
   */
  onDismiss?: () => void;
}

/**
 * DismissableLayer component that manages dismissal based on outside interactions.
 * It supports disabling interactions outside the layer, handling escape keydown,
 * pointer down outside, focus outside, and general interact outside events.
 *
 * @component
 * @param {DismissableLayerProps} props - The props for the DismissableLayer component.
 * @param {boolean} [props.disableOutsidePointerEvents=false] - If true, disables hover, focus, and click interactions outside the DismissableLayer.
 * @param {(event: KeyboardEvent) => void} [props.onEscapeKeyDown] - Callback for escape keydown events.
 * @param {(event: PointerDownOutsideEvent) => void} [props.onPointerDownOutside] - Callback for pointer down outside events.
 * @param {(event: FocusOutsideEvent) => void} [props.onFocusOutside] - Callback for focus outside events.
 * @param {(event: PointerDownOutsideEvent | FocusOutsideEvent) => void} [props.onInteractOutside] - Callback for any interaction outside events.
 * @param {() => void} [props.onDismiss] - Callback when the DismissableLayer should be dismissed.
 * @returns {React.ReactElement | null} The rendered DismissableLayer or `null` if not present.
 */
const DismissableLayer = React.forwardRef<
  DismissableLayerElement,
  DismissableLayerProps
>(
  (
    {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      ...layerProps
    },
    forwardedRef,
  ) => {
    const context = React.useContext(DismissableLayerContext);
    const [node, setNode] = React.useState<DismissableLayerElement | null>(
      null,
    );
    const ownerDocument = node?.ownerDocument ?? globalThis?.document;
    const [, force] = React.useState({});
    const composedRefs = useComposedRefs(forwardedRef, (node) => setNode(node));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [
      ...context.layersWithOutsidePointerEventsDisabled,
    ].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(
      highestLayerWithOutsidePointerEventsDisabled,
    );
    const index = node ? layers.indexOf(node) : -1;
    const isBodyPointerEventsDisabled =
      context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled =
      index >= highestLayerWithOutsidePointerEventsDisabledIndex;

    const pointerDownOutside = usePointerDownOutside((event) => {
      const target = event.target as HTMLElement;
      const isPointerDownOnBranch = [...context.branches].some((branch) =>
        branch.contains(target),
      );

      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;

      onPointerDownOutside?.(event);
      onInteractOutside?.(event);

      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    }, ownerDocument);

    const focusOutside = useFocusOutside((event) => {
      const target = event.target as HTMLElement;
      const isFocusInBranch = [...context.branches].some((branch) =>
        branch.contains(target),
      );

      if (isFocusInBranch) return;

      onFocusOutside?.(event);
      onInteractOutside?.(event);

      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    }, ownerDocument);

    useEscapeKeydown((event) => {
      const isHighestLayer = index === context.layers.size - 1;

      if (!isHighestLayer) return;

      onEscapeKeyDown?.(event);

      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss?.();
      }
    }, ownerDocument);

    React.useEffect(() => {
      if (!node) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = 'none';
        }

        context.layersWithOutsidePointerEventsDisabled.add(node);
      }

      context.layers.add(node);
      dispatchUpdate();

      return () => {
        if (
          disableOutsidePointerEvents &&
          context.layersWithOutsidePointerEventsDisabled.size === 1
        ) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }, [node, ownerDocument, disableOutsidePointerEvents, context]);

    /**
     * We purposefully prevent combining this effect with the `disableOutsidePointerEvents` effect
     * because a change to `disableOutsidePointerEvents` would remove this layer from the stack
     * and add it to the end again so the layering order wouldn't be _creation order_.
     * We only want them to be removed from context stacks when unmounted.
     */
    React.useEffect(
      () => () => {
        if (!node) return;
        context.layers.delete(node);
        context.layersWithOutsidePointerEventsDisabled.delete(node);
        dispatchUpdate();
      },
      [node, context],
    );

    React.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener(CONTEXT_UPDATE, handleUpdate);

      return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
    }, []);

    return (
      <Primitive.div
        {...layerProps}
        ref={composedRefs}
        style={{
          pointerEvents: isBodyPointerEventsDisabled
            ? isPointerEventsEnabled
              ? 'auto'
              : 'none'
            : undefined,
          ...layerProps.style,
        }}
        onFocusCapture={composeEventHandlers(
          layerProps.onFocusCapture,
          focusOutside.onFocusCapture,
        )}
        onBlurCapture={composeEventHandlers(
          layerProps.onBlurCapture,
          focusOutside.onBlurCapture,
        )}
        onPointerDownCapture={composeEventHandlers(
          layerProps.onPointerDownCapture,
          pointerDownOutside.onPointerDownCapture,
        )}
      />
    );
  },
);
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;

const BRANCH_NAME = 'DismissableLayerBranch';

type DismissableLayerBranchElement = React.ElementRef<typeof Primitive.div>;
type DismissableLayerBranchProps = PrimitiveDivProps;

/**
 * DismissableLayerBranch component that creates an exception within a DismissableLayer,
 * allowing certain elements to not trigger the layer's dismissal despite being outside
 * the physical DOM structure of the layer. Useful for dropdowns, tooltips, etc.,
 * where a related element should not cause the layer to dismiss when interacted with.
 *
 * @component
 * @param {DismissableLayerBranchProps} props - The props for the DismissableLayerBranch component.
 * @returns {React.ReactElement} The rendered DismissableLayerBranch.
 */
const DismissableLayerBranch = React.forwardRef<
  DismissableLayerBranchElement,
  DismissableLayerBranchProps
>((props, forwardedRef) => {
  const context = React.useContext(DismissableLayerContext);
  const ref = React.useRef<DismissableLayerBranchElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);

  React.useEffect(() => {
    const node = ref.current;

    if (node) {
      context.branches.add(node);

      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);

  return <Primitive.div {...props} ref={composedRefs} />;
});

DismissableLayerBranch.displayName = BRANCH_NAME;

const usePointerDownOutside = (
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void,
  ownerDocument: Document = globalThis?.document,
) => {
  const handlePointerDownOutside = useCallbackRef(
    onPointerDownOutside,
  ) as EventListener;
  const isPointerInsideReactTreeRef = React.useRef(false);
  const handleClickRef = React.useRef(() => {});

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };

        function handleAndDispatchPointerDownOutsideEvent() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true },
          );
        }

        /**
         * On touch devices, we need to wait for a click event because browsers implement
         * a ~350ms delay between the time the user stops touching the display and when the
         * browser executres events. We need to ensure we don't reactivate pointer-events within
         * this timeframe otherwise the browser may execute events that should have been prevented.
         *
         * Additionally, this also lets us deal automatically with cancellations when a click event
         * isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
         *
         * This is why we also continuously remove the previous listener, because we cannot be
         * certain that it was raised, and therefore cleaned-up.
         */
        if (event.pointerType === 'touch') {
          ownerDocument.removeEventListener('click', handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent;
          ownerDocument.addEventListener('click', handleClickRef.current, {
            once: true,
          });
        } else {
          handleAndDispatchPointerDownOutsideEvent();
        }
      } else {
        // We need to remove the event listener in case the outside click has been canceled.
        ownerDocument.removeEventListener('click', handleClickRef.current);
      }

      isPointerInsideReactTreeRef.current = false;
    };

    /**
     * if this hook executes in a component that mounts via a `pointerdown` event, the event
     * would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
     * this by delaying the event listener registration on the document.
     * This is not React specific, but rather how the DOM works, ie:
     * ```
     * button.addEventListener('pointerdown', () => {
     *   console.log('I will log');
     *   document.addEventListener('pointerdown', () => {
     *     console.log('I will also log');
     *   })
     * });
     */
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener('pointerdown', handlePointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener('pointerdown', handlePointerDown);
      ownerDocument.removeEventListener('click', handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);

  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => (isPointerInsideReactTreeRef.current = true),
  };
};

const useFocusOutside = (
  onFocusOutside?: (event: FocusOutsideEvent) => void,
  ownerDocument: Document = globalThis?.document,
) => {
  const handleFocusOutside = useCallbackRef(onFocusOutside) as EventListener;
  const isFocusInsideReactTreeRef = React.useRef(false);

  React.useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(
          FOCUS_OUTSIDE,
          handleFocusOutside,
          eventDetail,
          {
            discrete: false,
          },
        );
      }
    };

    ownerDocument.addEventListener('focusin', handleFocus);

    return () => ownerDocument.removeEventListener('focusin', handleFocus);
  }, [ownerDocument, handleFocusOutside]);

  return {
    onFocusCapture: () => (isFocusInsideReactTreeRef.current = true),
    onBlurCapture: () => (isFocusInsideReactTreeRef.current = false),
  };
};

const dispatchUpdate = () => {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
};

const handleAndDispatchCustomEvent = <
  E extends CustomEvent,
  OriginalEvent extends Event,
>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: {
    originalEvent: OriginalEvent;
  } & (E extends CustomEvent<infer D> ? D : never),
  {
    discrete,
  }: {
    discrete: boolean;
  },
) => {
  const { target } = detail.originalEvent;
  const event = new CustomEvent(name, {
    bubbles: false,
    cancelable: true,
    detail,
  });

  if (handler) {
    target.addEventListener(name, handler as EventListener, { once: true });
  }

  if (discrete) {
    dispatchDiscreteCustomEvent(target, event);
  } else {
    target.dispatchEvent(event);
  }
};

const Root = DismissableLayer;
const Branch = DismissableLayerBranch;

export { DismissableLayer, DismissableLayerBranch, Root, Branch };

export type { DismissableLayerProps, DismissableLayerBranchProps };
