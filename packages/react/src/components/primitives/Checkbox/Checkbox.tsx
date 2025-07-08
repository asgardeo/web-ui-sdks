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
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '@emotion/css';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';

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
    width: `calc(${theme.vars.spacing.unit} * 2.5)`,
    height: `calc(${theme.vars.spacing.unit} * 2.5)`,
    marginRight: theme.vars.spacing.unit,
    accentColor: theme.vars.colors.primary.main,
  };

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={cx(withVendorCSSClassPrefix('checkbox'), className)}
      helperTextMarginLeft={`calc(${theme.vars.spacing.unit} * 3.5)`}
    >
      <div style={containerStyle}>
        <input type="checkbox" style={inputStyle} aria-invalid={!!error} aria-required={required} {...rest} />
        {label && (
          <InputLabel
            required={required}
            error={!!error}
            variant="inline"
            style={{
              color: error ? theme.vars.colors.error.main : theme.vars.colors.text.primary,
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
