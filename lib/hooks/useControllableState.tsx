import React from 'react';
import { useCallbackRef } from './useCallbackRef';

interface UseControllableStateParams<T> {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
}

type SetStateFn<T> = (prevState?: T) => T;

function useUncontrolledState<T>({
  defaultProp,
  onChange = () => {},
}: Omit<UseControllableStateParams<T>, 'prop'>) {
  const uncontrolledState = React.useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  const handleChange = useCallbackRef(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
    }
    prevValueRef.current = value;
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
}

/**
 * A hook for managing a state value that can be either controlled or uncontrolled.
 * This hook allows a component to support receiving a state value as a prop (controlled)
 * or managing its own state (uncontrolled), with changes to the state being reported through
 * an `onChange` callback.
 *
 * @template T The type of the state.
 * @param {UseControllableStateParams<T>} params - Parameters for the hook.
 * @param {T | undefined} params.prop - The controlled state value passed in as a prop. If undefined, the state is uncontrolled.
 * @param {T | undefined} params.defaultProp - The default value for the state when uncontrolled.
 * @param {(state: T) => void} [params.onChange] - A callback function called with the new state value whenever it changes.
 * @returns {[T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>]} A stateful value and a function to update it.
 */
function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
    React.useCallback(
      (nextValue) => {
        if (isControlled) {
          const setter = nextValue as SetStateFn<T>;
          const value =
            typeof nextValue === 'function' ? setter(prop) : nextValue;
          if (value !== prop) handleChange(value as T);
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, setUncontrolledProp, handleChange],
    );

  return [value, setValue] as const;
}

export { useControllableState };
