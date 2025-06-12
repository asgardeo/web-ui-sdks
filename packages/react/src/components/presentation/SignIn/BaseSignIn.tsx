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
  ApplicationNativeAuthenticationAuthenticator,
  ApplicationNativeAuthenticationInitiateResponse,
  ApplicationNativeAuthenticationHandleResponse,
  ApplicationNativeAuthenticationStepType,
  ApplicationNativeAuthenticationFlowStatus,
  ApplicationNativeAuthenticationAuthenticatorPromptType,
  AsgardeoAPIError,
  withVendorCSSClassPrefix,
} from '@asgardeo/browser';
import {FC, ReactElement, FormEvent, useState, useEffect} from 'react';
import {clsx} from 'clsx';
import Card from '../../primitives/Card/Card';
import Alert from '../../primitives/Alert/Alert';
import Divider from '../../primitives/Divider/Divider';
import useTranslation from '../../../hooks/useTranslation';
import {createSignInOptionFromAuthenticator} from './options/SignInOptionFactory';

/**
 * Props for the BaseSignIn component.
 */
export interface BaseSignInProps {
  /**
   * Function to initialize authentication flow.
   * @returns Promise resolving to the initial authentication response.
   */
  onInitialize: () => Promise<ApplicationNativeAuthenticationInitiateResponse>;

  /**
   * Function to handle authentication steps.
   * @param payload - The authentication payload.
   * @returns Promise resolving to the authentication response.
   */
  onAuthenticate: (payload: {
    flowId: string;
    selectedAuthenticator: {
      authenticatorId: string;
      params: Record<string, string>;
    };
  }) => Promise<ApplicationNativeAuthenticationHandleResponse>;

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
   * Custom CSS class name for the form container.
   */
  className?: string;

  /**
   * Custom CSS class name for form inputs.
   */
  inputClassName?: string;

  /**
   * Custom CSS class name for the submit button.
   */
  buttonClassName?: string;

  /**
   * Custom CSS class name for error messages.
   */
  errorClassName?: string;

  /**
   * Custom CSS class name for info messages.
   */
  messageClassName?: string;

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
}

/**
 * Base SignIn component that provides native authentication flow.
 * This component handles both the presentation layer and authentication flow logic.
 * It accepts API functions as props to maintain framework independence.
 *
 * @example
 * ```tsx
 * import { BaseSignIn } from '@asgardeo/react';
 *
 * const MySignIn = () => {
 *   return (
 *     <BaseSignIn
 *       onInitialize={async () => {
 *         // Your API call to initialize authentication
 *         return await initializeAuth();
 *       }}
 *       onAuthenticate={async (payload) => {
 *         // Your API call to handle authentication
 *         return await handleAuth(payload);
 *       }}
 *       onSuccess={(authData) => {
 *         console.log('Success:', authData);
 *       }}
 *       onError={(error) => {
 *         console.error('Error:', error);
 *       }}
 *       className="max-w-md mx-auto"
 *     />
 *   );
 * };
 * ```
 */
