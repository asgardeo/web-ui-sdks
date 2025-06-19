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
  EmbeddedFlowStatus,
  EmbeddedFlowComponentType,
  withVendorCSSClassPrefix,
  AsgardeoAPIError,
} from '@asgardeo/browser';
import {clsx} from 'clsx';
import {FC, ReactElement, FormEvent, useEffect, useState, useCallback, useRef} from 'react';
import FlowProvider from '../../../contexts/Flow/FlowProvider';
import useFlow from '../../../contexts/Flow/useFlow';
import {useForm, FormField} from '../../../hooks/useForm';
import useTranslation from '../../../hooks/useTranslation';
import {createField} from '../../factories/FieldFactory';
import Alert from '../../primitives/Alert/Alert';
import Button from '../../primitives/Button/Button';
import Card from '../../primitives/Card/Card';
import Divider from '../../primitives/Divider/Divider';
import Spinner from '../../primitives/Spinner/Spinner';
import Typography from '../../primitives/Typography/Typography';

/**
 * Props for the BaseSignUp component.
 */
export interface BaseSignUpProps {
  /**
   * URL to redirect after successful sign-up.
   */
  afterSignUpUrl?: string;

  /**
   * Custom CSS class name for the submit button.
   */
  buttonClassName?: string;

  /**
   * Custom CSS class name for the form container.
   */
  className?: string;

  /**
   * Custom CSS class name for error messages.
   */
  errorClassName?: string;

  /**
   * Custom CSS class name for form inputs.
   */
  inputClassName?: string;

  isInitialized?: boolean;

  /**
   * Custom CSS class name for info messages.
   */
  messageClassName?: string;

  /**
   * Callback function called when sign-up fails.
   * @param error - The error that occurred during sign-up.
   */
  onError?: (error: Error) => void;

  /**
   * Callback function called when sign-up flow status changes.
   * @param response - The current sign-up response.
   */
  onFlowChange?: (response: EmbeddedFlowExecuteResponse) => void;

  /**
   * Function to initialize sign-up flow.
   * @returns Promise resolving to the initial sign-up response.
   */
  onInitialize: (payload?: EmbeddedFlowExecuteRequestPayload) => Promise<EmbeddedFlowExecuteResponse>;

  /**
   * Function to handle sign-up steps.
   * @param payload - The sign-up payload.
   * @returns Promise resolving to the sign-up response.
   */
  onSubmit: (payload: EmbeddedFlowExecuteRequestPayload) => Promise<EmbeddedFlowExecuteResponse>;

