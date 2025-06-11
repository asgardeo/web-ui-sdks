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
  initializeApplicationNativeAuthentication,
  handleApplicationNativeAuthentication,
  ApplicationNativeAuthenticationInitiateResponse,
  ApplicationNativeAuthenticationHandleResponse,
  ApplicationNativeAuthenticationFlowStatus,
  ApplicationNativeAuthenticationAuthenticator,
  AsgardeoAPIError,
  withVendorCSSClassPrefix,
} from '@asgardeo/browser';
import {FC, useState, useEffect, ReactElement} from 'react';
import {clsx} from 'clsx';
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
   * Text for the submit button.
   */
  submitButtonText?: string;

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
 * This component handles the API calls and state management for authentication.
 *
 * @example
 * ```tsx
 * import { SignIn } from '@asgardeo/react';
 *
 * const App = () => {
 *   return (
 *     <SignIn
 *       baseUrl="https://api.asgardeo.io/t/your-org"
 *       initialPayload={{
 *         client_id: 'your-client-id',
 *         response_type: 'code',
 *         scope: 'openid',
 *         redirect_uri: 'http://localhost:3000'
 *       }}
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
  submitButtonText = 'Sign In',
  showLoading = true,
  loadingText = 'Loading...',
}) => {
  const {signIn, baseUrl} = useAsgardeo();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<ApplicationNativeAuthenticationInitiateResponse | null>(null);
  const [currentAuthenticator, setCurrentAuthenticator] = useState<ApplicationNativeAuthenticationAuthenticator | null>(
    null,
  );
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{type: string; message: string}>>([]);

  /**
   * Initialize the authentication flow.
   */
  const initializeFlow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signIn({response_mode: 'direct'});

      setCurrentFlow(response);
      setIsInitialized(true);
      onFlowChange?.(response);

      if (response.flowStatus === ApplicationNativeAuthenticationFlowStatus.SuccessCompleted) {
        // Flow completed immediately
        onSuccess?.((response as any).authData || {});
        return;
      }

      if (response.nextStep?.authenticators?.length > 0) {
        // For now, select the first authenticator
        const authenticator = response.nextStep.authenticators[0];
        setCurrentAuthenticator(authenticator);
        setupFormFields(authenticator);
      }

      // Handle any messages from the response
      if ('nextStep' in response && response.nextStep && 'messages' in response.nextStep) {
        const stepMessages = (response.nextStep as any).messages || [];
        setMessages(
          stepMessages.map((msg: any) => ({
            type: msg.type || 'INFO',
            message: msg.message || '',
          })),
        );
      }
    } catch (err) {
      const errorMessage = err instanceof AsgardeoAPIError ? err.message : 'Failed to initialize authentication';
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Setup form fields based on the current authenticator.
   */
  const setupFormFields = (authenticator: ApplicationNativeAuthenticationAuthenticator) => {
    // Initialize form values for the authenticator's parameters
    const initialValues: Record<string, string> = {};
    authenticator.metadata.params.forEach(param => {
      initialValues[param.param] = '';
    });
    setFormValues(initialValues);
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = async (submittedValues: Record<string, string>) => {
    if (!currentFlow || !currentAuthenticator) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessages([]);

    try {
      const payload = {
        flowId: currentFlow.flowId,
        selectedAuthenticator: {
          authenticatorId: currentAuthenticator.authenticatorId,
          params: submittedValues,
        },
      };

      const response = await handleApplicationNativeAuthentication({
        baseUrl,
        payload,
      });

      onFlowChange?.(response);

      if (response.flowStatus === ApplicationNativeAuthenticationFlowStatus.SuccessCompleted) {
        onSuccess?.(response.authData);
        return;
      }

      if (
        response.flowStatus === ApplicationNativeAuthenticationFlowStatus.FailCompleted ||
        response.flowStatus === ApplicationNativeAuthenticationFlowStatus.FailIncomplete
      ) {
        setError('Authentication failed. Please check your credentials and try again.');
        return;
      }

      // Continue with next step
      if ('flowId' in response && 'nextStep' in response) {
        const nextStepResponse = response as any;
        setCurrentFlow(nextStepResponse);

        if (nextStepResponse.nextStep?.authenticators?.length > 0) {
          const nextAuthenticator = nextStepResponse.nextStep.authenticators[0];
          setCurrentAuthenticator(nextAuthenticator);
          setupFormFields(nextAuthenticator);
        }

        // Handle any messages from the response
        if (nextStepResponse.nextStep?.messages) {
          setMessages(
            nextStepResponse.nextStep.messages.map((msg: any) => ({
              type: msg.type || 'INFO',
              message: msg.message || '',
            })),
          );
        }
      }
    } catch (err) {
      const errorMessage = err instanceof AsgardeoAPIError ? err.message : 'Authentication failed';
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle input value changes.
   */
  const handleInputChange = (param: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [param]: value,
    }));
  };

  // Initialize the flow on component mount
  useEffect(() => {
    if (!isInitialized) {
      initializeFlow();
    }
  }, [isInitialized]);

  const containerClasses = clsx(
    styled && [
      withVendorCSSClassPrefix('signin'),
      withVendorCSSClassPrefix(`signin--${size}`),
      withVendorCSSClassPrefix(`signin--${variant}`),
    ],
    className,
  );

  const inputClasses = clsx(
    styled && [
      withVendorCSSClassPrefix('signin__input'),
      size === 'small' && withVendorCSSClassPrefix('signin__input--small'),
      size === 'large' && withVendorCSSClassPrefix('signin__input--large'),
    ],
  );

  const buttonClasses = clsx(
    styled && [
      withVendorCSSClassPrefix('signin__button'),
      size === 'small' && withVendorCSSClassPrefix('signin__button--small'),
      size === 'large' && withVendorCSSClassPrefix('signin__button--large'),
      variant === 'outlined' && withVendorCSSClassPrefix('signin__button--outlined'),
      variant === 'filled' && withVendorCSSClassPrefix('signin__button--filled'),
    ],
  );

  const errorClasses = clsx(styled && [withVendorCSSClassPrefix('signin__error')]);

  const messageClasses = clsx(styled && [withVendorCSSClassPrefix('signin__messages')]);

  return (
    <BaseSignIn
      currentAuthenticator={currentAuthenticator}
      formValues={formValues}
      isLoading={isLoading}
      error={error}
      messages={messages}
      isInitialized={isInitialized}
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      className={containerClasses}
      inputClassName={inputClasses}
      buttonClassName={buttonClasses}
      errorClassName={errorClasses}
      messageClassName={messageClasses}
      submitButtonText={submitButtonText}
      showLoading={showLoading}
      loadingText={loadingText}
    />
  );
};

export default SignIn;
