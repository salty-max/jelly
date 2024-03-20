/**
 * The Presence component and hook offer a way to manage the presence of components
 * in the DOM with support for CSS animations. It allows components to be conditionally
 * rendered based on the `present` prop while handling enter and exit animations
 * gracefully. This file defines a `Presence` component that can accept either a React
 * element or a render function as children. It utilizes a custom `usePresence` hook
 * to track the presence state and manage animations, ensuring components mount and
 * unmount at the appropriate times during animation sequences.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { useComposedRefs } from '../../common/utils';
import { useStateMachine } from '../../hooks/useStateMachine';
import { useLayoutEffect } from '../..';

interface PresenceProps {
  children:
    | React.ReactElement
    | ((props: { present: boolean }) => React.ReactElement);
  present: boolean;
}

/**
 * A component that conditionally renders its children based on the `present` prop.
 * It supports animations for entering and exiting states by managing a presence state
 * internally. When children are functions, they receive an object with a `present` boolean
 * indicating the current presence state.
 *
 * @param {PresenceProps} props - The props for the Presence component.
 * @param {React.ReactElement | ((props: { present: boolean }) => React.ReactElement)} props.children - The children to render, which can be a React element or a function returning a React element.
 * @param {boolean} props.present - A boolean flag indicating whether the component should be considered present.
 * @returns {React.ReactElement | null} The rendered children based on the presence state, or `null` if not present.
 */

const Presence: React.FC<PresenceProps> = ({ children, present }) => {
  const presence = usePresence(present);

  const child =
    typeof children === 'function'
      ? children({ present: presence.isPresent })
      : React.Children.only(children);

  const ref = useComposedRefs(presence.ref, (child as any).ref);
  const forceMount = typeof children === 'function';

  return forceMount || presence.isPresent
    ? React.cloneElement(child, { ref })
    : null;
};

/**
 * A hook that manages the presence state of a component, supporting enter and exit animations.
 * It tracks the component's mount state and listens for CSS animation events to transition
 * between states.
 *
 * @param {boolean} present - A boolean flag indicating the desired presence state.
 * @returns {object} An object containing the `isPresent` state and a `ref` callback to be attached to the component.
 */
const usePresence = (present: boolean) => {
  const [node, setNode] = React.useState<HTMLElement>();
  const stylesRef = React.useRef<CSSStyleDeclaration>({} as any);
  const prevPresentRef = React.useRef(present);
  const prevAnimationNameRef = React.useRef<string>('none');
  const initialState = present ? 'mounted' : 'unmounted';
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: 'unmounted',
      ANIMATION_OUT: 'unmountSuspended',
    },
    unmountSuspended: {
      MOUNT: 'mounted',
      ANIMATION_END: 'unmounted',
    },
    unmounted: {
      MOUNT: 'mounted',
    },
  });

  React.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current =
      state === 'mounted' ? currentAnimationName : 'none';
  }, [state]);

  useLayoutEffect(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;

    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);

      if (present) {
        send('MOUNT');
      } else if (
        currentAnimationName === 'none' ||
        styles?.display === 'none'
      ) {
        // If there is no exit animation or the element is hidden,
        // animations won't run so we unmount instantly
        send('UNMOUNT');
      } else {
        /**
         * When `present` changes to `false`, we check changes to animation-name to
         * determine whether an animation has started. We chose this approach (reading
         * computed styles) because there is no `animationrun` event and `animationstart`
         * fires after `animation-delay` has expired which would be too late.
         */
        const isAnimating = currentAnimationName !== prevAnimationName;

        if (wasPresent && isAnimating) {
          send('ANIMATION_OUT');
        } else {
          send('UNMOUNT');
        }
      }

      prevPresentRef.current = present;
    }
  }, [present, send]);

  useLayoutEffect(() => {
    if (node) {
      /**
       * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
       * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
       * make sure we only trigger ANIMATION_END for the currently active animation.
       */
      const handleAnimationEnd = (event: AnimationEvent) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(
          event.animationName,
        );

        if (event.target === node && isCurrentAnimation) {
          // With React 18 concurrency this update is applied
          // a frame after the animation ends, creating a flash of visible content.
          // By manually flushing we ensure they sync within a frame, removing the flash.
          ReactDOM.flushSync(() => send('ANIMATION_END'));
        }
      };

      const handleAnimationStart = (event: AnimationEvent) => {
        if (event.target === node) {
          // If animation occurred, store its name as the previous animation.
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };

      node.addEventListener('animationstart', handleAnimationStart);
      node.addEventListener('animationcancel', handleAnimationEnd);
      node.addEventListener('animationend', handleAnimationEnd);

      return () => {
        node.removeEventListener('animationstart', handleAnimationStart);
        node.removeEventListener('animationcancel', handleAnimationEnd);
        node.removeEventListener('animationend', handleAnimationEnd);
      };
    }
    // Transition to the unmounted state if the node is removed prematurely.
    // We avoid doing so during cleanup as the node may change but still exist.
    send('ANIMATION_END');
  }, [node, send]);

  return {
    isPresent: ['mounted', 'unmountSuspended'].includes(state),
    ref: React.useCallback((node: HTMLElement) => {
      if (node) stylesRef.current = getComputedStyle(node);
      setNode(node);
    }, []),
  };
};

function getAnimationName(styles?: CSSStyleDeclaration) {
  return styles?.animationName ?? 'none';
}

export { Presence };
export type { PresenceProps };
