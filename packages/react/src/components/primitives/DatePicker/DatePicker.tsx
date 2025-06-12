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
import {useTheme} from '../../../contexts/Theme/useTheme';
import clsx from 'clsx';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import {withVendorCSSClassPrefix} from 'packages/browser/dist';

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

const DatePicker: FC<DatePickerProps> = ({
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

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={clsx(withVendorCSSClassPrefix('date-picker'), className)}
      style={style}
    >
      {label && (
        <InputLabel required={required} error={!!error}>
          {label}
        </InputLabel>
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
    </FormControl>
  );
};

export default DatePicker;
