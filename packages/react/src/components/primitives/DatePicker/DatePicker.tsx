/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {CSSProperties, FC, InputHTMLAttributes} from 'react';
import {useTheme} from '../../../theme/useTheme';
import clsx from 'clsx';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  /**
   * Label text to display above the input
   */
  label?: string;
  /**
   * Error message to display below the input
   */
  error?: string;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  /**
   * Custom date format for the regex pattern
   */
  dateFormat?: string;
}

export const DatePicker: FC<DatePickerProps> = ({
  label,
  error,
  className,
  required,
  disabled,
  helperText,
  dateFormat = 'yyyy-MM-dd',
  style = {},
  ...rest
}) => {
  const {theme} = useTheme();

  const containerStyle: CSSProperties = {
    marginBottom: theme.spacing.unit * 2 + 'px',
    ...style
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: theme.spacing.unit + 'px',
    color: error ? theme.colors.error.main : theme.colors.text.secondary,
    fontSize: '0.875rem',
    fontWeight: 500,
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    border: `1px solid ${error ? theme.colors.error.main : theme.colors.border}`,
    borderRadius: theme.borderRadius.small,
    fontSize: '1rem',
    color: theme.colors.text.primary,
    backgroundColor: disabled ? theme.colors.background.disabled : theme.colors.background.surface,
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const helperTextStyle: CSSProperties = {
    fontSize: '0.75rem',
    color: error ? theme.colors.error.main : theme.colors.text.secondary,
    marginTop: theme.spacing.unit / 2 + 'px',
  };

  return (
    <div style={containerStyle} className={clsx('asgardeo-date-picker', className)}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{color: theme.colors.error.main}}> *</span>}
        </label>
      )}
      <input
        type="date"
        pattern="\d{4}-\d{2}-\d{2}"
        placeholder={dateFormat}
        style={inputStyle}
        disabled={disabled}
        aria-invalid={!!error}
        aria-required={required}
        {...rest}
      />
      {(error || helperText) && <div style={helperTextStyle}>{error || helperText}</div>}
    </div>
  );
};

export default DatePicker;
