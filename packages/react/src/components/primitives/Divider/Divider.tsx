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

import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import {clsx} from 'clsx';
import {FC, HTMLAttributes, useMemo} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import Typography from '../Typography/Typography';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Text to display in the center of the divider
   */
  children?: React.ReactNode;

  /**
   * Custom color for the divider
   */
  color?: string;

  /**
   * The orientation of the divider
   */
  orientation?: DividerOrientation;

  /**
   * The variant style of the divider
   */
  variant?: DividerVariant;
}

const useStyles = (orientation: DividerOrientation, variant: DividerVariant, color?: string, hasChildren?: boolean) => {
  const {theme} = useTheme();

  return useMemo(() => {
    const baseColor = color || theme.colors.border;
    const borderStyle = variant === 'solid' ? 'solid' : variant === 'dashed' ? 'dashed' : 'dotted';

    const styles = `
      .${withVendorCSSClassPrefix('divider')} {
        margin: calc(${theme.vars.spacing.unit} * 2) 0;
      }

      .${withVendorCSSClassPrefix('divider--vertical')} {
        display: inline-block;
        height: 100%;
        min-height: calc(${theme.vars.spacing.unit} * 2);
        width: 1px;
        border-left: 1px ${borderStyle} ${baseColor};
        margin: 0 calc(${theme.vars.spacing.unit} * 1);
      }

      .${withVendorCSSClassPrefix('divider--horizontal')} {
        display: flex;
        align-items: center;
        width: 100%;
      }

      .${withVendorCSSClassPrefix('divider--horizontal')}:not(.${withVendorCSSClassPrefix('divider--with-text')}) {
        height: 1px;
        border-top: 1px ${borderStyle} ${baseColor};
      }

      .${withVendorCSSClassPrefix('divider__line')} {
        flex: 1;
        height: 1px;
        border-top: 1px ${borderStyle} ${baseColor};
      }

      .${withVendorCSSClassPrefix('divider__text')} {
        background-color: ${theme.vars.colors.background.surface};
        padding: 0 calc(${theme.vars.spacing.unit} * 1);
        white-space: nowrap;
      }
    `;

    return styles;
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
  const styles = useStyles(orientation, variant, color, !!children);

  if (orientation === 'vertical') {
    return (
      <>
        <style>{styles}</style>
        <div
          className={clsx(withVendorCSSClassPrefix('divider'), withVendorCSSClassPrefix('divider--vertical'), className)}
          style={style}
          role="separator"
          aria-orientation="vertical"
          {...rest}
        />
      </>
    );
  }

  if (children) {
    return (
      <>
        <style>{styles}</style>
        <div
          className={clsx(
            withVendorCSSClassPrefix('divider'),
            withVendorCSSClassPrefix('divider--horizontal'),
            withVendorCSSClassPrefix('divider--with-text'),
            className,
          )}
          style={style}
          role="separator"
          aria-orientation="horizontal"
          {...rest}
        >
          <div className={withVendorCSSClassPrefix('divider__line')} />
          <Typography variant="body2" color="textSecondary" className={withVendorCSSClassPrefix('divider__text')} inline>
            {children}
          </Typography>
          <div className={withVendorCSSClassPrefix('divider__line')} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div
        className={clsx(withVendorCSSClassPrefix('divider'), withVendorCSSClassPrefix('divider--horizontal'), className)}
        style={style}
        role="separator"
        aria-orientation="horizontal"
        {...rest}
      />
    </>
  );
};

export default Divider;
