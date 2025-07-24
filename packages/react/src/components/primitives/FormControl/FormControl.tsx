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

import {CSSProperties, FC, ReactNode} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '@emotion/css';
import {bem, withVendorCSSClassPrefix} from '@asgardeo/browser';
import Typography from '../Typography/Typography';
import useStyles from './FormControl.styles';

export type FormControlHelperTextAlign = 'left' | 'center';

export interface FormControlProps {
  /**
   * The content to be wrapped by the form control
   */
  children: ReactNode;
  /**
   * Error message to display below the content
   */
  error?: string;
  /**
   * Helper text to display below the content
   */
  helperText?: string;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Custom alignment for helper text (default: left, center for OTP)
   */
  helperTextAlign?: FormControlHelperTextAlign;
  /**
   * Custom margin left for helper text (for components like Checkbox)
   */
  helperTextMarginLeft?: string;
  /**
   * Custom container style
   */
  style?: CSSProperties;
}

const FormControl: FC<FormControlProps> = ({
  children,
  error,
  helperText,
  className,
  helperTextAlign = 'left',
  helperTextMarginLeft,
}) => {
  const {theme, colorScheme} = useTheme();
  const styles = useStyles(theme, colorScheme, helperTextAlign, helperTextMarginLeft, !!error);

  return (
    <div className={cx(withVendorCSSClassPrefix(bem('form-control')), styles.formControl, className)}>
      {children}
      {(error || helperText) && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'textSecondary'}
          className={cx(withVendorCSSClassPrefix(bem('form-control', 'helper-text')), styles.helperText, {
            [withVendorCSSClassPrefix(bem('form-control', 'helper-text', 'error'))]: !!error,
            [styles.helperTextError]: !!error,
          })}
        >
          {error || helperText}
        </Typography>
      )}
    </div>
  );
};

export default FormControl;
