import React from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';
import {
  createContext,
  createContextScope,
  type Scope,
} from '../../common/context';
import { useControllableState, useFocusGuards, useId } from '../../hooks';
import { composeEventHandlers, Primitive } from '../Primitive';
import { Portal as PortalPrimitive } from '../Portal';
import { useComposedRefs } from '../../common/utils';

import type * as Jelly from '../Primitive';
import { Presence } from '../Presence';
import { Slot } from '../Slot';
import { DismissableLayer } from '../DismissableLayer';
import { FocusScope } from '../FocusScope';

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DIALOG_NAME = 'Dialog';

type ScopedProps<P> = P & { __scopeDialog?: Scope };
const [createDialogContext, createDialogScope] =
  createContextScope(DIALOG_NAME);

interface DialogContextValue {
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<DialogContentElement>;
  contentId: string;
  titleId: string;
  descriptionId: string;
  open: boolean;
  modal: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenToggle: () => void;
}

const [DialogProvider, useDialogContext] =
  createDialogContext<DialogContextValue>(DIALOG_NAME);

interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog: React.FC<DialogProps> = ({
  __scopeDialog,
  children,
  open: openProp,
  defaultOpen,
  modal = true,
  onOpenChange,
}: ScopedProps<DialogProps>) => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<DialogContentElement>(null);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <DialogProvider
      scope={__scopeDialog}
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={useId()}
      titleId={useId()}
      descriptionId={useId()}
      open={open}
      modal={modal}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(
        () => setOpen((prevOpen) => !prevOpen),
        [setOpen],
      )}
    >
      {children}
    </DialogProvider>
  );
};
Dialog.displayName = DIALOG_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DialogTrigger';

type DialogTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Jelly.ComponentPropsWithoutRef<
  typeof Primitive.button
>;
type DialogTriggerProps = PrimitiveButtonProps;

const DialogTrigger = React.forwardRef<
  DialogTriggerElement,
  DialogTriggerProps
>(
  (
    { __scopeDialog, ...triggerProps }: ScopedProps<DialogTriggerProps>,
    forwardedRef,
  ) => {
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(
      forwardedRef,
      context.triggerRef,
    );

    return (
      <Primitive.button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...triggerProps}
        ref={composedTriggerRef}
        onClick={composeEventHandlers(
          triggerProps?.onClick,
          context.onOpenToggle,
        )}
      />
    );
  },
);
DialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'DialogPortal';

interface PortalContextValue {
  forceMount?: true;
}
const [PortalProvider, usePortalContext] =
  createDialogContext<PortalContextValue>(PORTAL_NAME, {
    forceMount: undefined,
  });

type PortalProps = Jelly.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface DialogPortalProps {
  children?: React.ReactNode;
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps['container'];
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const DialogPortal: React.FC<DialogPortalProps> = ({
  __scopeDialog,
  children,
  container,
  forceMount,
}: ScopedProps<DialogPortalProps>) => {
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return (
    <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
      {React.Children.map(children, (child) => (
        <Presence present={forceMount || context.open}>
          <PortalPrimitive asChild container={container}>
            {child}
          </PortalPrimitive>
        </Presence>
      ))}
    </PortalProvider>
  );
};
DialogPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay';

type DialogOverlayElement = DialogOverlayImplElement;
interface DialogOverlayProps extends DialogOverlayImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const DialogOverlay = React.forwardRef<
  DialogOverlayElement,
  DialogOverlayProps
>((props: ScopedProps<DialogOverlayProps>, forwardedRef) => {
  const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
  const { forceMount = portalContext.forceMount, ...overlayProps } = props;
  const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);

  return context.modal ? (
    <Presence present={forceMount || context.open}>
      <DialogOverlayImpl {...overlayProps} ref={forwardedRef} />
    </Presence>
  ) : null;
});
DialogOverlay.displayName = OVERLAY_NAME;

type DialogOverlayImplElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Jelly.ComponentPropsWithoutRef<typeof Primitive.div>;
type DialogOverlayImplProps = PrimitiveDivProps;

const DialogOverlayImpl = React.forwardRef<
  DialogOverlayImplElement,
  DialogOverlayImplProps
>(
  (
    { __scopeDialog, ...overlayProps }: ScopedProps<DialogOverlayImplProps>,
    forwardedRef,
  ) => {
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);

    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      <RemoveScroll as={Slot} allowPinchZoom shards={[context.contentRef]}>
        <Primitive.div
          data-state={getState(context.open)}
          {...overlayProps}
          ref={forwardedRef}
          // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
          style={{ pointerEvents: 'auto', ...overlayProps.style }}
        />
      </RemoveScroll>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent';

type DialogContentElement = DialogContentTypeElement;
interface DialogContentProps extends DialogContentTypeProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const DialogContent = React.forwardRef<
  DialogContentElement,
  DialogContentProps
>((props: ScopedProps<DialogContentProps>, forwardedRef) => {
  const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
  const { forceMount = portalContext.forceMount, ...contentProps } = props;
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);

  return (
    <Presence present={forceMount || context.open}>
      {context.modal ? (
        <DialogContentModal {...contentProps} ref={forwardedRef} />
      ) : (
        <DialogContentNonModal {...contentProps} ref={forwardedRef} />
      )}
    </Presence>
  );
});
DialogContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

