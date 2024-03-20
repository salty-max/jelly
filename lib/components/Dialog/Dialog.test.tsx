import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import {
  Mock,
  MockInstance,
  expect,
  vi,
  describe,
  beforeEach,
  afterEach,
  it,
} from 'vitest';
import axe from '../../../tests/axe-helper';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

const OPEN_TEXT = 'Open';
const CLOSE_TEXT = 'Close';
const TITLE_TEXT = 'Title';

const NoLabelDialogTest = (props: React.ComponentProps<typeof Dialog>) => (
  <Dialog {...props}>
    <DialogTrigger>{OPEN_TEXT}</DialogTrigger>
    <DialogOverlay />
    <DialogContent />
  </Dialog>
);

const UndefinedDescribedByDialogTest = (
  props: React.ComponentProps<typeof Dialog>,
) => (
  <Dialog {...props}>
    <DialogTrigger>{OPEN_TEXT}</DialogTrigger>
    <DialogOverlay />
    <DialogContent aria-describedby={undefined}>
      <DialogTitle>{TITLE_TEXT}</DialogTitle>
    </DialogContent>
  </Dialog>
);

const DialogTest = (props: React.ComponentProps<typeof Dialog>) => (
  <Dialog {...props}>
    <DialogTrigger>{OPEN_TEXT}</DialogTrigger>
    <DialogOverlay />
    <DialogContent>
      <DialogTitle>{TITLE_TEXT}</DialogTitle>
    </DialogContent>
  </Dialog>
);

const renderAndClickDialogTrigger = (dialog: React.ReactNode) => {
  fireEvent.click(render(dialog).getByText(OPEN_TEXT));
};

describe('Dialog', () => {
  describe('given a default Dialog', () => {
    let rendered: RenderResult;
    let trigger: HTMLElement;
    let closeButton: HTMLElement;
    let consoleWarnMock: MockInstance<any, any>;
    let consoleWarnMockFn: Mock;

    beforeEach(() => {
      // This surpresses React error boundary logs for testing intentionally
      // thrown errors, like in some test cases in this suite. See discussion of
      // this here: https://github.com/facebook/react/issues/11098
      consoleWarnMockFn = vi.fn();
      consoleWarnMock = vi
        .spyOn(console, 'warn')
        .mockImplementation(consoleWarnMockFn);

      rendered = render(<DialogTest />);
      trigger = rendered.getByText(OPEN_TEXT);
    });

    afterEach(() => {
      cleanup();
      consoleWarnMock.mockRestore();
      consoleWarnMockFn.mockClear();
    });

    it('should have no accessibility violations in default state', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    describe('after clicking the trigger', () => {
      beforeEach(() => {
        fireEvent.click(trigger);
        closeButton = rendered.getByText(CLOSE_TEXT).parentNode as HTMLElement;
      });

      describe('when no description has been provided', () => {
        it('should warn to the console', () => {
          expect(consoleWarnMockFn).toHaveBeenCalledTimes(1);
        });
      });

      describe('when no title has been provided', () => {
        it('should throw an error', () => {
          expect(() => {
            renderAndClickDialogTrigger(<NoLabelDialogTest />);
          }).toThrowError();
        });
      });

      describe('when aria-describedby is set to undefined', () => {
        beforeEach(() => {
          cleanup();
        });

        it('should not warn to the console', () => {
          consoleWarnMockFn.mockClear();

          renderAndClickDialogTrigger(<UndefinedDescribedByDialogTest />);
          expect(consoleWarnMockFn).not.toHaveBeenCalled();
        });
      });

      it('should open the content', () => {
        expect(closeButton).toBeVisible();
      });

      it('should have no accessibility violations', async () => {
        expect(await axe(rendered.container)).toHaveNoViolations();
      });

      it('should focus the close button', () => {
        expect(closeButton).toHaveFocus();
      });

      describe('when pressing escape', () => {
        beforeEach(() => {
          fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
        });

        it('should close the content', () => {
          expect(closeButton).not.toBeInTheDocument();
        });
      });
    });
  });
});
