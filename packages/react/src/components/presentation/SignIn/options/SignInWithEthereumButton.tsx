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
import Button from '../../../primitives/Button/Button';
import {BaseSignInOptionProps} from './SignInOptionFactory';

/**
 * Sign In With Ethereum Button Component.
 * Handles authentication with Sign In With Ethereum identity provider.
 */
const SignInWithEthereumButton: FC<BaseSignInOptionProps> = ({
  authenticator,
  isLoading,
  onSubmit,
  buttonClassName = '',
  submitButtonText = 'Sign In With Ethereum',
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
      variant="outline"
      color="secondary"
      fullWidth
      disabled={isLoading}
      loading={isLoading}
      onClick={handleClick}
      className={buttonClassName}
      startIcon={
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#627EEA" d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
        </svg>
      }
    >
      {submitButtonText}
    </Button>
  );
};

export default SignInWithEthereumButton;