type DialogContentTypeElement = DialogContentImplElement;
type DialogContentTypeProps = Omit<
  DialogContentImplProps,
  'trapFocus' | 'disableOutsidePointerEvents'
>;

const DialogContentModal = React.forwardRef<
  DialogContentTypeElement,
  DialogContentTypeProps
>((props: ScopedProps<DialogContentTypeProps>, forwardedRef) => {
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const composedRefs = useComposedRefs(
    forwardedRef,
    context.contentRef,
    contentRef,
  );

  // aria-hide everything except the content (better supported equivalent to an aria-modal)
  React.useEffect(() => {
    const content = contentRef.current;
    if (content) return hideOthers(content);
  }, []);

  return (
    <DialogContentImpl
      {...props}
      ref={composedRefs}
      // we make sure focus isn't trapped once `DialogContent` has been closed
      // (closed !== unmounted when animating out)
      trapFocus={context.open}
      disableOutsidePointerEvents
      onCloseAutoFocus={composeEventHandlers(
        props.onCloseAutoFocus,
        (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        },
      )}
      onPointerDownOutside={composeEventHandlers(
        props.onPointerDownOutside,
        (event) => {
          const { originalEvent } = event.detail;
          const ctrlLeftClick =
            originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;

          // If the event is a right-click, we shouldn't close because
          // it is effectively as if we right-clicked the `Overlay`.
          if (isRightClick) event.preventDefault();
        },
      )}
      // When focus is trapped, a `focusout` event may still happen.
      // We make sure we don't trigger our `onDismiss` in such case.
      onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) =>
        event.preventDefault(),
      )}
    />
  );
});

/* -----------------------------------------------------------------------------------------------*/

const DialogContentNonModal = React.forwardRef<
  DialogContentTypeElement,
  DialogContentTypeProps
>((props: ScopedProps<DialogContentTypeProps>, forwardedRef) => {
  const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
  const hasInteractiveOutsideRef = React.useRef(false);
  const hasPointerDownOutsideRef = React.useRef(false);

  return (
    <DialogContentImpl
      {...props}
      ref={forwardedRef}
      trapFocus={false}
      disableOutsidePointerEvents={false}
      onCloseAutoFocus={(event) => {
        props.onCloseAutoFocus?.(event);

        if (!event.defaultPrevented) {
          if (!hasInteractiveOutsideRef.current)
            context.triggerRef.current?.focus();
          // Always prevent auto focus because we either focus manually or want user agent focus
          event.preventDefault();
        }

        hasInteractiveOutsideRef.current = false;
        hasPointerDownOutsideRef.current = false;
      }}
      onInteractOutside={(event) => {
        props.onInteractOutside?.(event);

        if (!event.defaultPrevented) {
          hasInteractiveOutsideRef.current = true;
          if (event.detail.originalEvent.type === 'pointerdown') {
            hasPointerDownOutsideRef.current = true;
          }
        }

        // Prevent dismissing when clicking the trigger.
        // As the trigger is already setup to close, without doing so would
        // cause it to close and immediately open.
        const target = event.target as HTMLElement;
        const targetIsTrigger = context.triggerRef.current?.contains(target);
        if (targetIsTrigger) event.preventDefault();

        // On Safari if the trigger is inside a container with tabIndex={0}, when clicked
        // we will get the pointer down outside event on the trigger, but then a subsequent
        // focus outside event on the container, we ignore any focus outside event when we've
        // already had a pointer down outside event.
        if (
          event.detail.originalEvent.type === 'focusin' &&
          hasPointerDownOutsideRef.current
        ) {
          event.preventDefault();
        }
      }}
    />
  );
});

/* -----------------------------------------------------------------------------------------------*/

type DialogContentImplElement = React.ElementRef<typeof DismissableLayer>;
type DismissableLayerProps = Jelly.ComponentPropsWithoutRef<
  typeof DismissableLayer
>;
type FocusScopeProps = Jelly.ComponentPropsWithoutRef<typeof FocusScope>;
interface DialogContentImplProps
  extends Omit<DismissableLayerProps, 'onDismiss'> {
  /**
   * When `true`, focus cannot escape the `Content` via keyboard,
   * pointer, or a programmatic focus.
   * @defaultValue false
   */
  trapFocus?: FocusScopeProps['trapped'];
  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];
  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];
}

