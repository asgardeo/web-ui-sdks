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
  EmbeddedFlowExecuteRequestPayload,
  EmbeddedFlowExecuteResponse,
  EmbeddedFlowResponseType,
  EmbeddedFlowType,
} from '@asgardeo/browser';
import {FC} from 'react';
import BaseSignUp from './BaseSignUp';
import useAsgardeo from '../../../contexts/Asgardeo/useAsgardeo';

/**
 * Props for the SignUp component.
 */
export interface SignUpProps {
  /**
   * URL to redirect after successful sign-up.
   */
  afterSignUpUrl?: string;

  /**
   * Additional CSS class names for customization.
   */
  className?: string;

  /**
   * Callback function called when the sign-up flow completes and requires redirection.
   * This allows platform-specific handling of redirects (e.g., Next.js router.push).
   * @param response - The response from the sign-up flow containing the redirect URL, etc.
   */
  onComplete?: (response: EmbeddedFlowExecuteResponse) => void;

  /**
   * Callback function called when sign-up fails.
   * @param error - The error that occurred during sign-up.
   */
  onError?: (error: Error) => void;

  /**
   *  Whether to redirect after sign-up.
   */
  shouldRedirectAfterSignUp?: boolean;

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
 * A styled SignUp component that provides embedded sign-up flow with pre-built styling.
 * This component handles the API calls for sign-up and delegates UI logic to BaseSignUp.
 *
 * @example
 * ```tsx
 * import { SignUp } from '@asgardeo/react';
 *
 * const App = () => {
 *   return (
 *     <SignUp
 *       onSuccess={(response) => {
 *         console.log('Sign-up successful:', response);
 *         // Handle successful sign-up (e.g., redirect, show confirmation)
 *       }}
 *       onError={(error) => {
 *         console.error('Sign-up failed:', error);
 *       }}
 *       onComplete={(redirectUrl) => {
 *         // Platform-specific redirect handling (e.g., Next.js router.push)
 *         router.push(redirectUrl); // or window.location.href = redirectUrl
 *       }}
 *       size="medium"
 *       variant="outlined"
 *       afterSignUpUrl="/welcome"
 *     />
 *   );
 * };
 * ```
 */
const SignUp: FC<SignUpProps> = ({
  className,
  size = 'medium',
  variant = 'default',
  afterSignUpUrl,
  onError,
  onComplete,
  shouldRedirectAfterSignUp = true,
}) => {
  const {signUp, isInitialized} = useAsgardeo();

  /**
   * Initialize the sign-up flow.
   */
  const handleInitialize = async (payload?: EmbeddedFlowExecuteRequestPayload): Promise<EmbeddedFlowExecuteResponse> =>
    await signUp(
      payload || {
        flowType: EmbeddedFlowType.Registration,
      },
    );

  /**
   * Handle sign-up steps.
   */
  const handleOnSubmit = async (payload: EmbeddedFlowExecuteRequestPayload): Promise<EmbeddedFlowExecuteResponse> =>
    await signUp(payload);

  /**
   * Handle successful sign-up and redirect.
   */
  const handleComplete = (response: EmbeddedFlowExecuteResponse) => {
    onComplete?.(response);

    if (
      shouldRedirectAfterSignUp &&
      response?.type === EmbeddedFlowResponseType.Redirection &&
      response?.data?.redirectURL
    ) {
      window.location.href = response.data.redirectURL;
    }
  };

  return (
    <BaseSignUp
      afterSignUpUrl={afterSignUpUrl}
      onInitialize={handleInitialize}
      onSubmit={handleOnSubmit}
      onError={onError}
      onComplete={handleComplete}
      className={className}
      size={size}
      variant={variant}
      isInitialized={isInitialized}
    />
  );
};

export default SignUp;
