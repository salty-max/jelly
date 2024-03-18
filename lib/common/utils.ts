import clsx, { ClassValue } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type PossibleRef<T> = React.Ref<T> | undefined;

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

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

export function useComposedRefs<T>(...refs: PossibleRef<T>[]) {
  return React.useCallback(composeRefs(...refs), refs);
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}
