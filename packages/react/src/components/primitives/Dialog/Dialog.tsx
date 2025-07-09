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

import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import {
  useFloating,
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
import {cx} from '@emotion/css';
import React from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import Button from '../Button/Button';
import {X} from '../Icons';
import useStyles from './Dialog.styles';

interface DialogOptions {
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

interface DialogHookReturn extends UseFloatingReturn, UseInteractionsReturn {
  descriptionId: string | undefined;
  labelId: string | undefined;
  open: boolean;
  setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpen: (open: boolean) => void;
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

  const {context} = data;

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

type DialogContextType =
  | (DialogHookReturn & {
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
    })
  | null;

const DialogContext = React.createContext<DialogContextType>(null);

export const useDialogContext = (): DialogHookReturn => {
  const context = React.useContext(DialogContext);
  if (context == null) {
    throw new Error('Dialog components must be wrapped in <Dialog />');
  }
  return context;
};

// Dialog Components (Modal)
export function Dialog({children, ...options}: {children: React.ReactNode} & DialogOptions) {
  const dialog = useDialog(options);
  return <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export const DialogTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & DialogTriggerProps>(
  ({children, asChild = false, ...props}, propRef) => {
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

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, propRef) => {
  const {context: floatingContext, ...context} = useDialogContext();
  const {theme, colorScheme} = useTheme();
  const styles = useStyles(theme, colorScheme);
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay className={cx(withVendorCSSClassPrefix(bem('dialog', 'overlay')), styles.overlay)} lockScroll>
        <FloatingFocusManager context={floatingContext}>
          <div
            ref={ref}
            className={cx(withVendorCSSClassPrefix(bem('dialog', 'content')), styles.content, props.className)}
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

export const DialogHeading = React.forwardRef<HTMLHeadingElement, React.HTMLProps<HTMLHeadingElement>>(
  ({children, ...props}, ref) => {
    const context = useDialogContext();
    const {theme, colorScheme} = useTheme();
    const styles = useStyles(theme, colorScheme);
    const id = useId();

    React.useLayoutEffect(() => {
      context.setLabelId(id);
      return () => context.setLabelId(undefined);
    }, [id, context.setLabelId]);

    return (
      <div className={cx(withVendorCSSClassPrefix(bem('dialog', 'header')), styles.header)}>
        <h2
          {...props}
          ref={ref}
          id={id}
          className={cx(withVendorCSSClassPrefix(bem('dialog', 'title')), styles.headerTitle)}
        >
          {children}
        </h2>
        <Button color="tertiary" variant="text" size="small" onClick={() => context.setOpen(false)} aria-label="Close">
          <X width={16} height={16} />
        </Button>
      </div>
    );
  },
);

export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLProps<HTMLParagraphElement>>(
  ({children, ...props}, ref) => {
    const context = useDialogContext();
    const {theme, colorScheme} = useTheme();
    const styles = useStyles(theme, colorScheme);
    const id = useId();

    React.useLayoutEffect(() => {
      context.setDescriptionId(id);
      return () => context.setDescriptionId(undefined);
    }, [id, context.setDescriptionId]);

    return (
      <p
        {...props}
        ref={ref}
        id={id}
        className={cx(withVendorCSSClassPrefix(bem('dialog', 'description')), styles.description, props.className)}
      >
        {children}
      </p>
    );
  },
);

interface DialogCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & DialogCloseProps
>(({children, asChild = false, ...props}, propRef) => {
  const context = useDialogContext();
  const {theme, colorScheme} = useTheme();
  const styles = useStyles(theme, colorScheme);
  const childrenRef = (children as any)?.ref;
  const ref = useMergeRefs([propRef, childrenRef]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    context.setOpen(false);
    props.onClick?.(event);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      ...props,
      ...(children.props as any),
      onClick: handleClick,
    });
  }

  return (
    <button
      type="button"
      {...props}
      ref={ref}
      onClick={handleClick}
      className={cx(withVendorCSSClassPrefix(bem('dialog', 'close')), styles.closeButton, props.className)}
    >
      {children}
    </button>
  );
});

DialogTrigger.displayName = 'DialogTrigger';
DialogContent.displayName = 'DialogContent';
DialogHeading.displayName = 'DialogHeading';
DialogDescription.displayName = 'DialogDescription';
DialogClose.displayName = 'DialogClose';
