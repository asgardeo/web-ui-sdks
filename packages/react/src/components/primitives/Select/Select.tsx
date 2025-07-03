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

import {CSSProperties, FC, SelectHTMLAttributes} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import clsx from 'clsx';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';

export interface SelectOption {
  /**
   * The value that will be submitted with the form
   */
  value: string;
  /**
   * The text that will be displayed in the select
   */
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  /**
   * Label text to display above the select
   */
  label?: string;
  /**
   * Error message to display below the select
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
   * Helper text to display below the select
   */
  helperText?: string;
  /**
   * The options to display in the select
   */
  options: SelectOption[];
}

const Select: FC<SelectProps> = ({
  label,
  error,
  className,
  required,
  disabled,
  helperText,
  options,
  style = {},
  ...rest
}) => {
  const {theme} = useTheme();

  const selectStyle: CSSProperties = {
    width: '100%',
    padding: `${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 1.5)`,
    border: `1px solid ${error ? theme.vars.colors.error.main : theme.vars.colors.border}`,
    borderRadius: theme.vars.borderRadius.medium,
    fontSize: theme.vars.typography.fontSizes.md,
    color: theme.vars.colors.text.primary,
    backgroundColor: disabled ? theme.vars.colors.background.disabled : theme.vars.colors.background.surface,
    outline: 'none',
    transition: 'border-color 0.2s ease',
    appearance: 'none',
    backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${theme.colors.text.secondary.replace(
      '#',
      '',
    )}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right .7em top 50%',
    backgroundSize: '.65em auto',
  };

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={clsx(withVendorCSSClassPrefix('select'), className)}
      style={style}
    >
      {label && (
        <InputLabel required={required} error={!!error}>
          {label}
        </InputLabel>
      )}
      <select style={selectStyle} disabled={disabled} aria-invalid={!!error} aria-required={required} {...rest}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormControl>
  );
};

export default Select;
