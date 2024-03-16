/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import { Slot } from '../Slot';
import { cn } from '../../common';
import { usePortal } from '../../hooks/usePortal';

interface TooltipContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  position: {
    x: number;
    y: number;
  } | null;
  setPosition: React.Dispatch<
    React.SetStateAction<TooltipContextType['position']>
  >;
}

const TooltipContext = React.createContext<TooltipContextType>({
  isOpen: false,
  setIsOpen: () => {},
  position: null,
  setPosition: () => {},
});

const useTooltip = () => React.useContext(TooltipContext);

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [position, setPosition] =
    React.useState<TooltipContextType['position']>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <TooltipContext.Provider
      value={{ isOpen, setIsOpen, position, setPosition }}
    >
      {children}
    </TooltipContext.Provider>
  );
}

export interface TooltipTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  TooltipTriggerProps
>(({ asChild, children }, ref) => {
  const { setIsOpen, setPosition } = useTooltip();

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition({ x: bounds.x, y: bounds.y + bounds.height });
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setPosition(null);
    setIsOpen(false);
  };

  const anchorProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    className: 'cursor-help',
  };

  if (asChild) {
    return (
      <Slot ref={ref} {...anchorProps}>
        {children}
      </Slot>
    );
  }
  return (
    <span ref={ref} {...anchorProps}>
      {children}
    </span>
  );
});

export interface TooltipContentProps {
  sideOffset?: number;
  children?: React.ReactNode;
  className?: string;
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ sideOffset = 4, children, className }, ref) => {
  const { isOpen, position } = useTooltip();
  const Portal = usePortal('tooltip-root');
  if (!position) return null;
  return (
    <Portal>
      <div
        style={{
          left: position.x + sideOffset,
          top: position.y,
        }}
        className="fixed pt-1"
      >
        <div
          data-state={isOpen ? 'open' : 'closed'}
          ref={ref}
          className={cn(
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 slide-in-from-top-2',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
});
