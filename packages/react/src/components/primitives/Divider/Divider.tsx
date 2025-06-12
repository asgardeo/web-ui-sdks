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

import {FC, HTMLAttributes, useMemo} from 'react';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import {clsx} from 'clsx';
import {useTheme} from '../../../contexts/Theme/useTheme';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The orientation of the divider
   */
  orientation?: DividerOrientation;

  /**
   * The variant style of the divider
   */
  variant?: DividerVariant;

  /**
   * Text to display in the center of the divider
   */
  children?: React.ReactNode;

  /**
   * Custom color for the divider
   */
  color?: string;
}

const useStyles = (orientation: DividerOrientation, variant: DividerVariant, color?: string, hasChildren?: boolean) => {
  const {theme} = useTheme();

  return useMemo(() => {
    const baseColor = color || theme.colors.border;
    const borderStyle = variant === 'solid' ? 'solid' : variant === 'dashed' ? 'dashed' : 'dotted';

    if (orientation === 'vertical') {
      return {
        display: 'inline-block',
        height: '100%',
        minHeight: '1rem',
        width: '1px',
        borderLeft: `1px ${borderStyle} ${baseColor}`,
        margin: `0 ${theme.spacing.unit}px`,
      };
    }

    // Horizontal divider
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      margin: `${theme.spacing.unit * 2}px 0`,
      fontSize: '0.875rem',
      color: theme.colors.text.secondary,
    };

    if (hasChildren) {
      return {
        ...baseStyle,
        '&::before': {
          content: '""',
          flex: 1,
          height: '1px',
          borderTop: `1px ${borderStyle} ${baseColor}`,
          marginRight: `${theme.spacing.unit}px`,
        },
        '&::after': {
          content: '""',
          flex: 1,
          height: '1px',
          borderTop: `1px ${borderStyle} ${baseColor}`,
          marginLeft: `${theme.spacing.unit}px`,
        },
      };
    }

    return {
      ...baseStyle,
      height: '1px',
      borderTop: `1px ${borderStyle} ${baseColor}`,
    };
  }, [orientation, variant, color, hasChildren, theme]);
};

/**
 * Divider component for separating content sections.
 *
 * @example
 * ```tsx
 * // Basic horizontal divider
 * <Divider />
 *
 * // Divider with text
 * <Divider>OR</Divider>
 *
 * // Vertical divider
 * <Divider orientation="vertical" />
 *
 * // Custom styled divider
 * <Divider variant="dashed" color="#ccc">Continue with</Divider>
 * ```
 */
const Divider: FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  children,
  color,
  className,
  style,
  ...rest
}) => {
  const dividerStyle = useStyles(orientation, variant, color, !!children);

  if (orientation === 'vertical') {
    return (
      <div
        className={clsx(withVendorCSSClassPrefix('divider'), withVendorCSSClassPrefix('divider-vertical'), className)}
        style={{...dividerStyle, ...style}}
        role="separator"
        aria-orientation="vertical"
        {...rest}
      />
    );
  }

  if (children) {
    return (
      <div
        className={clsx(
          withVendorCSSClassPrefix('divider'),
          withVendorCSSClassPrefix('divider-horizontal'),
          withVendorCSSClassPrefix('divider-with-text'),
          className,
        )}
        style={{...dividerStyle, ...style}}
        role="separator"
        aria-orientation="horizontal"
        {...rest}
      >
        <span
          style={{
            backgroundColor: 'var(--background-color, #fff)',
            padding: '0 0.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx(withVendorCSSClassPrefix('divider'), withVendorCSSClassPrefix('divider-horizontal'), className)}
      style={{...dividerStyle, ...style}}
      role="separator"
      aria-orientation="horizontal"
      {...rest}
    />
  );
};

export default Divider;
