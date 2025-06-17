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
   * Additional CSS class names for customization.
   */
  className?: string;

  /**
   * Size variant for the component.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Theme variant for the component.
   */
  variant?: 'default' | 'outlined' | 'filled';
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
const SignIn: FC<SignInProps> = ({className, size = 'medium', variant = 'default'}) => {
  const {signIn, baseUrl, afterSignInUrl} = useAsgardeo();

  /**
   * Initialize the authentication flow.
   */
  const handleInitialize = async (): Promise<ApplicationNativeAuthenticationInitiateResponse> => {
    return await signIn({response_mode: 'direct'});
  };

  /**
   * Handle authentication steps.
   */
  const handleOnSubmit = async (flow: {
    requestConfig?: {
      method: string;
      url: string;
    };
    payload: {
      flowId: string;
      selectedAuthenticator: {
        authenticatorId: string;
        params: Record<string, string>;
      };
    };
  }): Promise<ApplicationNativeAuthenticationHandleResponse> => {
    return await signIn({
      flow,
    });
  };

  /**
   * Handle successful authentication and redirect with query params.
   */
  const handleSuccess = (authData: Record<string, any>) => {
    if (authData && afterSignInUrl) {
      const url = new URL(afterSignInUrl, window.location.origin);

      Object.entries(authData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });

      window.location.href = url.toString();
    }
  };

  return (
    <BaseSignIn
      afterSignInUrl={afterSignInUrl}
      onInitialize={handleInitialize}
      onSubmit={handleOnSubmit}
      onSuccess={handleSuccess}
      className={className}
      size={size}
      variant={variant}
    />
  );
};

export default SignIn;
