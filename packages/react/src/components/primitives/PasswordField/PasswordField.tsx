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

import {FC, useState} from 'react';
import TextField, {TextFieldProps} from '../TextField/TextField';
import Eye from '../Icons/Eye';
import EyeOff from '../Icons/EyeOff';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'endIcon' | 'onEndIconClick' | 'onChange'> {
  /**
   * Callback function when the field value changes
   */
  onChange: (value: string) => void;
}

/**
 * Password field component with show/hide toggle functionality.
 * This component extends TextField and adds password visibility toggle functionality.
 */
const PasswordField: FC<PasswordFieldProps> = ({
  onChange,
  ...textFieldProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...textFieldProps}
      type={showPassword ? 'text' : 'password'}
      onChange={e => onChange(e.target.value)}
      autoComplete="current-password"
      endIcon={showPassword ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
      onEndIconClick={() => setShowPassword(!showPassword)}
    />
  );
};

export default PasswordField;