  /**
   * Callback function called when sign-up is successful.
   * @param response - The sign-up response data returned upon successful completion.
   */
  onSuccess?: (response: EmbeddedFlowExecuteResponse) => void;

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
 * Base SignUp component that provides embedded sign-up flow.
 * This component handles both the presentation layer and sign-up flow logic.
 * It accepts API functions as props to maintain framework independence.
 *
 * @example
 * ```tsx
 * import { BaseSignUp } from '@asgardeo/react';
 *
 * const MySignUp = () => {
 *   return (
 *     <BaseSignUp
 *       onInitialize={async (payload) => {
 *         // Your API call to initialize sign-up
 *         return await initializeSignUp(payload);
 *       }}
 *       onSubmit={async (payload) => {
 *         // Your API call to handle sign-up
 *         return await handleSignUp(payload);
 *       }}
 *       onSuccess={(response) => {
 *         console.log('Success:', response);
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
const BaseSignUp: FC<BaseSignUpProps> = props => (
  <FlowProvider>
    <BaseSignUpContent {...props} />
  </FlowProvider>
);

/**
 * Internal component that consumes FlowContext and renders the sign-up UI.
 */
const BaseSignUpContent: FC<BaseSignUpProps> = ({
  afterSignUpUrl,
  onInitialize,
  onSubmit,
  onSuccess,
  onError,
  onFlowChange,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  errorClassName = '',
  messageClassName = '',
  size = 'medium',
  variant = 'default',
  isInitialized,
}) => {
  const {t} = useTranslation();
  const {subtitle: flowSubtitle, title: flowTitle, messages: flowMessages} = useFlow();

  const [isLoading, setIsLoading] = useState(false);
  const [isFlowInitialized, setIsFlowInitialized] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<EmbeddedFlowExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Ref to track if initialization has been attempted to prevent multiple calls
  const initializationAttemptedRef = useRef(false);

  /**
   * Extract form fields from flow components
   */
  const extractFormFields = useCallback(
    (components: any[]): FormField[] => {
      const fields: FormField[] = [];

      const processComponents = (comps: any[]) => {
        comps.forEach(component => {
          if (component.type === EmbeddedFlowComponentType.Input) {
            const config = component.config || {};
            fields.push({
              name: config.name || component.id,
              required: config.required || false,
              initialValue: config.defaultValue || '',
              validator: (value: string) => {
                if (config.required && (!value || value.trim() === '')) {
                  return t('field.required');
                }
                // Add email validation if it's an email field
                if (config.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  return t('field.email.invalid');
                }
                // Add password strength validation if it's a password field
                if (config.type === 'password' && value && value.length < 8) {
                  return t('field.password.weak');
                }
                return null;
              },
            });
          }

          if (component.components && Array.isArray(component.components)) {
            processComponents(component.components);
          }
        });
      };

      processComponents(components);
      return fields;
    },
    [t],
  );

  const formFields = currentFlow?.data?.components ? extractFormFields(currentFlow.data.components) : [];

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
   * Setup form fields based on the current flow.
   */
  const setupFormFields = useCallback(
    (flowResponse: EmbeddedFlowExecuteResponse) => {
      const fields = extractFormFields(flowResponse.data?.components || []);
      const initialValues: Record<string, string> = {};

      fields.forEach(field => {
        initialValues[field.name] = field.initialValue || '';
      });

      // Reset form with new values
      resetForm();

      // Set initial values for all fields
      Object.keys(initialValues).forEach(key => {
        setFormValue(key, initialValues[key]);
      });
    },
    [extractFormFields, resetForm, setFormValue],
  );

  /**
   * Handle form submission.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentFlow) {
      return;
    }

    // Mark all fields as touched before validation
    touchAllFields();

    const validation = validateForm();
    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: EmbeddedFlowExecuteRequestPayload = {
        flowType: currentFlow.data ? (currentFlow.data as any) : undefined,
        inputs: formValues,
        actionId: 'submit', // This might need to be dynamic based on the flow
      };

      const response = await onSubmit(payload);
      onFlowChange?.(response);

      if (response.flowStatus === EmbeddedFlowStatus.Complete) {
        onSuccess?.(response);

        // Handle redirect if afterSignUpUrl is provided
        if (afterSignUpUrl) {
          window.location.href = afterSignUpUrl;
        }
        return;
      }

      if (response.flowStatus === EmbeddedFlowStatus.Incomplete) {
        // Continue with the next step
        setCurrentFlow(response);
        setupFormFields(response);
      }
    } catch (err) {
      const errorMessage = err instanceof AsgardeoAPIError ? err.message : t('errors.sign.up.flow.failure');
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle input value changes.
   */
  const handleInputChange = (name: string, value: string) => {
    setFormValue(name, value);
    setFormTouched(name, true);
  };

  /**
   * Render form components based on flow data
   */
  const renderComponents = useCallback(
    (components: any[]): ReactElement[] =>
      components
        .map((component, index) => {
          const config = component.config || {};

          switch (component.type) {
            case EmbeddedFlowComponentType.Typography:
              return (
                <Typography key={component.id || index} variant={config.variant || 'body1'} className={messageClasses}>
                  {config.text || config.content}
                </Typography>
              );

            case EmbeddedFlowComponentType.Input:
              const fieldName = config.name || component.id;
              return createField({
                type: config.type || 'text',
                name: fieldName,
                label: config.label || fieldName,
                placeholder: config.placeholder,
                required: config.required || false,
                value: formValues[fieldName] || '',
                error: touchedFields[fieldName] ? formErrors[fieldName] : undefined,
                onChange: (value: string) => handleInputChange(fieldName, value),
                className: inputClasses,
              });

            case EmbeddedFlowComponentType.Button:
              return (
                <Button
                  key={component.id || index}
                  type={config.type === 'submit' ? 'submit' : 'button'}
                  variant={config.variant || 'contained'}
                  size={size}
                  disabled={isLoading || !isFormValid}
                  className={buttonClasses}
                >
                  {isLoading ? <Spinner size="small" /> : config.text || config.label || 'Submit'}
                </Button>
              );

            case EmbeddedFlowComponentType.Form:
              return (
                <div key={component.id || index}>{component.components && renderComponents(component.components)}</div>
              );

            default:
              if (component.components && Array.isArray(component.components)) {
                return <div key={component.id || index}>{renderComponents(component.components)}</div>;
              }
              return null;
          }
        })
        .filter(Boolean) as ReactElement[],
    [formValues, touchedFields, formErrors, isFormValid, isLoading, size],
  );

  // Generate CSS classes
  const containerClasses = clsx(
    [
      withVendorCSSClassPrefix('signup'),
      withVendorCSSClassPrefix(`signup--${size}`),
      withVendorCSSClassPrefix(`signup--${variant}`),
    ],
    className,
  );

  const inputClasses = clsx(
    [
      withVendorCSSClassPrefix('signup__input'),
      size === 'small' && withVendorCSSClassPrefix('signup__input--small'),
      size === 'large' && withVendorCSSClassPrefix('signup__input--large'),
    ],
    inputClassName,
  );

  const buttonClasses = clsx(
    [
      withVendorCSSClassPrefix('signup__button'),
      size === 'small' && withVendorCSSClassPrefix('signup__button--small'),
      size === 'large' && withVendorCSSClassPrefix('signup__button--large'),
      variant === 'outlined' && withVendorCSSClassPrefix('signup__button--outlined'),
      variant === 'filled' && withVendorCSSClassPrefix('signup__button--filled'),
    ],
    buttonClassName,
  );

  const errorClasses = clsx([withVendorCSSClassPrefix('signup__error')], errorClassName);

  const messageClasses = clsx([withVendorCSSClassPrefix('signup__messages')], messageClassName);

  // Initialize the flow on component mount
  useEffect(() => {
    if (isInitialized && !isFlowInitialized && !initializationAttemptedRef.current) {
      initializationAttemptedRef.current = true;

      // Inline initialization to avoid dependency issues
      const performInitialization = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await onInitialize();

          setCurrentFlow(response);
          setIsFlowInitialized(true);
          onFlowChange?.(response);

          if (response.flowStatus === EmbeddedFlowStatus.Complete) {
            onSuccess?.(response);

            if (afterSignUpUrl) {
              window.location.href = afterSignUpUrl;
            }
            return;
          }

          if (response.flowStatus === EmbeddedFlowStatus.Incomplete) {
            setupFormFields(response);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : t('errors.sign.up.flow.initialization.failure');
          setError(errorMessage);
          onError?.(err as Error);
        } finally {
          setIsLoading(false);
        }
      };

      performInitialization();
    }
  }, [
    isInitialized,
    isFlowInitialized,
    onInitialize,
    onSuccess,
    onError,
    onFlowChange,
    setupFormFields,
    afterSignUpUrl,
    t,
  ]);

  if (!isFlowInitialized && isLoading) {
    return (
      <Card className={containerClasses}>
        <div style={{display: 'flex', justifyContent: 'center', padding: '2rem'}}>
          <Spinner size="medium" />
        </div>
      </Card>
    );
  }

  if (!currentFlow) {
    return (
      <Card className={containerClasses}>
        <Alert variant="error" className={errorClasses}>
          <Alert.Description>{error || t('errors.sign.up.flow.initialization.failure')}</Alert.Description>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className={containerClasses}>
      {(flowTitle || flowSubtitle) && (
        <div style={{marginBottom: '1.5rem', textAlign: 'center'}}>
          {flowTitle && (
            <Typography variant="h4" component="h1" style={{marginBottom: '0.5rem'}}>
              {flowTitle}
            </Typography>
          )}
          {flowSubtitle && (
            <Typography variant="body2" color="textSecondary">
              {flowSubtitle}
            </Typography>
          )}
        </div>
      )}

      {error && (
        <Alert variant="error" className={errorClasses} style={{marginBottom: '1rem'}}>
          <Alert.Description>{error}</Alert.Description>
        </Alert>
      )}

      {flowMessages && flowMessages.length > 0 && (
        <div className={messageClasses} style={{marginBottom: '1rem'}}>
          {flowMessages.map((message, index) => (
            <Alert
              key={index}
              variant={message.type?.toLowerCase() === 'error' ? 'error' : 'info'}
              style={{marginBottom: '0.5rem'}}
            >
              <Alert.Description>{message.message}</Alert.Description>
            </Alert>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {currentFlow.data?.components && renderComponents(currentFlow.data.components)}
      </form>
    </Card>
  );
};

export default BaseSignUp;
