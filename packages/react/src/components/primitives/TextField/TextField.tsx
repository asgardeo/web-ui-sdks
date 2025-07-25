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

import {FC, InputHTMLAttributes, ReactNode} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '@emotion/css';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import useStyles from './TextField.styles';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
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
   * Icon to display at the start (left) of the input
   */
  startIcon?: ReactNode;
  /**
   * Icon to display at the end (right) of the input
   */
  endIcon?: ReactNode;
  /**
   * Click handler for the start icon
   */
  onStartIconClick?: () => void;
  /**
   * Click handler for the end icon
   */
  onEndIconClick?: () => void;
}

const TextField: FC<TextFieldProps> = ({
  label,
  error,
  required,
  className,
  disabled,
  helperText,
  startIcon,
  endIcon,
  onStartIconClick,
  onEndIconClick,
  type = 'text',
  style = {},
  ...rest
}) => {
  const {theme, colorScheme} = useTheme();
  const hasError = !!error;
  const hasStartIcon = !!startIcon;
  const hasEndIcon = !!endIcon;
  const styles = useStyles(theme, colorScheme, disabled, hasError, hasStartIcon, hasEndIcon);

  const inputClassName = cx(
    withVendorCSSClassPrefix(bem('text-field', 'input')),
    styles.input,
    hasError && styles.inputError,
    disabled && styles.inputDisabled,
  );

  const containerClassName = cx(withVendorCSSClassPrefix(bem('text-field', 'container')), styles.inputContainer);

  const startIconClassName = cx(withVendorCSSClassPrefix(bem('text-field', 'start-icon')), styles.startIcon);

  const endIconClassName = cx(withVendorCSSClassPrefix(bem('text-field', 'end-icon')), styles.endIcon);

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={cx(withVendorCSSClassPrefix(bem('text-field')), className)}
      style={style}
    >
      {label && (
        <InputLabel required={required} error={hasError}>
          {label}
        </InputLabel>
      )}
      <div className={containerClassName}>
        {startIcon && (
          <div
            className={startIconClassName}
            onClick={onStartIconClick}
            role={onStartIconClick ? 'button' : undefined}
            tabIndex={onStartIconClick && !disabled ? 0 : undefined}
            aria-label="Start icon"
          >
            {startIcon}
          </div>
        )}
        <input
          className={inputClassName}
          type={type}
          disabled={disabled}
          aria-invalid={hasError}
          aria-required={required}
          {...rest}
        />
        {endIcon && (
          <div
            className={endIconClassName}
            onClick={onEndIconClick}
            role={onEndIconClick ? 'button' : undefined}
            tabIndex={onEndIconClick && !disabled ? 0 : undefined}
            aria-label="End icon"
          >
            {endIcon}
          </div>
        )}
      </div>
    </FormControl>
  );
};

export default TextField;
