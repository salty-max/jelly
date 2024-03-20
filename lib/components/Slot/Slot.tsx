/**
 * This file implements a "Slot" pattern in React, allowing for flexible content injection
 * into components. The pattern is inspired by the concept of slots found in Web Components
 * and other component libraries, which provide a way to define placeholder areas in
 * components that can be filled with custom content or components by the user.
 *
 * The implementation consists of two main components:
 *
 * 1. `Slot`: A component that serves as a placeholder for custom content. It can directly
 *    accept children to render, or it can replace its content with the children of a
 *    `Slottable` component if one is found among its children. This mechanism allows for
 *    conditional content replacement based on the presence of `Slottable` content, enabling
 *    more dynamic and flexible component structures.
 *
 * 2. `Slottable`: A marker component used to wrap content that is intended to be injected
 *    into a `Slot`. It doesn't render any additional markup by itself but signals to the
 *    `Slot` component that its children should be used to replace the slot's default content.
 */

import React from 'react';
import { composeRefs } from '../../common/utils';
import { mergeProps } from './helpers';

/**
 * A component that simply renders its children. It's used as a marker
 * to identify slottable content within the `Slot` component.
 *
 * @param {{ children: React.ReactNode }} props The component props containing children.
 * @returns {React.ReactElement} A fragment containing the children.
 */
export function Slottable({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const isSlottable = (child: React.ReactNode): child is React.ReactElement =>
  React.isValidElement(child) && child.type === Slottable;

interface SlotCloneProps {
  children: React.ReactNode;
}

/**
 * Clones a React element, merging any additional props provided to the `SlotClone`
 * and handling the forwarding of refs appropriately.
 *
 * @param {SlotCloneProps} props The props, including children and any additional props to merge.
 * @param {React.Ref<any>} forwardedRef The ref to forward to the cloned element.
 * @returns {React.ReactElement | null} The cloned element with merged props and forwarded ref, or `null` for invalid cases.
 */
const SlotClone = React.forwardRef<any, SlotCloneProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...mergeProps(slotProps, children.props),
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
        ref: forwardedRef
          ? composeRefs(forwardedRef, (children as any).ref)
          : (children as any).ref,
      });
    }

    return React.Children.count(children) > 1
      ? React.Children.only(null)
      : null;
  },
);
SlotClone.displayName = 'SlotClone';

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * A Slot component that can replace its content with slottable elements provided
 * to it. It looks for a `Slottable` component among its children and uses its content
 * to replace the slot's own children.
 *
 * @param {SlotProps} props The props, including children and any slot-specific props.
 * @param {React.Ref<HTMLElement>} forwardedRef The ref to forward to the Slot or the cloned element.
 * @returns {React.ReactElement} The slot with potentially replaced content, based on the presence of `Slottable` children.
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    // The new element to render is the one passed as a child of `Slottable`
    const newElement = slottable.props.children as React.ReactNode;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // Because the new element will be the one rendered, we are only interested
        // in grabbibg its children (`newElement.props.children`)
        if (React.Children.count(newElement) > 1) {
          return React.Children.only(null);
        }

        return React.isValidElement(newElement)
          ? (newElement.props.children as React.ReactNode)
          : null;
      }
      return child;
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});
Slot.displayName = 'Slot';

export { Slot };
export type { SlotProps };
