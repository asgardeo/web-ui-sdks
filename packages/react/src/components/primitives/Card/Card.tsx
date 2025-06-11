/**
 * Copyright (import {CSSProperties, HTMLAttributes, forwardRef, useMemo, ReactNode, ForwardRefExoticComponent, Ref} from 'react';
import {useTheme} from '../../../theme/useTheme'; 2025, WSO2 LLC. (https://www.wso2.com).
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

import {
  CSSProperties,
  HTMLAttributes,
  forwardRef,
  useMemo,
  ReactNode,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import {useTheme} from '../../../contexts/Theme/useTheme';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';

export type CardVariant = 'default' | 'outlined' | 'elevated';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant of the card
   */
  variant?: CardVariant;
  /**
   * Whether the card should be clickable (shows hover effects)
   */
  clickable?: boolean;
  /**
   * Card content
   */
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Header content
   */
  children?: ReactNode;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Title content
   */
  children?: ReactNode;
  /**
   * The heading level to use
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * Description content
   */
  children?: ReactNode;
}

export interface CardActionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Action content
   */
  children?: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Content
   */
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Footer content
   */
  children?: ReactNode;
}

const useCardStyles = (variant: CardVariant, clickable: boolean) => {
  const {theme} = useTheme();

  return useMemo(() => {
    const baseStyles: CSSProperties = {
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.background.surface,
      border: `1px solid ${theme.colors.border}`,
      transition: 'all 0.2s ease-in-out',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    };

    const variantStyles: Record<CardVariant, CSSProperties> = {
      default: {
        ...baseStyles,
      },
      outlined: {
        ...baseStyles,
        border: `2px solid ${theme.colors.border}`,
        backgroundColor: 'transparent',
      },
      elevated: {
        ...baseStyles,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: 'none',
      },
    };

    const clickableStyles: CSSProperties = clickable
      ? {
          cursor: 'pointer',
        }
      : {};

    return {
      ...variantStyles[variant],
      ...clickableStyles,
    };
  }, [theme, variant, clickable]);
};

const useCardHeaderStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px 0`,
      display: 'flex',
      flexDirection: 'column',
      gap: `${theme.spacing.unit}px`,
    }),
    [theme],
  );
};

const useCardTitleStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      margin: 0,
      color: theme.colors.text.primary,
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    }),
    [theme],
  );
};

const useCardDescriptionStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      margin: 0,
      color: theme.colors.text.secondary,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    }),
    [theme],
  );
};

const useCardActionStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      marginTop: `${theme.spacing.unit}px`,
    }),
    [theme],
  );
};

const useCardContentStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      padding: `${theme.spacing.unit * 2}px`,
      flex: 1,
    }),
    [theme],
  );
};

const useCardFooterStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      padding: `0 ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
      display: 'flex',
      alignItems: 'center',
      gap: `${theme.spacing.unit}px`,
    }),
    [theme],
  );
};

/**
 * Card component that provides a flexible container for content.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" clickable>
 *   <Card.Header>
 *     <Card.Title>Card Title</Card.Title>
 *     <Card.Description>Card Description</Card.Description>
 *     <Card.Action>
 *       <Button variant="link">Action</Button>
 *     </Card.Action>
 *   </Card.Header>
 *   <Card.Content>
 *     <p>Card content goes here</p>
 *   </Card.Content>
 *   <Card.Footer>
 *     <Button>Cancel</Button>
 *     <Button variant="outline">Submit</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({variant = 'default', clickable = false, children, className, style, ...rest}, ref) => {
    const cardStyle = useCardStyles(variant, clickable);

    return (
      <div
        ref={ref}
        style={{...cardStyle, ...style}}
        className={clsx(
          withVendorCSSClassPrefix('card'),
          withVendorCSSClassPrefix(`card-${variant}`),
          {
            [withVendorCSSClassPrefix('card-clickable')]: clickable,
          },
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/**
 * Card header component that contains the title, description, and optional actions.
 */
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({children, className, style, ...rest}, ref) => {
  const headerStyle = useCardHeaderStyles();

  return (
    <div
      ref={ref}
      style={{...headerStyle, ...style}}
      className={clsx(withVendorCSSClassPrefix('card-header'), className)}
      {...rest}
    >
      {children}
    </div>
  );
});

