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

import {FC} from 'react';

import {BaseSignUpOptionProps} from './SignUpOptionFactory';
import Button from '../../../primitives/Button/Button';
import Spinner from '../../../primitives/Spinner/Spinner';

/**
 * Submit button component for sign-up forms.
 */
const SubmitButton: FC<BaseSignUpOptionProps> = ({
  component,
  isLoading,
  isFormValid,
  buttonClassName,
  size = 'medium',
}) => {
  const config = component.config || {};
  const buttonText = config['text'] || config['label'] || 'Continue';
  const buttonType = config['type'] || 'submit';
  const buttonVariant = config['variant']?.toLowerCase() === 'primary' ? 'solid' : 'outline';

  return (
    <Button
      key={component.id}
      type={buttonType === 'submit' ? 'submit' : 'button'}
      variant={buttonVariant}
      size={size}
      disabled={isLoading || !isFormValid}
      className={buttonClassName}
      style={{width: '100%'}}
    >
      {isLoading ? <Spinner size="small" /> : buttonText}
    </Button>
  );
};

export default SubmitButton;
