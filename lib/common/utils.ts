import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges classes using clsx and tailwind-merge
 * @example
 * cn('text-red-500', 'text-blue-500')
 * // => 'text-red-500 text-blue-500'
 * @param classes {ClassValue[]} - Array of classes to merge
 * @returns {string}
 */
export const cn = (...classes: ClassValue[]): string =>
  twMerge(clsx(...classes));

/**
 * Handles setting callback refs and MutableRefObjects.
 * @param ref The ref to use for the instance.
 * @param instance The instance being set.
 */
const setRef = <TInstance>(ref: React.Ref<TInstance>, instance: TInstance) => {
  if (ref instanceof Function) {
    ref(instance);
  } else if (ref != null) {
    (ref as React.MutableRefObject<TInstance>).current = instance;
  }
};

/**
 * A function that combines multiple refs into one.
 *
 * @param {React.Ref<TInstance>[]} refs - an array of refs to be combined
 * @return {React.Ref<TInstance>} a function that sets the given instance to all the combined refs
 */
export const combinedRef =
  <TInstance>(refs: React.Ref<TInstance>[]) =>
  (instance: TInstance | null) =>
    refs.forEach((ref) => setRef(ref, instance));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

/**
 * Merges the given parent and child props objects into a new object.
 *
 * @param {AnyProps} parentProps - The parent props object.
 * @param {AnyProps} childProps - The child props object.
 * @return {AnyProps} The merged props object.
 */
export const mergeReactProps = (
  parentProps: AnyProps,
  childProps: AnyProps,
) => {
  // All child props should override.
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const parentPropValue = parentProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    // If it's a handler, modify the override by composing the base handler.
    if (isHandler) {
      // Only compose the handlers if both exist.
      if (childPropValue && parentPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue?.(...args);
          parentPropValue?.(...args);
        };
        // Otherwise, avoid creating an unnecessary callback.
      } else if (parentPropValue) {
        overrideProps[propName] = parentPropValue;
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...parentPropValue, ...childPropValue };
    } else if (propName === 'className') {
      overrideProps[propName] = [parentPropValue, childPropValue]
        .filter(Boolean)
        .join(' ');
    }
  }

  return { ...parentProps, ...overrideProps };
};
