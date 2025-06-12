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
 * Social Login Sign-In Option Component.
 * Handles authentication with external identity providers (Google, GitHub, etc.).
 */
const SocialLogin: FC<BaseSignInOptionProps> = ({authenticator, isLoading, onSubmit, buttonClassName = ''}) => {
  /**
   * Get display name for the social provider.
   */
  const getDisplayName = (): string => {
    const providerName = authenticator.idp;
    return `Continue with ${providerName}`;
  };

  /**
   * Get styling configuration for the social provider.
   */
  const getProviderStyle = (): {variant: 'solid' | 'outline'; color: string} => {
    const provider = authenticator.idp.toLowerCase();

    switch (provider) {
      case 'google':
        return {variant: 'outline', color: 'secondary'};
      case 'github':
        return {variant: 'solid', color: 'secondary'};
      case 'facebook':
        return {variant: 'solid', color: 'primary'};
      case 'microsoft':
        return {variant: 'outline', color: 'primary'};
      case 'apple':
        return {variant: 'solid', color: 'secondary'};
      default:
        return {variant: 'outline', color: 'secondary'};
    }
  };

  /**
   * Handle button click.
   */
  const handleClick = () => {
    onSubmit(authenticator);
  };

  const style = getProviderStyle();

  return (
    <Button
      type="button"
      variant={style.variant}
      color={style.color}
      fullWidth
      disabled={isLoading}
      loading={isLoading}
      onClick={handleClick}
      className={buttonClassName}
    >
      {getDisplayName()}
    </Button>
  );
};

export default SocialLogin;
