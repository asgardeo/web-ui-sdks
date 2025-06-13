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

import {useState, useCallback, useMemo} from 'react';
import {
  ApplicationNativeAuthenticationAuthenticator,
  ApplicationNativeAuthenticationInitiateResponse,
  ApplicationNativeAuthenticationHandleResponse,
  ApplicationNativeAuthenticationFlowStatus,
  ApplicationNativeAuthenticationAuthenticatorPromptType,
  AsgardeoAPIError,
} from '@asgardeo/browser';
import useTranslation from './useTranslation';
import {useForm, FormField} from './useForm';

/**
 * Props for the useSignInForm hook.
 */
export interface UseSignInFormProps {
  /**
   * Function to initialize authentication flow.
   */
  onInitialize: () => Promise<ApplicationNativeAuthenticationInitiateResponse>;

  /**
   * Function to handle authentication steps.
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
   */
  onSuccess?: (authData: Record<string, any>) => void;

  /**
   * Callback function called when authentication fails.
   */
  onError?: (error: Error) => void;

  /**
   * Callback function called when authentication flow status changes.
   */
  onFlowChange?: (
    response: ApplicationNativeAuthenticationInitiateResponse | ApplicationNativeAuthenticationHandleResponse,
  ) => void;
}

/**
 * Return type for the useSignInForm hook.
 */
export interface UseSignInFormReturn {
  // State
  isLoading: boolean;
  isInitialized: boolean;
  currentFlow: ApplicationNativeAuthenticationInitiateResponse | null;
  currentAuthenticator: ApplicationNativeAuthenticationAuthenticator | null;
  error: string | null;
  messages: Array<{type: string; message: string}>;

  // Form state and methods (from useForm)
  formValues: Record<string, string>;
  touchedFields: Record<string, boolean>;
  formErrors: Record<string, string>;
  isFormValid: boolean;
  setFormValue: (name: string, value: string) => void;
  setFormTouched: (name: string, touched?: boolean) => void;
  clearFormErrors: () => void;
  validateFormField: (name: string) => string | null;
  validateForm: () => {isValid: boolean; errors: Record<string, string>};

  // Actions
  initializeFlow: () => Promise<void>;
  handleSubmit: (submittedValues: Record<string, string>) => Promise<void>;
  handleAuthenticatorSelection: (
    authenticator: ApplicationNativeAuthenticationAuthenticator,
    formData?: Record<string, string>,
  ) => Promise<void>;
  handleInputChange: (param: string, value: string) => void;
  markAllFieldsAsTouched: () => void;
  setupFormFields: (authenticator: ApplicationNativeAuthenticationAuthenticator) => void;

  // Utilities
  hasMultipleOptions: () => boolean;
  getAvailableAuthenticators: () => ApplicationNativeAuthenticationAuthenticator[];
}

/**
 * Custom hook for managing sign-in form state and logic.
 *
 * This hook encapsulates all the form-related functionality including:
 * - Form field values and touched state management using the generic useForm hook
 * - Authentication flow handling
 * - Error and message state management
 * - Field validation triggering
 *
 * @param props - Configuration for the sign-in form
 * @returns Object containing state and action handlers for the sign-in form
 *
 * @example
 * ```tsx
 * const {
 *   isLoading,
 *   currentAuthenticator,
 *   formValues,
 *   touchedFields,
 *   error,
 *   handleSubmit,
 *   handleInputChange,
 *   initializeFlow
 * } = useSignInForm({
 *   onInitialize: async () => await signIn(),
 *   onAuthenticate: async (payload) => await authenticate(payload),
 *   onSuccess: (authData) => console.log('Success:', authData),
 *   onError: (error) => console.error('Error:', error)
 * });
 * ```
 */
export const useSignInForm = ({
  onInitialize,
  onAuthenticate,
  onSuccess,
  onError,
  onFlowChange,
}: UseSignInFormProps): UseSignInFormReturn => {
  const {t} = useTranslation();

  // Authentication state management
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<ApplicationNativeAuthenticationInitiateResponse | null>(null);
  const [currentAuthenticator, setCurrentAuthenticator] = useState<ApplicationNativeAuthenticationAuthenticator | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{type: string; message: string}>>([]);

  // Create form fields configuration based on current authenticator
  const formFields = useMemo((): FormField[] => {
    if (!currentAuthenticator?.metadata?.params) {
      return [];
    }

    return currentAuthenticator.metadata.params.map(param => ({
      name: param.param,
      required: currentAuthenticator.requiredParams.includes(param.param),
      initialValue: '',
      validator: (value: string) => {
        // Add custom validation logic here if needed
        if (currentAuthenticator.requiredParams.includes(param.param) && (!value || value.trim() === '')) {
          return t('field.required');
        }
        return null;
      },
    }));
  }, [currentAuthenticator, t]);

  // Initialize form with dynamic fields
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

      // Validate form before submission
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
            // Validate form before submission
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

  return {
    // State
    isLoading,
    isInitialized,
    currentFlow,
    currentAuthenticator,
    error,
    messages,

    // Form state and methods (from useForm)
    formValues,
    touchedFields,
    formErrors,
    isFormValid,
    setFormValue,
    setFormTouched,
    clearFormErrors,
    validateFormField,
    validateForm,

    // Actions
    initializeFlow,
    handleSubmit,
    handleAuthenticatorSelection,
    handleInputChange,
    markAllFieldsAsTouched,
    setupFormFields,

    // Utilities
    hasMultipleOptions,
    getAvailableAuthenticators,
  };
};

export default useSignInForm;
