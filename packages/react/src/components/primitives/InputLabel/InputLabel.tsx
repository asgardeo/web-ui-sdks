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

import {CSSProperties, FC, LabelHTMLAttributes, ReactNode} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';

export interface InputLabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'style'> {
  /**
   * Label text or content
   */
  children: ReactNode;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether there's an error state
   */
  error?: boolean;
  /**
   * Custom style overrides
   */
  style?: CSSProperties;
  /**
   * Display type for label positioning
   */
  variant?: 'block' | 'inline';
  /**
   * Custom margin bottom (useful for different form layouts)
   */
  marginBottom?: string;
}

const InputLabel: FC<InputLabelProps> = ({
  children,
  required,
  error,
  style = {},
  variant = 'block',
  marginBottom,
  ...rest
}) => {
  const {theme} = useTheme();

  const labelStyle: CSSProperties = {
    display: variant,
    marginBottom: marginBottom || (variant === 'block' ? theme.spacing.unit + 'px' : '0'),
    color: error ? theme.colors.error.main : theme.colors.text.secondary,
    fontSize: '0.875rem',
    fontWeight: variant === 'block' ? 500 : 'normal',
    ...style,
  };

  return (
    <label style={labelStyle} {...rest}>
      {children}
      {required && <span style={{color: theme.colors.error.main}}> *</span>}
    </label>
  );
};

export default InputLabel;