const BaseSignIn: FC<BaseSignInProps> = ({
  onInitialize,
  onAuthenticate,
  onSuccess,
  onError,
  onFlowChange,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  errorClassName = '',
  messageClassName = '',
  submitButtonText = 'Sign In',
  showLoading = true,
  loadingText = 'Loading...',
  styled = true,
  size = 'medium',
  variant = 'default',
}) => {
  const {t} = useTranslation();
  
  // Internal state management
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<ApplicationNativeAuthenticationInitiateResponse | null>(null);
  const [currentAuthenticator, setCurrentAuthenticator] = useState<ApplicationNativeAuthenticationAuthenticator | null>(
    null,
  );
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{type: string; message: string}>>([]);

  // Generate CSS classes
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
    inputClassName,
  );

  const buttonClasses = clsx(
    styled && [
      withVendorCSSClassPrefix('signin__button'),
      size === 'small' && withVendorCSSClassPrefix('signin__button--small'),
      size === 'large' && withVendorCSSClassPrefix('signin__button--large'),
      variant === 'outlined' && withVendorCSSClassPrefix('signin__button--outlined'),
      variant === 'filled' && withVendorCSSClassPrefix('signin__button--filled'),
    ],
    buttonClassName,
  );

  const errorClasses = clsx(styled && [withVendorCSSClassPrefix('signin__error')], errorClassName);

  const messageClasses = clsx(styled && [withVendorCSSClassPrefix('signin__messages')], messageClassName);

  /**
   * Setup form fields based on the current authenticator.
   */
  const setupFormFields = (authenticator: ApplicationNativeAuthenticationAuthenticator) => {
    const initialValues: Record<string, string> = {};
    authenticator.metadata?.params?.forEach(param => {
      initialValues[param.param] = '';
    });
    setFormValues(initialValues);
  };

  /**
   * Initialize the authentication flow.
   */
  const initializeFlow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await onInitialize();

      setCurrentFlow(response);
      setIsInitialized(true);
      onFlowChange?.(response);

      if (response.flowStatus === ApplicationNativeAuthenticationFlowStatus.SuccessCompleted) {
        onSuccess?.((response as any).authData || {});
        return;
      }

      if (response.nextStep?.authenticators?.length > 0) {
        if (response.nextStep.stepType === 'MULTI_OPTIONS_PROMPT' && response.nextStep.authenticators.length > 1) {
          setCurrentAuthenticator(null);
        } else {
          const authenticator = response.nextStep.authenticators[0];
          setCurrentAuthenticator(authenticator);
          setupFormFields(authenticator);
        }
      }

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

      const response = await onAuthenticate(payload);
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

      if ('flowId' in response && 'nextStep' in response) {
        const nextStepResponse = response as any;
        setCurrentFlow(nextStepResponse);

        if (nextStepResponse.nextStep?.authenticators?.length > 0) {
          if (
            nextStepResponse.nextStep.stepType === 'MULTI_OPTIONS_PROMPT' &&
            nextStepResponse.nextStep.authenticators.length > 1
          ) {
            setCurrentAuthenticator(null);
          } else {
            const nextAuthenticator = nextStepResponse.nextStep.authenticators[0];
            setCurrentAuthenticator(nextAuthenticator);
            setupFormFields(nextAuthenticator);
          }
        }

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
   * Handle authenticator selection for multi-option prompts.
   */
  const handleAuthenticatorSelection = async (
    authenticator: ApplicationNativeAuthenticationAuthenticator,
    formData?: Record<string, string>,
  ) => {
    if (!currentFlow) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessages([]);

    try {
      if (
        authenticator.metadata?.promptType === ApplicationNativeAuthenticationAuthenticatorPromptType.REDIRECTION_PROMPT
      ) {
        const payload = {
          flowId: currentFlow.flowId,
          selectedAuthenticator: {
            authenticatorId: authenticator.authenticatorId,
            params: {},
          },
        };

        const response = await onAuthenticate(payload);
        onFlowChange?.(response);

        if (response.flowStatus === ApplicationNativeAuthenticationFlowStatus.SuccessCompleted) {
          onSuccess?.(response.authData);
          return;
        }
      } else {
        if (formData) {
          const payload = {
            flowId: currentFlow.flowId,
            selectedAuthenticator: {
              authenticatorId: authenticator.authenticatorId,
              params: formData,
            },
          };

          const response = await onAuthenticate(payload);
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

          if ('flowId' in response && 'nextStep' in response) {
            const nextStepResponse = response as any;
            setCurrentFlow(nextStepResponse);

            if (nextStepResponse.nextStep?.authenticators?.length > 0) {
              if (
                nextStepResponse.nextStep.stepType === 'MULTI_OPTIONS_PROMPT' &&
                nextStepResponse.nextStep.authenticators.length > 1
              ) {
                setCurrentAuthenticator(null);
              } else {
                const nextAuthenticator = nextStepResponse.nextStep.authenticators[0];
                setCurrentAuthenticator(nextAuthenticator);
                setupFormFields(nextAuthenticator);
              }
            }

            if (nextStepResponse.nextStep?.messages) {
              setMessages(
                nextStepResponse.nextStep.messages.map((msg: any) => ({
                  type: msg.type || 'INFO',
                  message: msg.message || '',
                })),
              );
            }
          }
        } else {
          setCurrentAuthenticator(authenticator);
          setupFormFields(authenticator);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof AsgardeoAPIError ? err.message : 'Authenticator selection failed';
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

  /**
   * Check if current flow has multiple authenticator options.
   */
  const hasMultipleOptions = (): boolean => {
    return (
      currentFlow &&
      'nextStep' in currentFlow &&
      currentFlow.nextStep?.stepType === ApplicationNativeAuthenticationStepType.MultOptionsPrompt &&
      currentFlow.nextStep?.authenticators &&
      currentFlow.nextStep.authenticators.length > 1
    );
  };

  /**
   * Get available authenticators for selection.
   */
  const getAvailableAuthenticators = (): ApplicationNativeAuthenticationAuthenticator[] => {
    if (!currentFlow || !('nextStep' in currentFlow) || !currentFlow.nextStep?.authenticators) {
      return [];
    }
    return currentFlow.nextStep.authenticators;
  };

  /**
   * Get the username & password authenticator (LOCAL).
   */
  const getUsernamePasswordAuthenticator = (): ApplicationNativeAuthenticationAuthenticator | null => {
    const authenticators = getAvailableAuthenticators();
    return (
      authenticators.find(
        auth =>
          auth.idp === 'LOCAL' &&
          (auth.authenticator === 'Username & Password' || auth.authenticator === 'Identifier First'),
      ) || null
    );
  };

  /**
   * Get federated login authenticators (non-LOCAL).
   */
  const getFederatedAuthenticators = (): ApplicationNativeAuthenticationAuthenticator[] => {
    const authenticators = getAvailableAuthenticators();
    return authenticators.filter(auth => auth.idp !== 'LOCAL');
  };

  if (!isInitialized && isLoading) {
    return showLoading ? (
      <Card className={containerClasses}>
        <Card.Content>
          <p>{loadingText}</p>
        </Card.Content>
      </Card>
    ) : null;
  }

  // Handle multiple authenticator options
  if (hasMultipleOptions() && !currentAuthenticator) {
    const usernamePasswordAuth = getUsernamePasswordAuthenticator();
    const federatedAuths = getFederatedAuthenticators();

    return (
      <Card className={containerClasses}>
        <Card.Header>
          <Card.Title level={2}>{t('signin.title')}</Card.Title>
          {messages.length > 0 && (
            <div style={{marginTop: '1rem'}}>
              {messages.map((message, index) => {
                const variant =
                  message.type.toLowerCase() === 'error'
                    ? 'error'
                    : message.type.toLowerCase() === 'warning'
                    ? 'warning'
                    : message.type.toLowerCase() === 'success'
                    ? 'success'
                    : 'info';

                return (
                  <Alert key={index} variant={variant} style={{marginBottom: '0.5rem'}} className={messageClasses}>
                    <Alert.Description>{message.message}</Alert.Description>
                  </Alert>
                );
              })}
            </div>
          )}
        </Card.Header>

        <Card.Content>
          {error && (
            <Alert variant="error" style={{marginBottom: '1rem'}} className={errorClasses}>
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}

          {/* Username & Password form at the top */}
          {usernamePasswordAuth && (
            <>
              <form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const formData: Record<string, string> = {};
                  usernamePasswordAuth.metadata?.params?.forEach(param => {
                    formData[param.param] = formValues[param.param] || '';
                  });
                  handleAuthenticatorSelection(usernamePasswordAuth, formData);
                }}
              >                {createSignInOptionFromAuthenticator(
                  usernamePasswordAuth,
                  formValues,
                  isLoading,
                  handleInputChange,
                  handleAuthenticatorSelection,
                  {
                    inputClassName: inputClasses,
                    buttonClassName: buttonClasses,
                    submitButtonText,
                    error,
                  },
                )}
              </form>

              {/* Divider if there are federated options */}
              {federatedAuths.length > 0 && <Divider style={{margin: '1.5rem 0'}}>OR</Divider>}
            </>
          )}

          {/* Federated login options */}
          {federatedAuths.length > 0 && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {federatedAuths.map(authenticator => (
                <div key={authenticator.authenticatorId}>
                  {createSignInOptionFromAuthenticator(
                    authenticator,
                    formValues,
                    isLoading,
                    handleInputChange,
                    handleAuthenticatorSelection,
                    {
                      inputClassName: inputClasses,
                      buttonClassName: buttonClasses,
                      error,
                    },
                  )}
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    );
  }

  if (!currentAuthenticator) {
    return (
      <Card className={containerClasses}>
        <Card.Content>
          {error && (
            <Alert variant="error">
              <Alert.Title>Authentication Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}
        </Card.Content>
      </Card>
    );
  }

  // Single authenticator view
  return (
    <Card className={containerClasses}>
      <Card.Header>
        <Card.Title level={2}>{t('signin.title')}</Card.Title>
        {messages.length > 0 && (
          <div style={{marginTop: '1rem'}}>
            {messages.map((message, index) => {
              const variant =
                message.type.toLowerCase() === 'error'
                  ? 'error'
                  : message.type.toLowerCase() === 'warning'
                  ? 'warning'
                  : message.type.toLowerCase() === 'success'
                  ? 'success'
                  : 'info';

              return (
                <Alert key={index} variant={variant} style={{marginBottom: '0.5rem'}} className={messageClasses}>
                  <Alert.Description>{message.message}</Alert.Description>
                </Alert>
              );
            })}
          </div>
        )}
      </Card.Header>

      <Card.Content>
        {error && (
          <Alert variant="error" style={{marginBottom: '1rem'}} className={errorClasses}>
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}

        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData: Record<string, string> = {};
            currentAuthenticator.metadata?.params?.forEach(param => {
              formData[param.param] = formValues[param.param] || '';
            });
            handleSubmit(formData);
          }}
        >
          {createSignInOptionFromAuthenticator(
            currentAuthenticator,
            formValues,
            isLoading,
            handleInputChange,
            (authenticator, formData) => handleSubmit(formData || formValues),
            {
              inputClassName: inputClasses,
              buttonClassName: buttonClasses,
              submitButtonText,
              error,
            },
          )}
        </form>
      </Card.Content>
    </Card>
  );
};

export default BaseSignIn;
