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
import {FC, ReactElement, FormEvent, useEffect, useState, useCallback} from 'react';
import {clsx} from 'clsx';
import Card from '../../primitives/Card/Card';
import Alert from '../../primitives/Alert/Alert';
import Divider from '../../primitives/Divider/Divider';
import Typography from '../../primitives/Typography/Typography';
import useTranslation from '../../../hooks/useTranslation';
import {useForm, FormField} from '../../../hooks/useForm';
import FlowProvider from '../../../contexts/Flow/FlowProvider';
import useFlow from '../../../contexts/Flow/useFlow';
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
const BaseSignIn: FC<BaseSignInProps> = props => {
  return (
    <FlowProvider>
      <BaseSignInContent {...props} />
    </FlowProvider>
  );
};

/**
 * Internal component that consumes FlowContext and renders the sign-in UI.
 */
const BaseSignInContent: FC<BaseSignInProps> = ({
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
  showLoading = true,
  loadingText,
  styled = true,
  size = 'medium',
  variant = 'default',
}) => {
  const {t} = useTranslation();
  const {subtitle: flowSubtitle, title: flowTitle, messages: flowMessages} = useFlow();

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<ApplicationNativeAuthenticationInitiateResponse | null>(null);
  const [currentAuthenticator, setCurrentAuthenticator] = useState<ApplicationNativeAuthenticationAuthenticator | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{type: string; message: string}>>([]);

  const formFields: FormField[] =
    currentAuthenticator?.metadata?.params?.map(param => ({
      name: param.param,
      required: currentAuthenticator.requiredParams.includes(param.param),
      initialValue: '',
      validator: (value: string) => {
        if (currentAuthenticator.requiredParams.includes(param.param) && (!value || value.trim() === '')) {
          return t('field.required');
        }
        return null;
      },
    })) || [];

  const form = useForm<Record<string, string>>({
    initialValues: {},
    fields: formFields,
    validateOnBlur: true,
    validateOnChange: false,
    requiredMessage: t('field.required'),
  });

  const {
    values: formValues,
    touched: touchedFields,
    errors: formErrors,
    isValid: isFormValid,
    setValue: setFormValue,
    setTouched: setFormTouched,
    clearErrors: clearFormErrors,
    validateField: validateFormField,
    validateForm,
    touchAllFields,
    reset: resetForm,
  } = form;

  /**
   * Setup form fields based on the current authenticator.
   */
  const setupFormFields = useCallback(
    (authenticator: ApplicationNativeAuthenticationAuthenticator) => {
      const initialValues: Record<string, string> = {};
      authenticator.metadata?.params?.forEach(param => {
        initialValues[param.param] = '';
      });

      // Reset form with new values
      resetForm();

      // Set initial values for all fields
      Object.keys(initialValues).forEach(key => {
        setFormValue(key, initialValues[key]);
      });
    },
    [resetForm, setFormValue],
  );

  /**
   * Mark all fields as touched for validation purposes.
   */
  const markAllFieldsAsTouched = useCallback(() => {
    touchAllFields();
  }, [touchAllFields]);

  /**
   * Initialize the authentication flow.
   */
  const initializeFlow = useCallback(async () => {
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
      const errorMessage = err instanceof AsgardeoAPIError ? err.message : t('errors.initializationFailed');
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [onInitialize, onFlowChange, onSuccess, onError, setupFormFields, t]);

  /**
   * Handle form submission.
   */
  const handleSubmit = useCallback(
    async (submittedValues: Record<string, string>) => {
      if (!currentFlow || !currentAuthenticator) {
        return;
      }

      // Mark all fields as touched before validation
      markAllFieldsAsTouched();

      const validation = validateForm();
      if (!validation.isValid) {
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
          setError(t('errors.authenticationFailedDetail'));
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
        const errorMessage = err instanceof AsgardeoAPIError ? err.message : t('errors.authenticationFailed');
        setError(errorMessage);
        onError?.(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentFlow,
      currentAuthenticator,
      markAllFieldsAsTouched,
      validateForm,
      onAuthenticate,
      onFlowChange,
      onSuccess,
      onError,
      setupFormFields,
      t,
    ],
  );

  /**
   * Handle authenticator selection for multi-option prompts.
   */
  const handleAuthenticatorSelection = useCallback(
    async (authenticator: ApplicationNativeAuthenticationAuthenticator, formData?: Record<string, string>) => {
      if (!currentFlow) {
        return;
      }

      // Mark all fields as touched if we have form data (i.e., this is a submission)
      if (formData) {
        markAllFieldsAsTouched();
      }

      setIsLoading(true);
      setError(null);
      setMessages([]);

      try {
        if (
          authenticator.metadata?.promptType ===
          ApplicationNativeAuthenticationAuthenticatorPromptType.REDIRECTION_PROMPT
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
            const validation = validateForm();
            if (!validation.isValid) {
              return;
            }

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
    },
    [
      currentFlow,
      markAllFieldsAsTouched,
      validateForm,
      onAuthenticate,
      onFlowChange,
      onSuccess,
      onError,
      setupFormFields,
    ],
  );

  /**
   * Handle input value changes.
   */
  const handleInputChange = useCallback(
    (param: string, value: string) => {
      setFormValue(param, value);
      setFormTouched(param, true);
    },
    [setFormValue, setFormTouched],
  );

  /**
   * Check if current flow has multiple authenticator options.
   */
  const hasMultipleOptions = useCallback((): boolean => {
    return (
      currentFlow &&
      'nextStep' in currentFlow &&
      currentFlow.nextStep?.stepType === 'MULTI_OPTIONS_PROMPT' &&
      currentFlow.nextStep?.authenticators &&
      currentFlow.nextStep.authenticators.length > 1
    );
  }, [currentFlow]);

  /**
   * Get available authenticators for selection.
   */
  const getAvailableAuthenticators = useCallback((): ApplicationNativeAuthenticationAuthenticator[] => {
    if (!currentFlow || !('nextStep' in currentFlow) || !currentFlow.nextStep?.authenticators) {
      return [];
    }
    return currentFlow.nextStep.authenticators;
  }, [currentFlow]);

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

  // Initialize the flow on component mount
  useEffect(() => {
    if (!isInitialized) {
      initializeFlow();
    }
  }, [isInitialized, initializeFlow]);

  if (!isInitialized && isLoading) {
    return showLoading ? (
      <Card className={containerClasses}>
        <Card.Content>
          <Typography variant="body1">{loadingText ?? t('messages.loading')}</Typography>
        </Card.Content>
      </Card>
    ) : null;
  }

  if (hasMultipleOptions() && !currentAuthenticator) {
    const availableAuthenticators = getAvailableAuthenticators();

    const userPromptAuthenticators = availableAuthenticators.filter(
      auth =>
        auth.metadata?.promptType === ApplicationNativeAuthenticationAuthenticatorPromptType.USER_PROMPT ||
        // Fallback: LOCAL authenticators with params are typically user prompts
        (auth.idp === 'LOCAL' && auth.metadata?.params && auth.metadata.params.length > 0),
    );

    const optionAuthenticators = availableAuthenticators.filter(auth => !userPromptAuthenticators.includes(auth));

    return (
      <Card className={containerClasses}>
        <Card.Header>
          <Card.Title level={2}>{flowTitle || t('signin.title')}</Card.Title>
          {flowSubtitle && (
            <Typography variant="body1" style={{marginTop: '0.5rem'}}>
              {flowSubtitle || t('signin.subtitle')}
            </Typography>
          )}
          {flowMessages && flowMessages.length > 0 && (
            <div style={{marginTop: '1rem'}}>
              {flowMessages.map((flowMessage, index) => (
                <Alert
                  key={flowMessage.id || index}
                  variant={flowMessage.type}
                  style={{marginBottom: '0.5rem'}}
                  className={messageClasses}
                >
                  <Alert.Description>{flowMessage.message}</Alert.Description>
                </Alert>
              ))}
            </div>
          )}
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

          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {/* Render USER_PROMPT authenticators as form fields */}
            {userPromptAuthenticators.map((authenticator, index) => (
              <div key={authenticator.authenticatorId}>
                {index > 0 && <Divider style={{margin: '0.5rem 0'}}>OR</Divider>}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const formData: Record<string, string> = {};
                    authenticator.metadata?.params?.forEach(param => {
                      formData[param.param] = formValues[param.param] || '';
                    });
                    handleAuthenticatorSelection(authenticator, formData);
                  }}
                >
                  {createSignInOptionFromAuthenticator(
                    authenticator,
                    formValues,
                    touchedFields,
                    isLoading,
                    handleInputChange,
                    handleAuthenticatorSelection,
                    {
                      inputClassName: inputClasses,
                      buttonClassName: buttonClasses,
                      error,
                    },
                  )}
                </form>
              </div>
            ))}

            {/* Add divider between user prompts and option authenticators if both exist */}
            {userPromptAuthenticators.length > 0 && optionAuthenticators.length > 0 && (
              <Divider style={{margin: '0.5rem 0'}}>OR</Divider>
            )}

            {/* Render all other authenticators (REDIRECTION_PROMPT, multi-option buttons, etc.) */}
            {optionAuthenticators.map((authenticator, index) => (
              <div key={authenticator.authenticatorId}>
                {createSignInOptionFromAuthenticator(
                  authenticator,
                  formValues,
                  touchedFields,
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
              <Alert.Title>{t('errors.authenticationError')}</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={containerClasses}>
      <Card.Header>
        <Card.Title level={2}>{flowTitle || t('signin.title')}</Card.Title>
        <Typography variant="body1" style={{marginTop: '0.5rem'}}>
          {flowSubtitle || t('signin.subtitle')}
        </Typography>
        {flowMessages && flowMessages.length > 0 && (
          <div style={{marginTop: '1rem'}}>
            {flowMessages.map((flowMessage, index) => (
              <Alert
                key={flowMessage.id || index}
                variant={flowMessage.type}
                style={{marginBottom: '0.5rem'}}
                className={messageClasses}
              >
                <Alert.Description>{flowMessage.message}</Alert.Description>
              </Alert>
            ))}
          </div>
        )}
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
            <Alert.Title>{t('errors.title')}</Alert.Title>
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
            touchedFields,
            isLoading,
            handleInputChange,
            (authenticator, formData) => handleSubmit(formData || formValues),
            {
              inputClassName: inputClasses,
              buttonClassName: buttonClasses,
              error,
            },
          )}
        </form>
      </Card.Content>
    </Card>
  );
};

export default BaseSignIn;