/**
 * Card title component.
 */
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({children, level = 3, className, style, ...rest}, ref) => {
    const titleStyle = useCardTitleStyles();

    if (level === 1) {
      return (
        <h1
          ref={ref}
          style={{...titleStyle, ...style}}
          className={clsx(withVendorCSSClassPrefix('card-title'), className)}
          {...rest}
        >
          {children}
        </h1>
      );
    }

    if (level === 2) {
      return (
        <h2
          ref={ref}
          style={{...titleStyle, ...style}}
          className={clsx(withVendorCSSClassPrefix('card-title'), className)}
          {...rest}
        >
          {children}
        </h2>
      );
    }

    if (level === 4) {
      return (
        <h4
          ref={ref}
          style={{...titleStyle, ...style}}
          className={clsx(withVendorCSSClassPrefix('card-title'), className)}
          {...rest}
        >
          {children}
        </h4>
      );
    }

    if (level === 5) {
      return (
        <h5
          ref={ref}
          style={{...titleStyle, ...style}}
          className={clsx(withVendorCSSClassPrefix('card-title'), className)}
          {...rest}
        >
          {children}
        </h5>
      );
    }

    if (level === 6) {
      return (
        <h6
          ref={ref}
          style={{...titleStyle, ...style}}
          className={clsx(withVendorCSSClassPrefix('card-title'), className)}
          {...rest}
        >
          {children}
        </h6>
      );
    }

    // Default to h3
    return (
      <h3
        ref={ref}
        style={{...titleStyle, ...style}}
        className={clsx(withVendorCSSClassPrefix('card-title'), className)}
        {...rest}
      >
        {children}
      </h3>
    );
  },
);

/**
 * Card description component.
 */
const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({children, className, style, ...rest}, ref) => {
    const descriptionStyle = useCardDescriptionStyles();

    return (
      <p
        ref={ref}
        style={{...descriptionStyle, ...style}}
        className={clsx(withVendorCSSClassPrefix('card-description'), className)}
        {...rest}
      >
        {children}
      </p>
    );
  },
);

/**
 * Card action component for action elements in the header.
 */
const CardAction = forwardRef<HTMLDivElement, CardActionProps>(({children, className, style, ...rest}, ref) => {
  const actionStyle = useCardActionStyles();

  return (
    <div
      ref={ref}
      style={{...actionStyle, ...style}}
      className={clsx(withVendorCSSClassPrefix('card-action'), className)}
      {...rest}
    >
      {children}
    </div>
  );
});

/**
 * Card content component that contains the main content of the card.
 */
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({children, className, style, ...rest}, ref) => {
  const contentStyle = useCardContentStyles();

  return (
    <div
      ref={ref}
      style={{...contentStyle, ...style}}
      className={clsx(withVendorCSSClassPrefix('card-content'), className)}
      {...rest}
    >
      {children}
    </div>
  );
});

/**
 * Card footer component that contains footer actions or additional information.
 */
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({children, className, style, ...rest}, ref) => {
  const footerStyle = useCardFooterStyles();

  return (
    <div
      ref={ref}
      style={{...footerStyle, ...style}}
      className={clsx(withVendorCSSClassPrefix('card-footer'), className)}
      {...rest}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardTitle.displayName = 'Card.Title';
CardDescription.displayName = 'Card.Description';
CardAction.displayName = 'Card.Action';
CardContent.displayName = 'Card.Content';
CardFooter.displayName = 'Card.Footer';

// Attach subcomponents to Card for dot notation usage
(Card as any).Header = CardHeader;
(Card as any).Title = CardTitle;
(Card as any).Description = CardDescription;
(Card as any).Action = CardAction;
(Card as any).Content = CardContent;
(Card as any).Footer = CardFooter;

// TypeScript interface augmentation for dot notation
export interface CardComponent extends ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>> {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Action: typeof CardAction;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
}

export default Card as CardComponent;
export {Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter};
