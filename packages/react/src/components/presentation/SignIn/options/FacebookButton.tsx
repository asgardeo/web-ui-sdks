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

import {ApplicationNativeAuthenticationAuthenticator} from '@asgardeo/browser';
import {FC} from 'react';
import Button from '../../../primitives/Button/Button';
import {BaseSignInOptionProps} from './types';

/**
 * Facebook Sign-In Button Component.
 * Handles authentication with Facebook identity provider.
 */
const FacebookButton: FC<BaseSignInOptionProps> = ({
  authenticator,
  isLoading,
  onSubmit,
  buttonClassName = '',
  submitButtonText = 'Continue with Facebook',
}) => {
  /**
   * Handle button click.
   */
  const handleClick = () => {
    onSubmit(authenticator);
  };

  return (
    <Button
      type="button"
      variant="solid"
      color="primary"
      fullWidth
      disabled={isLoading}
      loading={isLoading}
      onClick={handleClick}
      className={buttonClassName}
    >
      {submitButtonText}
    </Button>
  );
};

export default FacebookButton;
