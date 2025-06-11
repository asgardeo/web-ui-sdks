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
  ApplicationNativeAuthenticationAuthenticatorParamType,
  resolveFieldName,
  resolveFieldType,
} from '@asgardeo/browser';
import {FC, FormEvent, ReactElement} from 'react';
import {createField} from '../../factories/FieldFactory';
import Button from '../../primitives/Button/Button';
import Card from '../../primitives/Card/Card';
import Alert from '../../primitives/Alert/Alert';
import useTranslation from '../../../hooks/useTranslation';

/**
 * Interface for form field state.
 */
interface FormField {
  param: string;
  type: ApplicationNativeAuthenticationAuthenticatorParamType;
  displayName: string;
  confidential: boolean;
  required: boolean;
  value: string;
}

/**
 * Props for the BaseSignIn component.
 */
export interface BaseSignInProps {
  /**
   * Current authenticator information.
   */
  currentAuthenticator: ApplicationNativeAuthenticationAuthenticator | null;

  /**
   * Form field values.
   */
  formValues: Record<string, string>;

  /**
   * Whether the component is in loading state.
   */
  isLoading: boolean;

  /**
   * Error message to display.
   */
  error: string | null;

  /**
   * Messages to display to the user.
   */
  messages: Array<{type: string; message: string}>;

  /**
   * Whether the component has been initialized.
   */
  isInitialized: boolean;

  /**
   * Callback function called when form is submitted.
   */
  onSubmit: (formValues: Record<string, string>) => void;

  /**
   * Callback function called when input values change.
   */
  onInputChange: (param: string, value: string) => void;

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
}

/**
 * Base SignIn component that provides native authentication flow.
 * This component handles the presentation layer for authentication forms.
 * Now uses Card component for better visual structure.
 *
 * @example
 * ```tsx
 * import { BaseSignIn } from '@asgardeo/react';
 *
 * const MySignIn = () => {
 *   return (
 *     <BaseSignIn
 *       currentAuthenticator={authenticator}
 *       formValues={values}
 *       isLoading={loading}
 *       error={error}
 *       messages={messages}
 *       isInitialized={initialized}
 *       onSubmit={handleSubmit}
 *       onInputChange={handleInputChange}
 *       className="max-w-md mx-auto"
 *     />
 *   );
 * };
 * ```
 */
const BaseSignIn: FC<BaseSignInProps> = ({
  currentAuthenticator,
  formValues,
  isLoading,
  error,
  messages,
  isInitialized,
  onSubmit,
  onInputChange,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  errorClassName = '',
  messageClassName = '',
  submitButtonText = 'Sign In',
  showLoading = true,
  loadingText = 'Loading...',
}) => {
  const {t} = useTranslation();

  /**
   * Get form fields from the current authenticator.
   */
  const getFormFields = (): FormField[] => {
    if (!currentAuthenticator) return [];

    return currentAuthenticator.metadata.params
      .sort((a, b) => a.order - b.order)
      .map(param => ({
        param: param.param,
        type: param.type,
        displayName: param.displayName,
        confidential: param.confidential,
        required: currentAuthenticator.requiredParams.includes(param.param),
        value: formValues[param.param] || '',
      }));
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  if (!isInitialized && isLoading) {
    return showLoading ? (
      <Card className={className}>
        <Card.Content>
          <p>{loadingText}</p>
        </Card.Content>
      </Card>
    ) : null;
  }

  if (!currentAuthenticator) {
    return (
      <Card className={className}>
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

  const formFields = getFormFields();

  return (
    <Card className={className}>
      <form onSubmit={handleSubmit}>
        <Card.Header>
          <Card.Title level={2}>{t("signin.title")}</Card.Title>
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
                  <Alert key={index} variant={variant} style={{marginBottom: '0.5rem'}}>
                    <Alert.Description>{message.message}</Alert.Description>
                  </Alert>
                );
              })}
            </div>
          )}
        </Card.Header>

        <Card.Content>
          {error && (
            <Alert variant="error" style={{marginBottom: '1rem'}}>
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}

          {formFields.map(field => (
            <div key={field.param} style={{marginBottom: '1rem'}}>
              {createField({
                name: resolveFieldName(field),
                type: resolveFieldType(field),
                label: field.displayName,
                required: field.required,
                value: field.value,
                onChange: value => onInputChange(resolveFieldName(field), value),
                disabled: isLoading,
                className: inputClassName,
              })}
            </div>
          ))}
        </Card.Content>

        <Card.Footer>
          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            className={buttonClassName}
            color="primary"
            variant="solid"
            fullWidth
          >
            {submitButtonText}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};

export default BaseSignIn;
