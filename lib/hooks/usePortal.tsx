import { useState, useCallback, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

export const usePortal = (elementId: string) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  const createPortal = useCallback(() => {
    let el = document.getElementById(elementId);
    if (el?.getAttribute('style')?.includes('display: none')) {
      el = null;
    }
    if (!el) {
      el = document.createElement('div');
      el.setAttribute('id', elementId);
      document.body.appendChild(el);
    }

    return el;
  }, [elementId]);

  useEffect(() => {
    const el = createPortal();
    setPortalElement(el);

    return () => {
      if (el?.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [createPortal]);

  function Portal({ children }: PortalProps) {
    if (!portalElement) return null;
    return ReactDOM.createPortal(children, portalElement);
  }

  return Portal;
};
