import React from 'react';
import { useLayoutEffect } from './useLayoutEffect';

// We `toString()` to prevent bundlers from trying to `import { useId } from 'react';`
const useReactId = (React as any)['useId'.toString()] || (() => undefined);

let count = 0;

/**
 * Generates a unique identifier that can be used for component keys, form field IDs, or any other
 * DOM element requiring a unique ID. It attempts to use React's built-in `useId` hook if available,
 * ensuring consistency with server-side rendering and hydration. In environments or React versions
 * where `useId` is not available, it falls back to generating a client-side unique ID.
 *
 * The hook can also accept an optional deterministic ID, which, if provided, will be used instead
 * of generating a new ID. This is useful for cases where a stable and predictable ID is required.
 *
 * @param {string} [deterministicId] - An optional deterministic ID. If provided, this ID will be used instead of generating a new one.
 * @returns {string} A unique ID string. It prefixes the generated or provided ID with `jelly-` unless a deterministic ID is provided.
 *                   Returns an empty string if unable to generate an ID (e.g., before React 18's useId is called on the client side).
 */
export const useId = (deterministicId?: string): string => {
  const [id, setId] = React.useState<string | undefined>(useReactId());
  // React versions older than 18 will have client-side ids only.
  useLayoutEffect(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);

  return deterministicId ?? (id ? `jelly-${id}` : '');
};
