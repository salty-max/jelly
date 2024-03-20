export interface Measurable {
  getBoundingClientRect: () => DOMRect;
}
type CallbackFn = (rect: DOMRect) => void;

interface ObservedData {
  rect: DOMRect;
  callbacks: CallbackFn[];
}

let rafId: number;
const observedElements = new Map<Measurable, ObservedData>();

function rectEquals(rect1: DOMRect, rect2: DOMRect) {
  return (
    rect1.top === rect2.top &&
    rect1.right === rect2.right &&
    rect1.bottom === rect2.bottom &&
    rect1.left === rect2.left &&
    rect1.width === rect2.width &&
    rect1.height === rect2.height
  );
}

function runLoop() {
  const changedRectsData: ObservedData[] = [];

  // Process all DOM reads first (getBoundingClientRect)
  observedElements.forEach((data, element) => {
    const newRect = element.getBoundingClientRect();

    // Gather all the data for elements whose rects have changed
    if (!rectEquals(data.rect, newRect)) {
      data.rect = newRect;
      changedRectsData.push(data);
    }
  });

  // Group DOM writes here after the DOM reads (getBoundingClientRect)
  // as DOM writes will most likely happen with the callbacks.
  changedRectsData.forEach((data) => {
    data.callbacks.forEach((callback) => callback(data.rect));
  });

  rafId = requestAnimationFrame(runLoop);
}

export function observeElementRect(
  elementToObserve: Measurable,
  callback: CallbackFn,
) {
  const observedData = observedElements.get(elementToObserve);

  if (observedData === undefined) {
    // Add the element to the map of observed elements with its first callback
    // because this is the first time this element is observed
    observedElements.set(elementToObserve, {
      rect: {} as DOMRect,
      callbacks: [callback],
    });

    if (observedElements.size === 1) {
      // Start the internal loop once at least 1 element is observed
      rafId = requestAnimationFrame(runLoop);
    }
  } else {
    // Only add a callback for this element as it's already observed
    observedData.callbacks.push(callback);
    callback(elementToObserve.getBoundingClientRect());
  }

  return () => {
    const observedData = observedElements.get(elementToObserve);
    if (observedData === undefined) return;

    // Start by removing the callback
    const index = observedData.callbacks.indexOf(callback);
    if (index > -1) {
      observedData.callbacks.splice(index, 1);
    }

    if (observedData.callbacks.length === 0) {
      // Stop observing this element because there are no
      // callbacks registered for it anymore
      observedElements.delete(elementToObserve);

      if (observedElements.size === 0) {
        // Stop the internal loop once all elements are unobserved
        cancelAnimationFrame(rafId);
      }
    }
  };
}
