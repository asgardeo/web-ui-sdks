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

import {FC, CSSProperties} from 'react';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import {cx} from '@emotion/css';
import useTheme from '../../../contexts/Theme/useTheme';

export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  /**
   * Size of the spinner
   */
  size?: SpinnerSize;
  /**
   * Custom color for the spinner
   */
  color?: string;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: CSSProperties;
}

/**
 * Spinner component for loading states
 *
 * @example
 * ```tsx
 * // Basic spinner
 * <Spinner />
 *
 * // Large spinner with custom color
 * <Spinner size="large" color="#3b82f6" />
 *
 * // Small spinner
 * <Spinner size="small" />
 * ```
 */
const Spinner: FC<SpinnerProps> = ({size = 'medium', color, className, style}) => {
  const {theme} = useTheme();

  const spinnerSize = {
    small: '16px',
    medium: '20px',
    large: '32px',
  }[size];

  const spinnerColor = color || theme.vars.colors.primary.main;

  const spinnerStyle: CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: '2px solid transparent',
    borderTop: `2px solid ${spinnerColor}`,
    borderRadius: '50%',
    animation: 'asgardeo-spinner-spin 1s linear infinite',
    ...style,
  };

  return (
    <>
      <style>
        {`
          @keyframes asgardeo-spinner-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <span
        className={cx(withVendorCSSClassPrefix('spinner'), className)}
        style={spinnerStyle}
        role="status"
        aria-label="Loading"
      />
    </>
  );
};

export default Spinner;
