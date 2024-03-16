/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { mergeReactProps, combinedRef } from '../../common/utils';

interface SlotProps {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;

    if (!React.isValidElement(children)) {
      return null;
    }

    return React.cloneElement(children, {
      ...mergeReactProps(slotProps, children.props),
      ref: combinedRef([forwardedRef, (children as any).ref]),
    } as any);
  },
);
