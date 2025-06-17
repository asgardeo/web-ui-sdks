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

import {CSSProperties, FC, ButtonHTMLAttributes, forwardRef, useMemo} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';
import Spinner, {SpinnerSize} from '../Spinner/Spinner';

export type ButtonColor = 'primary' | 'secondary' | 'tertiary' | string;
export type ButtonVariant = 'solid' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /**
   * The button color that determines the color scheme
   */
  color?: ButtonColor;
  /**
   * The button variant that determines the visual style
   */
  variant?: ButtonVariant;
  /**
   * The size of the button
   */
  size?: ButtonSize;
  /**
   * Whether the button should take the full width of its container
   */
  fullWidth?: boolean;
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  /**
   * Icon to display before the button text
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display after the button text
   */
  endIcon?: React.ReactNode;
}

const useButtonStyles = (
  color: ButtonColor,
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  disabled: boolean,
  loading: boolean,
) => {
  const {theme} = useTheme();

  return useMemo(() => {
    // Size configurations
    const sizeConfig = {
      small: {
        padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
        fontSize: '0.75rem',
        minHeight: '24px',
      },
      medium: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        fontSize: '0.875rem',
        minHeight: '32px',
      },
      large: {
        padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 3}px`,
        fontSize: '1rem',
        minHeight: '40px',
      },
    };

    // Color configurations based on color and variant
    const getColorConfig = () => {
      switch (color) {
        case 'primary':
          switch (variant) {
            case 'solid':
              return {
                backgroundColor: theme.colors.primary.main,
                color: theme.colors.primary.contrastText,
                border: `1px solid ${theme.colors.primary.main}`,
                '&:hover': {
                  backgroundColor: theme.colors.primary.main,
                  opacity: 0.9,
                },
                '&:active': {
                  backgroundColor: theme.colors.primary.main,
                  opacity: 0.8,
                },
              };
            case 'outline':
              return {
                backgroundColor: 'transparent',
                color: theme.colors.primary.main,
                border: `1px solid ${theme.colors.primary.main}`,
                '&:hover': {
                  backgroundColor: theme.colors.primary.main,
                  color: theme.colors.primary.contrastText,
                },
                '&:active': {
                  backgroundColor: theme.colors.primary.main,
                  color: theme.colors.primary.contrastText,
                  opacity: 0.9,
                },
              };
            case 'text':
              return {
                backgroundColor: 'transparent',
                color: theme.colors.primary.main,
                border: '1px solid transparent',
                '&:hover': {
                  backgroundColor: theme.colors.background.surface,
                },
                '&:active': {
                  backgroundColor: theme.colors.background.surface,
                  opacity: 0.8,
                },
              };
          }
          break;
        case 'secondary':
          switch (variant) {
            case 'solid':
              return {
                backgroundColor: theme.colors.secondary.main,
                color: theme.colors.secondary.contrastText,
                border: `1px solid ${theme.colors.secondary.main}`,
                '&:hover': {
                  backgroundColor: theme.colors.secondary.main,
                  opacity: 0.9,
                },
                '&:active': {
                  backgroundColor: theme.colors.secondary.main,
                  opacity: 0.8,
                },
              };
            case 'outline':
              return {
                backgroundColor: 'transparent',
                color: theme.colors.secondary.main,
                border: `1px solid ${theme.colors.secondary.main}`,
                '&:hover': {
                  backgroundColor: theme.colors.secondary.main,
                  color: theme.colors.secondary.contrastText,
                },
                '&:active': {
                  backgroundColor: theme.colors.secondary.main,
                  color: theme.colors.secondary.contrastText,
                  opacity: 0.9,
                },
              };
            case 'text':
              return {
                backgroundColor: 'transparent',
                color: theme.colors.secondary.main,
                border: '1px solid transparent',
                '&:hover': {
                  backgroundColor: theme.colors.background.surface,
                },
                '&:active': {
                  backgroundColor: theme.colors.background.surface,
                  opacity: 0.8,
                },
              };
          }
          break;
        case 'tertiary':
          switch (variant) {
            case 'solid':
              return {
                backgroundColor: theme.colors.text.secondary,
                color: theme.colors.background.surface,
                border: `1px solid ${theme.colors.text.secondary}`,
                '&:hover': {
                  backgroundColor: theme.colors.text.primary,
                  color: theme.colors.background.surface,
                },
                '&:active': {
                  backgroundColor: theme.colors.text.primary,
                  color: theme.colors.background.surface,
                  opacity: 0.9,
                },
              };
            case 'outline':
              return {
                backgroundColor: 'transparent',
                color: theme.colors.text.secondary,
                border: `1px solid ${theme.colors.border}`,
                '&:hover': {
                  backgroundColor: theme.colors.background.surface,
                  borderColor: theme.colors.text.secondary,
                },
                '&:active': {
                  backgroundColor: theme.colors.background.surface,
                  borderColor: theme.colors.text.primary,
                  opacity: 0.9,
                },
              };
            case 'text':
              return {
                backgroundColor: 'transparent',
                color: theme.colors.text.secondary,
                border: '1px solid transparent',
                '&:hover': {
                  backgroundColor: theme.colors.background.surface,
                  color: theme.colors.text.primary,
                },
                '&:active': {
                  backgroundColor: theme.colors.background.surface,
                  color: theme.colors.text.primary,
                  opacity: 0.8,
                },
              };
          }
          break;
        default:
          return {};
      }
    };

    const baseStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `${theme.spacing.unit}px`,
      borderRadius: theme.borderRadius.small,
      fontWeight: 500,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || loading ? 0.6 : 1,
      ...sizeConfig[size],
      ...getColorConfig(),
    };

    return baseStyle;
  }, [theme, color, variant, size, fullWidth, disabled, loading]);
};

/**
 * Button component with multiple variants and types.
 *
 * @example
 * ```tsx
 * // Primary solid button
 * <Button color="primary" variant="solid">
 *   Click me
 * </Button>
 *
 * // Secondary outline button
 * <Button color="secondary" variant="outline" size="large">
 *   Cancel
 * </Button>
 *
 * // Text button with loading state
 * <Button color="tertiary" variant="text" loading>
 *   Loading...
 * </Button>
 *
 * // Button with icons
 * <Button
 *   color="primary"
 *   startIcon={<Icon />}
 *   endIcon={<Arrow />}
 * >
 *   Save and Continue
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = 'primary',
      variant = 'solid',
      size = 'medium',
      fullWidth = false,
      loading = false,
      startIcon,
      endIcon,
      children,
      className,
      disabled,
      style,
      ...rest
    },
    ref,
  ) => {
    const buttonStyle = useButtonStyles(color, variant, size, fullWidth, disabled || false, loading);

    return (
      <button
        ref={ref}
        style={{...buttonStyle, ...style}}
        className={clsx(
          withVendorCSSClassPrefix('button'),
          withVendorCSSClassPrefix(`button-${color}`),
          withVendorCSSClassPrefix(`button-${variant}`),
          withVendorCSSClassPrefix(`button-${size}`),
          {
            [withVendorCSSClassPrefix('button-full-width')]: fullWidth,
            [withVendorCSSClassPrefix('button-loading')]: loading,
          },
          className,
        )}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <Spinner 
            size={size as SpinnerSize} 
            color="currentColor" 
            style={{
              width: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
              height: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px'
            }}
          />
        )}
        {!loading && startIcon && <span>{startIcon}</span>}
        {children && <span>{children}</span>}
        {!loading && endIcon && <span>{endIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
