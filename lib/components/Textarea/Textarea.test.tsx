import { RenderResult, fireEvent, render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, vi } from 'vitest';
import { Textarea } from './Textarea';
import { Label } from '../Label';

describe('given a default Textarea', () => {
  let rendered: RenderResult;
  let textArea: HTMLElement;

  beforeEach(() => {
    rendered = render(
      <Textarea
        placeholder="Type your message here..."
        className="test"
        data-testid="test-textarea"
      />,
    );
    textArea = rendered.getByTestId('test-textarea');
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have a placeholder', () => {
    expect(textArea).toHaveAttribute(
      'placeholder',
      'Type your message here...',
    );
  });

  it('should have a className', () => {
    expect(textArea).toHaveClass('test');
  });
});

describe('given a disabled Textarea', () => {
  let rendered: RenderResult;
  let textArea: HTMLElement;

  beforeEach(() => {
    rendered = render(
      <Textarea
        placeholder="Type your message here..."
        disabled
        data-testid="test-textarea"
      />,
    );
    textArea = rendered.getByTestId('test-textarea');
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should be disabled', () => {
    expect(textArea).toBeDisabled();
  });
});

describe('given a labeled Textarea', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(
      <>
        <Label htmlFor="message" data-testid="test-label">
          Your message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          data-testid="test-textarea"
        />
      </>,
    );
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });
});

describe('given a controlled Textarea', () => {
  let rendered: RenderResult;
  let textArea: HTMLElement;
  const DEBOUNCE_DELAY = 300;
  const onChange = vi.fn();

  beforeEach(() => {
    rendered = render(
      <Textarea
        placeholder="Type your message here..."
        data-testid="test-textarea"
        debounceDelay={DEBOUNCE_DELAY}
        onChange={onChange}
      />,
    );
    textArea = rendered.getByTestId('test-textarea');
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when typing in the textarea', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    beforeEach(() => {
      fireEvent.change(textArea, { target: { value: 'Hello' } });
      vi.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    it('should have a value', async () => {
      expect(textArea).toHaveValue('Hello');
    });
    it('should call `onChange` prop', async () => {
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'Hello',
          }),
        }),
      );
    });
  });
});
