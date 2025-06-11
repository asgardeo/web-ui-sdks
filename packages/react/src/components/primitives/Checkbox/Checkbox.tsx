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

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  /**
   * Label text to display next to the checkbox
   */
  label?: string;
  /**
   * Error message to display below the checkbox
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
   * Helper text to display below the checkbox
   */
  helperText?: string;
}

const Checkbox: FC<CheckboxProps> = ({label, error, className, required, helperText, style = {}, ...rest}) => {
  const {theme} = useTheme();

  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    ...style,
  };

  const inputStyle: CSSProperties = {
    width: theme.spacing.unit * 2.5 + 'px',
    height: theme.spacing.unit * 2.5 + 'px',
    marginRight: theme.spacing.unit + 'px',
    accentColor: theme.colors.primary.main,
  };

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={clsx('asgardeo-checkbox', className)}
      helperTextMarginLeft={theme.spacing.unit * 3.5 + 'px'}
    >
      <div style={containerStyle}>
        <input type="checkbox" style={inputStyle} aria-invalid={!!error} aria-required={required} {...rest} />
        {label && (
          <InputLabel
            required={required}
            error={!!error}
            variant="inline"
            style={{
              color: error ? theme.colors.error.main : theme.colors.text.primary,
              fontSize: '0.875rem',
            }}
          >
            {label}
          </InputLabel>
        )}
      </div>
    </FormControl>
  );
};

export default Checkbox;
