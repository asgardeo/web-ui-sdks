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

import {ButtonHTMLAttributes, forwardRef} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import {cx} from '@emotion/css';
import Spinner, {SpinnerSize} from '../Spinner/Spinner';
import useStyles from './Button.styles';

export type ButtonColor = 'primary' | 'secondary' | 'tertiary' | string;
export type ButtonVariant = 'solid' | 'outline' | 'text' | 'icon';
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
  /**
   * The shape of the button: square or round
   */
  shape?: 'square' | 'round';
}

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
      shape = 'square',
      ...rest
    },
    ref,
  ) => {
    const {theme, colorScheme} = useTheme();
    const styles = useStyles(theme, colorScheme, color, variant, size, fullWidth, disabled || false, loading, shape);

    const isIconVariant = variant === 'icon';

    return (
      <button
        ref={ref}
        style={style}
        className={cx(
          withVendorCSSClassPrefix(bem('button')),
          withVendorCSSClassPrefix(bem('button', variant)),
          withVendorCSSClassPrefix(bem('button', color)),
          withVendorCSSClassPrefix(bem('button', size)),
          withVendorCSSClassPrefix(bem('button', shape)),
          fullWidth ? withVendorCSSClassPrefix(bem('button', 'fullWidth')) : undefined,
          loading ? withVendorCSSClassPrefix(bem('button', 'loading')) : undefined,
          disabled || loading ? withVendorCSSClassPrefix(bem('button', 'disabled')) : undefined,
          styles.button,
          styles.size,
          styles.variant,
          styles.fullWidth,
          styles.loading,
          styles.shape,
          className,
        )}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <span className={cx(withVendorCSSClassPrefix(bem('button', 'spinner')), styles.spinner)}>
            <Spinner
              size={size as SpinnerSize}
              color="currentColor"
              style={{
                width:
                  size === 'small'
                    ? `calc(${theme.vars.spacing.unit} * 1.5)`
                    : size === 'medium'
                    ? `calc(${theme.vars.spacing.unit} * 2)`
                    : `calc(${theme.vars.spacing.unit} * 2.5)`,
                height:
                  size === 'small'
                    ? `calc(${theme.vars.spacing.unit} * 1.5)`
                    : size === 'medium'
                    ? `calc(${theme.vars.spacing.unit} * 2)`
                    : `calc(${theme.vars.spacing.unit} * 2.5)`,
              }}
            />
          </span>
        )}
        {!loading && isIconVariant && (
          <span className={cx(withVendorCSSClassPrefix(bem('button', 'icon')), styles.icon)}>
            {children || startIcon || endIcon}
          </span>
        )}
        {!loading && !isIconVariant && startIcon && (
          <span className={cx(withVendorCSSClassPrefix(bem('button', 'start-icon')), styles.startIcon)}>
            {startIcon}
          </span>
        )}
        {!isIconVariant && children && (
          <span className={cx(withVendorCSSClassPrefix(bem('button', 'content')), styles.content)}>{children}</span>
        )}
        {!loading && !isIconVariant && endIcon && (
          <span className={cx(withVendorCSSClassPrefix(bem('button', 'end-icon')), styles.endIcon)}>{endIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
