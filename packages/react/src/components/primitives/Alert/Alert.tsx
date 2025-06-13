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

import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  RefAttributes,
  ForwardRefExoticComponent,
  useMemo,
} from 'react';
import {useTheme} from '../../../contexts/Theme/useTheme';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';
import Typography from '../Typography/Typography';
import CircleCheck from '../Icons/CircleCheck';
import CircleAlert from '../Icons/CircleAlert';
import TriangleAlert from '../Icons/TriangleAlert';
import Info from '../Icons/Info';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The visual variant of the alert that determines color scheme and icon
   */
  variant?: AlertVariant;
  /**
   * Whether to show the default icon for the variant
   */
  showIcon?: boolean;
  /**
   * Alert content
   */
  children?: ReactNode;
}

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Title content
   */
  children?: ReactNode;
}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * Description content
   */
  children?: ReactNode;
}

const useAlertStyles = (variant: AlertVariant) => {
  const {theme} = useTheme();

  return useMemo(() => {
    const variantStyles: Record<AlertVariant, CSSProperties> = {
      success: {
        backgroundColor: '#d4edda',
        borderColor: '#28a745',
        color: '#155724',
      },
      error: {
        backgroundColor: `${theme.colors.error.main}15`,
        borderColor: theme.colors.error.main,
        color: theme.colors.error.main,
      },
      warning: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffc107',
        color: '#856404',
      },
      info: {
        backgroundColor: `${theme.colors.primary.main}15`,
        borderColor: theme.colors.primary.main,
        color: theme.colors.primary.main,
      },
    };

    return {
      padding: `${theme.spacing.unit * 2}px`,
      borderRadius: theme.borderRadius.medium,
      border: '1px solid',
      display: 'flex',
      gap: `${theme.spacing.unit * 1.5}px`,
      alignItems: 'flex-start',
      ...variantStyles[variant],
    };
  }, [theme, variant]);
};

const useAlertIconStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      flexShrink: 0,
      marginTop: '2px', // Slight alignment adjustment
      width: '20px',
      height: '20px',
    }),
    [theme],
  );
};

const useAlertContentStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: `${theme.spacing.unit}px`,
    }),
    [theme],
  );
};

const useAlertTitleStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.4,
      color: 'inherit',
    }),
    [theme],
  );
};

const useAlertDescriptionStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    (): CSSProperties => ({
      margin: 0,
      fontSize: '14px',
      lineHeight: 1.4,
      color: theme.colors.text.secondary,
    }),
    [theme],
  );
};

const getDefaultIcon = (variant: AlertVariant) => {
  switch (variant) {
    case 'success':
      return CircleCheck;
    case 'error':
      return CircleAlert;
    case 'warning':
      return TriangleAlert;
    case 'info':
      return Info;
    default:
      return Info;
  }
};

/**
 * Alert component that displays important information with different severity levels.
 *
 * @example
 * ```tsx
 * <Alert variant="success" showIcon>
 *   <Alert.Title>Success! Your changes have been saved</Alert.Title>
 *   <Alert.Description>
 *     This is an alert with icon, title and description.
 *   </Alert.Description>
 * </Alert>
 * ```
 */
const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({variant = 'info', showIcon = true, children, className, style, ...rest}, ref) => {
    const alertStyle = useAlertStyles(variant);
    const iconStyle = useAlertIconStyles();
    const contentStyle = useAlertContentStyles();
    const IconComponent = getDefaultIcon(variant);

    return (
      <div
        ref={ref}
        role="alert"
        style={{...alertStyle, ...style}}
        className={clsx(withVendorCSSClassPrefix('alert'), withVendorCSSClassPrefix(`alert-${variant}`), className)}
        {...rest}
      >
        {showIcon && (
          <div style={iconStyle} className={withVendorCSSClassPrefix('alert-icon')}>
            <IconComponent />
          </div>
        )}
        <div style={contentStyle} className={withVendorCSSClassPrefix('alert-content')}>
          {children}
        </div>
      </div>
    );
  },
);

/**
 * Alert title component.
 */
const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(({children, className, style, ...rest}, ref) => {
  const titleStyle = useAlertTitleStyles();

  // Filter out conflicting props that shouldn't be passed to Typography
  const {color, ...filteredRest} = rest;

  return (
    <Typography
      component="h3"
      variant="h6"
      fontWeight={600}
      style={{...titleStyle, ...style}}
      className={clsx(withVendorCSSClassPrefix('alert-title'), className)}
      {...filteredRest}
    >
      {children}
    </Typography>
  );
});

/**
 * Alert description component.
 */
const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({children, className, style, ...rest}, ref) => {
    const descriptionStyle = useAlertDescriptionStyles();

    // Filter out conflicting props that shouldn't be passed to Typography
    const {color, ...filteredRest} = rest;

    return (
      <Typography
        component="p"
        variant="body2"
        style={{...descriptionStyle, ...style}}
        className={clsx(withVendorCSSClassPrefix('alert-description'), className)}
        {...filteredRest}
      >
        {children}
      </Typography>
    );
  },
);

Alert.displayName = 'Alert';
AlertTitle.displayName = 'Alert.Title';
AlertDescription.displayName = 'Alert.Description';

// Attach subcomponents to Alert for dot notation usage
(Alert as any).Title = AlertTitle;
(Alert as any).Description = AlertDescription;

// TypeScript interface augmentation for dot notation
export interface AlertComponent extends ForwardRefExoticComponent<AlertProps & RefAttributes<HTMLDivElement>> {
  Title: typeof AlertTitle;
  Description: typeof AlertDescription;
}

export default Alert as AlertComponent;
export {Alert, AlertTitle, AlertDescription};
