/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, {CSSProperties, useMemo} from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useId,
  UseFloatingReturn,
  UseInteractionsReturn,
} from '@floating-ui/react';
import useTheme from '../../../contexts/Theme/useTheme';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';
import Button from '../Button/Button';

const useStyles = () => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      } as CSSProperties,
      content: {
        background: theme.colors.background.surface,
        borderRadius: theme.borderRadius.large,
        boxShadow: `0 2px 8px ${colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)'}`,
        outline: 'none',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 10000,
      } as CSSProperties,
      dropdownContent: {
        background: theme.colors.background.surface,
        borderRadius: theme.borderRadius.large,
        boxShadow: `0 2px 8px ${colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)'}`,
        outline: 'none',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 10000,
      } as CSSProperties,
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4.5}px`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      headerTitle: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: 600,
        color: theme.colors.text.primary,
      } as CSSProperties,
      contentBody: {
        padding: `${theme.spacing.unit * 2}px`,
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

// Modal Dialog hook and components
interface DialogOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Return type for dialog hook
interface DialogHookReturn extends UseFloatingReturn, UseInteractionsReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  labelId: string | undefined;
  descriptionId: string | undefined;
  setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function useDialog({
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: DialogOptions = {}): DialogHookReturn {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context, {outsidePressEvent: 'mousedown'});
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, labelId, descriptionId],
  );
}

// Dropdown Popover hook
interface PopoverOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  offset?: number;
}

// Return type for popover hook
interface PopoverHookReturn extends UseFloatingReturn, UseInteractionsReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  labelId: string | undefined;
  descriptionId: string | undefined;
  setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function usePopover({
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  placement = 'bottom',
  offset: offsetValue = 5,
}: PopoverOptions = {}): PopoverHookReturn {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(offsetValue), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement,
  });

  const context = data.context;

  const click = useClick(context);
  const dismiss = useDismiss(context, {outsidePressEvent: 'mousedown'});
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, labelId, descriptionId],
  );
}

// Context types
type DialogContextType =
  | (DialogHookReturn & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    })
  | null;

type PopoverContextType =
  | (PopoverHookReturn & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
    })
  | null;

const DialogContext = React.createContext<DialogContextType>(null);
const PopoverContext = React.createContext<PopoverContextType>(null);

export const useDialogContext = (): DialogHookReturn => {
  const context = React.useContext(DialogContext);
  if (context == null) {
    throw new Error('Dialog components must be wrapped in <Dialog />');
  }
  return context;
};

export const usePopoverContext = (): PopoverHookReturn => {
  const context = React.useContext(PopoverContext);
  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }
  return context;
};

// Dialog Components (Modal)
export function Dialog({children, ...options}: {children: React.ReactNode} & DialogOptions) {
  const dialog = useDialog(options);
  return <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & DialogTriggerProps>(
  function DialogTrigger({children, asChild = false, ...props}, propRef) {
    const context = useDialogContext();
    const childrenRef = (children as any).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...(children.props as any),
          'data-state': context.open ? 'open' : 'closed',
        }),
      );
    }

    return (
      <button ref={ref} data-state={context.open ? 'open' : 'closed'} {...context.getReferenceProps(props)}>
        {children}
      </button>
    );
  },
);

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function DialogContent(
  props,
  propRef,
) {
  const {context: floatingContext, ...context} = useDialogContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  const styles = useStyles();

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay className={withVendorCSSClassPrefix('popover-overlay')} style={styles.overlay} lockScroll>
        <FloatingFocusManager context={floatingContext}>
          <div
            ref={ref}
            style={styles.content}
            className={clsx(withVendorCSSClassPrefix('popover-content'), props.className)}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...context.getFloatingProps(props)}
          >
            {props.children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
});

// Popover Components (Dropdown)
export function Popover({children, ...options}: {children: React.ReactNode} & PopoverOptions) {
  const popover = usePopover(options);
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & PopoverTriggerProps>(
  function PopoverTrigger({children, asChild = false, ...props}, propRef) {
    const context = usePopoverContext();
    const childrenRef = (children as any).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...(children.props as any),
          'data-state': context.open ? 'open' : 'closed',
        }),
      );
    }

    return (
      <button ref={ref} data-state={context.open ? 'open' : 'closed'} {...context.getReferenceProps(props)}>
        {children}
      </button>
    );
  },
);

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function PopoverContent(
  props,
  propRef,
) {
  const {context: floatingContext, ...context} = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  const styles = useStyles();

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext}>
        <div
          ref={ref}
          style={{...styles.dropdownContent, ...context.floatingStyles}}
          className={clsx(withVendorCSSClassPrefix('popover-content'), props.className)}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(props)}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});

// Shared components
export const PopoverHeading = React.forwardRef<HTMLHeadingElement, React.HTMLProps<HTMLHeadingElement>>(
  function PopoverHeading({children, ...props}, ref) {
    const context = usePopoverContext();
    const styles = useStyles();
    const id = useId();

    React.useLayoutEffect(() => {
      context.setLabelId(id);
      return () => context.setLabelId(undefined);
    }, [id, context.setLabelId]);

    return (
      <div style={styles.header}>
        <h2 {...props} ref={ref} id={id} style={styles.headerTitle}>
          {children}
        </h2>
        <Button color="tertiary" variant="text" size="small" onClick={() => context.setOpen(false)} aria-label="Close">
          ×
        </Button>
      </div>
    );
  },
);

export const DialogHeading = React.forwardRef<HTMLHeadingElement, React.HTMLProps<HTMLHeadingElement>>(
  function DialogHeading({children, ...props}, ref) {
    const context = useDialogContext();
    const styles = useStyles();
    const id = useId();

    React.useLayoutEffect(() => {
      context.setLabelId(id);
      return () => context.setLabelId(undefined);
    }, [id, context.setLabelId]);

    return (
      <div style={styles.header}>
        <h2 {...props} ref={ref} id={id} style={styles.headerTitle}>
          {children}
        </h2>
        <Button color="tertiary" variant="text" size="small" onClick={() => context.setOpen(false)} aria-label="Close">
          ×
        </Button>
      </div>
    );
  },
);

export const PopoverDescription = React.forwardRef<HTMLParagraphElement, React.HTMLProps<HTMLParagraphElement>>(
  function PopoverDescription({children, ...props}, ref) {
    const context = usePopoverContext();
    const id = useId();

    React.useLayoutEffect(() => {
      context.setDescriptionId(id);
      return () => context.setDescriptionId(undefined);
    }, [id, context.setDescriptionId]);

    return (
      <p {...props} ref={ref} id={id}>
        {children}
      </p>
    );
  },
);

export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLProps<HTMLParagraphElement>>(
  function DialogDescription({children, ...props}, ref) {
    const context = useDialogContext();
    const id = useId();

    React.useLayoutEffect(() => {
      context.setDescriptionId(id);
      return () => context.setDescriptionId(undefined);
    }, [id, context.setDescriptionId]);

    return (
      <p {...props} ref={ref} id={id}>
        {children}
      </p>
    );
  },
);

export const PopoverClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function PopoverClose(props, ref) {
    const context = usePopoverContext();
    return <button type="button" {...props} ref={ref} onClick={() => context.setOpen(false)} />;
  },
);

export const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function DialogClose(props, ref) {
    const context = useDialogContext();
    return <button type="button" {...props} ref={ref} onClick={() => context.setOpen(false)} />;
  },
);

// Legacy API compatibility (for existing code)
interface LegacyPopoverProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  mode?: 'modal' | 'dropdown';
  trigger?: HTMLElement | null;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  offset?: number;
}

// Legacy Header component for backward compatibility
const LegacyPopoverHeader: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const styles = useStyles();

  return <div style={styles.header}>{children && <h3 style={styles.headerTitle}>{children}</h3>}</div>;
};

// Legacy Content component for backward compatibility
const LegacyPopoverContent: React.FC<{children: React.ReactNode}> = ({children}) => {
  const styles = useStyles();
  return <div style={styles.contentBody}>{children}</div>;
};

// Legacy component for backward compatibility
export const LegacyPopover: React.FC<LegacyPopoverProps> & {
  Header: typeof LegacyPopoverHeader;
  Content: typeof LegacyPopoverContent;
} = ({isOpen, children, onClose, className = '', mode = 'modal', trigger, placement, offset}) => {
  if (mode === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={className}>{children}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onClose} placement={placement} offset={offset}>
      <PopoverContent className={className}>{children}</PopoverContent>
    </Popover>
  );
};

LegacyPopover.Header = LegacyPopoverHeader;
LegacyPopover.Content = LegacyPopoverContent;

// Export the legacy component as default for backward compatibility
export default LegacyPopover;
