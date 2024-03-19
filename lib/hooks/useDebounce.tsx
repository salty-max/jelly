import React from 'react';

const useDebounce = (callback: Function, delay: number) => {
  const timerRef = React.useRef<number | undefined>();

  React.useEffect(() => () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  });

  return (...args: any[]) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export { useDebounce };
