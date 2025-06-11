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

import {ApplicationNativeAuthenticationAuthenticatorParamType} from '@asgardeo/browser';
import {FC, ReactElement} from 'react';
import TextField from '../primitives/TextField/TextField';
import Select from '../primitives/Select/Select';
import {SelectOption} from '../primitives/Select/Select';

/**
 * Interface for field configuration.
 */
export interface FieldConfig {
  /**
   * The parameter name.
   */
  param: string;
  /**
   * The field type based on ApplicationNativeAuthenticationAuthenticatorParamType.
   */
  type: ApplicationNativeAuthenticationAuthenticatorParamType;
  /**
   * Display name for the field.
   */
  displayName: string;
  /**
   * Whether the field contains confidential information (password).
   */
  confidential: boolean;
  /**
   * Whether the field is required.
   */
  required: boolean;
  /**
   * Current value of the field.
   */
  value: string;
  /**
   * Callback function when the field value changes.
   */
  onChange: (value: string) => void;
  /**
   * Whether the field is disabled.
   */
  disabled?: boolean;
  /**
   * Error message to display.
   */
  error?: string;
  /**
   * Additional CSS class name.
   */
  className?: string;
  /**
   * Additional options for multi-valued fields.
   */
  options?: SelectOption[];
}

/**
 * Utility function to parse multi-valued string into array
 */
export const parseMultiValuedString = (value: string): string[] => {
  if (!value || value.trim() === '') return [];
  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

/**
 * Utility function to format array into multi-valued string
 */
export const formatMultiValuedString = (values: string[]): string => {
  return values.join(', ');
};

/**
 * Utility function to validate field values based on type
 */
export const validateFieldValue = (
  value: string,
  type: ApplicationNativeAuthenticationAuthenticatorParamType,
  required: boolean = false,
): string | null => {
  // Check if required field is empty
  if (required && (!value || value.trim() === '')) {
    return 'This field is required';
  }

  // If not required and empty, no validation needed
  if (!value || value.trim() === '') {
    return null;
  }

  switch (type) {
    case ApplicationNativeAuthenticationAuthenticatorParamType.Integer:
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        return 'Please enter a valid number';
      }
      break;

    case ApplicationNativeAuthenticationAuthenticatorParamType.MultiValued:
      // Validate that multi-valued fields don't have empty values after splitting
      const values = parseMultiValuedString(value);
      if (values.some(v => v.trim() === '')) {
        return 'Please remove empty values';
      }
      break;
  }

  return null;
};

/**
 * Factory function to create form fields based on the ApplicationNativeAuthenticationAuthenticatorParamType.
 *
 * @param config - The field configuration
 * @returns The appropriate React component for the field type
 *
 * @example
 * ```tsx
 * const field = createField({
 *   param: 'username',
 *   type: ApplicationNativeAuthenticationAuthenticatorParamType.String,
 *   displayName: 'Username',
 *   confidential: false,
 *   required: true,
 *   value: '',
 *   onChange: (value) => console.log(value)
 * });
 * ```
 */
export const createField = (config: FieldConfig): ReactElement => {
  const {
    param,
    type,
    displayName,
    confidential,
    required,
    value,
    onChange,
    disabled = false,
    error,
    className,
    options = [],
  } = config;

  // Auto-validate the field value
  const validationError = error || validateFieldValue(value, type, required);

  const commonProps = {
    id: param,
    label: displayName,
    required,
    disabled,
    error: validationError,
    className,
    value,
  };

  switch (type) {
    case ApplicationNativeAuthenticationAuthenticatorParamType.String:
      return (
        <TextField
          {...commonProps}
          type={confidential ? 'password' : 'text'}
          onChange={e => onChange(e.target.value)}
          autoComplete={confidential ? 'current-password' : 'off'}
        />
      );

    case ApplicationNativeAuthenticationAuthenticatorParamType.Integer:
      return (
        <TextField
          {...commonProps}
          type="number"
          onChange={e => onChange(e.target.value)}
          helperText="Enter a numeric value"
        />
      );

    case ApplicationNativeAuthenticationAuthenticatorParamType.MultiValued:
      // Try to get default options if none provided
      const fieldOptions = options.length > 0 ? options : [];

      if (fieldOptions.length > 0) {
        return (
          <Select
            {...commonProps}
            options={fieldOptions}
            onChange={e => onChange(e.target.value)}
            helperText="Select from available options"
          />
        );
      }

      // Fallback to text field with comma-separated values
      return (
        <TextField
          {...commonProps}
          type="text"
          onChange={e => onChange(e.target.value)}
          helperText="Enter multiple values separated by commas (e.g., value1, value2, value3)"
          placeholder="value1, value2, value3"
        />
      );

    default:
      // Fallback to text field for unknown types
      return (
        <TextField
          {...commonProps}
          type={confidential ? 'password' : 'text'}
          onChange={e => onChange(e.target.value)}
          helperText="Unknown field type, treating as text"
        />
      );
  }
};

/**
 * React component wrapper for the field factory.
 */
export const FieldFactory: FC<FieldConfig> = props => {
  return createField(props);
};

export default FieldFactory;
