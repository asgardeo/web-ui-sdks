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

import {CSSProperties, FC, InputHTMLAttributes, ReactNode} from 'react';
import {useTheme} from '../../../contexts/Theme/useTheme';
import clsx from 'clsx';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import { withVendorCSSClassPrefix } from 'packages/browser/dist';

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
  const {theme} = useTheme();

  // Calculate padding based on icons
  const hasStartIcon = !!startIcon;
  const hasEndIcon = !!endIcon;
  const leftPadding = hasStartIcon ? theme.spacing.unit * 5 : theme.spacing.unit * 1.5;
  const rightPadding = hasEndIcon ? theme.spacing.unit * 5 : theme.spacing.unit * 1.5;

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.unit}px ${rightPadding}px ${theme.spacing.unit}px ${leftPadding}px`,
    border: `1px solid ${error ? theme.colors.error.main : theme.colors.border}`,
    borderRadius: theme.borderRadius.small,
    fontSize: '1rem',
    color: theme.colors.text.primary,
    backgroundColor: disabled ? theme.colors.background.disabled : theme.colors.background.surface,
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const inputContainerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconButtonStyle: CSSProperties = {
    position: 'absolute',
    background: 'none',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    padding: theme.spacing.unit / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.text.secondary,
    opacity: disabled ? 0.5 : 1,
    top: '50%',
    transform: 'translateY(-50%)',
  };

  const startIconStyle: CSSProperties = {
    ...iconButtonStyle,
    left: theme.spacing.unit,
  };

  const endIconStyle: CSSProperties = {
    ...iconButtonStyle,
    right: theme.spacing.unit,
  };

  return (
    <FormControl error={error} helperText={helperText} className={clsx(withVendorCSSClassPrefix('text-field'), className)} style={style}>
      {label && (
        <InputLabel required={required} error={!!error}>
          {label}
        </InputLabel>
      )}
      <div style={inputContainerStyle}>
        {startIcon && (
          <div
            style={startIconStyle}
            onClick={onStartIconClick}
            role={onStartIconClick ? 'button' : undefined}
            tabIndex={onStartIconClick && !disabled ? 0 : undefined}
            aria-label="Start icon"
          >
            {startIcon}
          </div>
        )}
        <input
          style={inputStyle}
          type={type}
          disabled={disabled}
          aria-invalid={!!error}
          aria-required={required}
          {...rest}
        />
        {endIcon && (
          <div
            style={endIconStyle}
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
