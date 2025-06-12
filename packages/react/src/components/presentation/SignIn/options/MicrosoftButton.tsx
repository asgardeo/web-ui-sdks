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
 * Microsoft Sign-In Button Component.
 * Handles authentication with Microsoft identity provider.
 */
const MicrosoftButton: FC<BaseSignInOptionProps> = ({
  authenticator,
  isLoading,
  onSubmit,
  buttonClassName = '',
  submitButtonText = 'Continue with Microsoft',
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
      color="primary"
      fullWidth
      disabled={isLoading}
      loading={isLoading}
      onClick={handleClick}
      className={buttonClassName}
      startIcon={
        <svg width="14" height="14" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f3f3f3" d="M0 0h23v23H0z" />
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
      }
    >
      {submitButtonText}
    </Button>
  );
};

export default MicrosoftButton;
