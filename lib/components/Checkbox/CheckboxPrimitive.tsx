import React from 'react';
import type * as Jelly from '../Primitive';
import { Scope, createContextScope } from '../../common/context';
import { Primitive, composeEventHandlers } from '../Primitive';
import { useComposedRefs } from '../../common/utils';
import { useControllableState, usePrevious, useSize } from '../..';
import { Presence } from '../Presence';

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox';

type ScopedProps<P> = P & { __scopeCheckbox?: Scope };
const [createCheckboxContext, createCheckboxScope] =
  createContextScope(CHECKBOX_NAME);

type CheckedState = boolean | 'indeterminate';

interface CheckboxContextValue {
  state: CheckedState;
  disabled?: boolean;
}

const [CheckboxProvider, useCheckboxContext] =
  createCheckboxContext<CheckboxContextValue>(CHECKBOX_NAME);

type CheckboxElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Jelly.ComponentPropsWithoutRef<
  typeof Primitive.button
>;
interface CheckboxProps
  extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  required?: boolean;
  onCheckedChange?: (checked: CheckedState) => void;
}

const Checkbox = React.forwardRef<CheckboxElement, CheckboxProps>(
  (
    {
      __scopeCheckbox,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = 'on',
      onCheckedChange,
      ...checkboxProps
    }: ScopedProps<CheckboxProps>,
    forwardedRef,
  ) => {
    const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) =>
      setButton(node),
    );
    const hasConsumerStoppedPropagationRef = React.useRef(false);
    // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = button ? Boolean(button.closest('form')) : true;
    const [checked = false, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked,
      onChange: onCheckedChange,
    });
    const initialCheckedStateRef = React.useRef(checked);

    React.useEffect(() => {
      const form = button?.form;

      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener('reset', reset);
        return () => form.removeEventListener('reset', reset);
      }
    }, [button, setChecked]);

    return (
      <CheckboxProvider
        scope={__scopeCheckbox}
        state={checked}
        disabled={disabled}
      >
        <Primitive.button
          type="button"
          role="checkbox"
          aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
          aria-required={required}
          aria-disabled={disabled}
          data-state={getState(checked)}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          value={value}
          {...checkboxProps}
          ref={composedRefs}
          onKeyDown={composeEventHandlers(checkboxProps.onKeyDown, (event) => {
            // According to WAI ARIA, checkboxes don't activate on enter keypress
            if (event.key === 'Enter') event.preventDefault();
          })}
          onClick={composeEventHandlers(checkboxProps.onClick, (event) => {
            setChecked((prevChecked) =>
              isIndeterminate(prevChecked) ? true : !prevChecked,
            );

            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current =
                event.isPropagationStopped();
              // if checkbox is in a form, stop propagation from the button so that we only
              // propagate one click event (from the input). We propagate changes from an input so
              // that native form validation works and form events reflect checkbox updates.
              if (!hasConsumerStoppedPropagationRef.current)
                event.stopPropagation();
            }
          })}
        />
        {isFormControl && (
          <BubbleInput
            control={button}
            bubbles={!hasConsumerStoppedPropagationRef.current}
            name={name}
            value={value}
            checked={checked}
            required={required}
            disabled={disabled}
            // We transform because the input is absolutely positioned but we have
            // rendered it **after** the button. This pulls it back to sit on top
            // of the button.
            style={{ transform: 'translateX(-100%)' }}
          />
        )}
      </CheckboxProvider>
    );
  },
);
Checkbox.displayName = CHECKBOX_NAME;

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'CheckboxIndicator';

type CheckboxIndicatorElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Jelly.ComponentPropsWithoutRef<typeof Primitive.span>;
interface CheckboxIndicatorProps extends PrimitiveSpanProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const CheckboxIndicator = React.forwardRef<
  CheckboxIndicatorElement,
  CheckboxIndicatorProps
>(
  (
    {
      __scopeCheckbox,
      forceMount,
      ...indicatorProps
    }: ScopedProps<CheckboxIndicatorProps>,
    forwardedRef,
  ) => {
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);

    return (
      <Presence
        present={
          forceMount || isIndeterminate(context.state) || context.state === true
        }
      >
        <Primitive.span
          data-state={getState(context.state)}
          data-disabled={context.disabled ? '' : undefined}
          {...indicatorProps}
          ref={forwardedRef}
          style={{ pointerEvents: 'none', ...indicatorProps.style }}
        />
      </Presence>
    );
  },
);
CheckboxIndicator.displayName = INDICATOR_NAME;

/* -------------------------------------------------------------------------------------------------
 * BubbleInput
 * -----------------------------------------------------------------------------------------------*/

type InputProps = Jelly.ComponentPropsWithoutRef<'input'>;
interface BubbleInputProps extends Omit<InputProps, 'checked'> {
  checked: CheckedState;
  control: HTMLElement | null;
  bubbles: boolean;
}

const BubbleInput = ({
  control,
  checked,
  bubbles = true,
  ...inputProps
}: BubbleInputProps) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const prevChecked = usePrevious(checked);
  const controlSize = useSize(control);

  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!;
    const inputProto = window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked')!;
    const setChecked = descriptor.set;

    if (prevChecked !== checked && setChecked) {
      const event = new Event('click', { bubbles });
      input.indeterminate = isIndeterminate(checked);
      setChecked.call(input, isIndeterminate(checked) ? false : checked);
      input.dispatchEvent(event);
    }
  }, [prevChecked, checked, bubbles]);

  return (
    <input
      type="checkbox"
      aria-hidden
      defaultChecked={isIndeterminate(checked) ? false : checked}
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      style={{
        ...inputProps.style,
        ...controlSize,
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
        margin: 0,
      }}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

const isIndeterminate = (checked?: CheckedState): checked is 'indeterminate' =>
  checked === 'indeterminate';

const getState = (checked: CheckedState) =>
  isIndeterminate(checked)
    ? 'indeterminate'
    : checked
      ? 'checked'
      : 'unchecked';

const Root = Checkbox;
const Indicator = CheckboxIndicator;

export {
  createCheckboxScope,
  //
  Checkbox,
  CheckboxIndicator,
  //
  Root,
  Indicator,
};

export type { CheckboxProps, CheckboxIndicatorProps };
