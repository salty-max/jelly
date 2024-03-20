import { RenderResult, cleanup, render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, describe, it, vi } from 'vitest';
import { FocusScope } from '.';
import { Label } from '../Label';
import { Input } from '../Input';
import { Button } from '../Button';

const INNER_NAME_INPUT_LABEL = 'Name';
const INNER_EMAIL_INPUT_LABEL = 'Email';
const INNER_SUBMIT_LABEL = 'Submit';

describe('FocusScope', () => {
  describe('given a default FocusScope', () => {
    let rendered: RenderResult;
    let tabbableFirst: HTMLInputElement;
    let tabbableSecond: HTMLInputElement;
    let tabbableLast: HTMLButtonElement;

    beforeEach(() => {
      rendered = render(
        <>
          <FocusScope asChild loop trapped>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} />
              <TestField label={INNER_EMAIL_INPUT_LABEL} />
              <Button>{INNER_SUBMIT_LABEL}</Button>
            </form>
          </FocusScope>
          <TestField label="other" />
          <Button>Some other button</Button>
        </>,
      );
      tabbableFirst = rendered.getByLabelText(
        INNER_NAME_INPUT_LABEL,
      ) as HTMLInputElement;
      tabbableSecond = rendered.getByLabelText(
        INNER_EMAIL_INPUT_LABEL,
      ) as HTMLInputElement;
      tabbableLast = rendered.getByText(
        INNER_SUBMIT_LABEL,
      ) as HTMLButtonElement;
    });

    afterEach(() => {
      cleanup();
    });

    it('should focus the next element in the scope on tab', async () => {
      tabbableFirst.focus();
      await userEvent.tab();
      expect(tabbableSecond).toHaveFocus();
    });

    it('should focus the last element in the scope on shift+tab fron the first element in scope', async () => {
      tabbableFirst.focus();
      await userEvent.tab({ shift: true });
      expect(tabbableLast).toHaveFocus();
    });

    it('should focus the first element in the scope on tab from the last element in scope', async () => {
      tabbableLast.focus();
      await userEvent.tab();
      expect(tabbableFirst).toHaveFocus();
    });
  });
});

describe('given a FocusScope where the first focusable element has a negative tab index', () => {
  let rendered: RenderResult;
  let tabbableSecond: HTMLInputElement;
  let tabbableLast: HTMLButtonElement;

  beforeEach(() => {
    rendered = render(
      <>
        <FocusScope asChild loop trapped>
          <form>
            <TestField label={INNER_NAME_INPUT_LABEL} tabIndex={-1} />
            <TestField label={INNER_EMAIL_INPUT_LABEL} />
            <Button>{INNER_SUBMIT_LABEL}</Button>
          </form>
        </FocusScope>
        <TestField label="other" />
        <Button>Some outer button</Button>
      </>,
    );
    tabbableSecond = rendered.getByLabelText(
      INNER_EMAIL_INPUT_LABEL,
    ) as HTMLInputElement;
    tabbableLast = rendered.getByText(INNER_SUBMIT_LABEL) as HTMLButtonElement;
  });

  afterEach(() => {
    cleanup();
  });

  it('should skip the element with a negative tabindex on tab', async () => {
    tabbableLast.focus();
    await userEvent.tab();
    expect(tabbableSecond).toHaveFocus();
  });

  it('should skip the element with a negative tabindex on shift+tab', async () => {
    tabbableSecond.focus();
    await userEvent.tab({ shift: true });
    expect(tabbableLast).toHaveFocus();
  });
});

describe('given a FocusScope with internal focus handlers', () => {
  const handleLastFocusableElementBlur = vi.fn();
  let rendered: RenderResult;
  let tabbableFirst: HTMLInputElement;

  beforeEach(() => {
    rendered = render(
      <>
        <FocusScope asChild loop trapped>
          <form>
            <TestField label={INNER_NAME_INPUT_LABEL} />
            <Button onBlur={handleLastFocusableElementBlur}>
              {INNER_SUBMIT_LABEL}
            </Button>
          </form>
        </FocusScope>
      </>,
    );
    tabbableFirst = rendered.getByLabelText(
      INNER_NAME_INPUT_LABEL,
    ) as HTMLInputElement;
  });

  afterEach(() => {
    cleanup();
  });

  it('should properly blue the last element in the scope before cycling back', async () => {
    tabbableFirst.focus();
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    expect(handleLastFocusableElementBlur).toHaveBeenCalledTimes(1);
  });
});

const TestField = ({
  label,
  ...props
}: { label: string } & React.ComponentProps<'input'>) => (
  <>
    <Label>
      <span>{label}</span>
      <Input type="text" name={label.toLowerCase()} {...props} />
    </Label>
  </>
);