const DialogContentImpl = React.forwardRef<
  DialogContentImplElement,
  DialogContentImplProps
>(
  (
    {
      __scopeDialog,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      ...contentProps
    }: ScopedProps<DialogContentImplProps>,
    forwardedRef,
  ) => {
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);

    // Make sure the whole tree has focus guards as our `Dialog` will be
    // the last element in the DOM (because of the `Portal`)
    useFocusGuards();

    return (
      <>
        <FocusScope
          asChild
          loop
          trapped={trapFocus}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}
        >
          <DismissableLayer
            role="dialog"
            id={context.contentId}
            aria-describedby={context.descriptionId}
            aria-labelledby={context.titleId}
            data-state={getState(context.open)}
            {...contentProps}
            ref={composedRefs}
            onDismiss={() => context.onOpenChange(false)}
          />
        </FocusScope>
        {process.env.NODE_ENV !== 'production' && (
          <>
            <TitleWarning titleId={context.titleId} />
            <DescriptionWarning
              contentRef={contentRef}
              descriptionId={context.descriptionId}
            />
          </>
        )}
      </>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'DialogTitle';

type DialogTitleElement = React.ElementRef<typeof Primitive.h2>;
type PrimitiveHeading2Props = Jelly.ComponentPropsWithoutRef<
  typeof Primitive.h2
>;
type DialogTitleProps = PrimitiveHeading2Props;

const DialogTitle = React.forwardRef<DialogTitleElement, DialogTitleProps>(
  (
    { __scopeDialog, ...titleProps }: ScopedProps<DialogTitleProps>,
    forwardedRef,
  ) => {
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return (
      <Primitive.h2 id={context.titleId} {...titleProps} ref={forwardedRef} />
    );
  },
);
DialogTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'DialogDescription';

type DialogDescriptionElement = React.ElementRef<typeof Primitive.p>;
type PrimitiveParagraphProps = Jelly.ComponentPropsWithoutRef<
  typeof Primitive.p
>;
type DialogDescriptionProps = PrimitiveParagraphProps;

const DialogDescription = React.forwardRef<
  DialogDescriptionElement,
  DialogDescriptionProps
>(
  (
    { __scopeDialog, ...descriptionProps }: ScopedProps<DialogDescriptionProps>,
    forwardedRef,
  ) => {
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return (
      <Primitive.p
        id={context.descriptionId}
        {...descriptionProps}
        ref={forwardedRef}
      />
    );
  },
);
DialogDescription.displayName = DESCRIPTION_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose';

type DialogCloseElement = React.ElementRef<typeof Primitive.button>;
type DialogCloseProps = PrimitiveButtonProps;

const DialogClose = React.forwardRef<DialogCloseElement, DialogCloseProps>(
  (
    { __scopeDialog, ...closeProps }: ScopedProps<DialogCloseProps>,
    forwardedRef,
  ) => {
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return (
      <Primitive.button
        type="button"
        {...closeProps}
        aria-label="Close"
        ref={forwardedRef}
        onClick={composeEventHandlers(closeProps.onClick, () =>
          context.onOpenChange(false),
        )}
      />
    );
  },
);
DialogClose.displayName = CLOSE_NAME;

/* -----------------------------------------------------------------------------------------------*/

const getState = (open: boolean) => (open ? 'open' : 'closed');

const TITLE_WARNING_NAME = 'DialogTitleWarning';

const [WarningProvider, useWarningContext] = createContext(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
});

interface TitleWarningProps {
  titleId?: string;
}

const TitleWarning: React.FC<TitleWarningProps> = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);

  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it in a \`<VisuallyHidden asChild>\` component.`;

  React.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) throw new Error(MESSAGE);
    }
  }, [MESSAGE, titleId]);

  return null;
};

const DESCRIPTION_WARNING_NAME = 'DialogDescriptionWarning';

interface DescriptionWarningProps {
  contentRef: React.RefObject<DialogContentElement>;
  descriptionId?: string;
}

const DescriptionWarning: React.FC<DescriptionWarningProps> = ({
  contentRef,
  descriptionId,
}) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;

  React.useEffect(() => {
    const describedById = contentRef.current?.getAttribute('aria-describedby');
    // If we have an id and the user hasn't set aria-describedby={undefined}
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      // eslint-disable-next-line no-console
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, descriptionId, contentRef]);

  return null;
};

const Root = Dialog;
const Trigger = DialogTrigger;
const Portal = DialogPortal;
const Overlay = DialogOverlay;
const Content = DialogContent;
const Title = DialogTitle;
const Description = DialogDescription;
const Close = DialogClose;

export {
  createDialogScope,
  //
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  //
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
  //
  WarningProvider,
};

export type {
  DialogProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
};
