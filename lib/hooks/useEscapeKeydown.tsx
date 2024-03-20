import React from 'react';
import { useCallbackRef } from './useCallbackRef';

/**
 * A React hook that listens for the 'Escape' keydown event on the provided document (or the global document by default)
 * and executes a callback function when the event occurs. This hook is useful for implementing behavior such as closing
 * modals or resetting states when the user presses the Escape key.
 *
 * @param {(event: KeyboardEvent) => void} [onEscapeKeyDownProp] - Optional callback function to be called when the Escape key is pressed. This function receives the original KeyboardEvent as its parameter.
 * @param {Document} [ownerDocument=globalThis.document] - Optional custom document to attach the 'keydown' event listener to, useful in environments where multiple documents might be present or in testing environments. Defaults to the global document object.
 */
export const useEscapeKeydown = (
  onEscapeKeyDownProp?: (event: KeyboardEvent) => void,
  ownerDocument: Document = globalThis?.document,
) => {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event);
      }
    };

    ownerDocument.addEventListener('keydown', handleKeyDown, { capture: true });

    return () =>
      ownerDocument.removeEventListener('keydown', handleKeyDown, {
        capture: true,
      });
  }, [onEscapeKeyDown, ownerDocument]);
};
