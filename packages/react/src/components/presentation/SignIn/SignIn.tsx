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

import {
  handleApplicationNativeAuthentication,
  ApplicationNativeAuthenticationInitiateResponse,
  ApplicationNativeAuthenticationHandleResponse,
} from '@asgardeo/browser';
import {FC} from 'react';
import BaseSignIn from './BaseSignIn';
import useAsgardeo from '../../../contexts/Asgardeo/useAsgardeo';

/**
 * Props for the SignIn component.
 */
export interface SignInProps {
  /**
   * Callback function called when authentication is successful.
   * @param authData - The authentication data returned upon successful completion.
   */
  onSuccess?: (authData: Record<string, any>) => void;

  /**
   * Callback function called when authentication fails.
   * @param error - The error that occurred during authentication.
   */
  onError?: (error: Error) => void;

  /**
   * Callback function called when authentication flow status changes.
   * @param response - The current authentication response.
   */
  onFlowChange?: (
    response: ApplicationNativeAuthenticationInitiateResponse | ApplicationNativeAuthenticationHandleResponse,
  ) => void;

  /**
   * Additional CSS class names for customization.
   */
  className?: string;

  /**
   * Apply default styling.
   */
  styled?: boolean;

  /**
   * Size variant for the component.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Theme variant for the component.
   */
  variant?: 'default' | 'outlined' | 'filled';

  /**
   * Whether to show loading state.
   */
  showLoading?: boolean;

  /**
   * Custom loading text.
   */
  loadingText?: string;
}

/**
 * A styled SignIn component that provides native authentication flow with pre-built styling.
 * This component handles the API calls for authentication and delegates UI logic to BaseSignIn.
 *
 * @example
 * ```tsx
 * import { SignIn } from '@asgardeo/react';
 *
 * const App = () => {
 *   return (
 *     <SignIn
 *       onSuccess={(authData) => {
 *         console.log('Authentication successful:', authData);
 *         // Handle successful authentication (e.g., redirect, store tokens)
 *       }}
 *       onError={(error) => {
 *         console.error('Authentication failed:', error);
 *       }}
 *       size="medium"
 *       variant="outlined"
 *     />
 *   );
 * };
 * ```
 */
const SignIn: FC<SignInProps> = ({
  onSuccess,
  onError,
  onFlowChange,
  className,
  styled = true,
  size = 'medium',
  variant = 'default',
  showLoading = true,
  loadingText = 'Loading...',
}) => {
  const {signIn, baseUrl} = useAsgardeo();

  /**
   * Initialize the authentication flow.
   */
  const handleInitialize = async (): Promise<ApplicationNativeAuthenticationInitiateResponse> => {
    return await signIn({response_mode: 'direct'});
  };

  /**
   * Handle authentication steps.
   */
  const handleAuthenticate = async (payload: {
    flowId: string;
    selectedAuthenticator: {
      authenticatorId: string;
      params: Record<string, string>;
    };
  }): Promise<ApplicationNativeAuthenticationHandleResponse> => {
    return await handleApplicationNativeAuthentication({
      baseUrl,
      payload,
    });
  };

  return (
    <BaseSignIn
      onInitialize={handleInitialize}
      onAuthenticate={handleAuthenticate}
      onSuccess={onSuccess}
      onError={onError}
      onFlowChange={onFlowChange}
      className={className}
      styled={styled}
      size={size}
      variant={variant}
      showLoading={showLoading}
      loadingText={loadingText}
    />
  );
};

export default SignIn;
