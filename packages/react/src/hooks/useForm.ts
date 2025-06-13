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

import {useState, useCallback} from 'react';

/**
 * Generic form field configuration
 */
export interface FormField {
  name: string;
  required?: boolean;
  initialValue?: string;
  validator?: (value: string) => string | null;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Configuration for the useForm hook
 */
export interface UseFormConfig<T extends Record<string, string>> {
  /**
   * Initial form values
   */
  initialValues?: Partial<T>;
  /**
   * Form field definitions
   */
  fields?: FormField[];
  /**
   * Global form validator function
   */
  validator?: (values: T) => Record<string, string>;
  /**
   * Whether to validate on change (default: false)
   */
  validateOnChange?: boolean;
  /**
   * Whether to validate on blur (default: true)
   */
  validateOnBlur?: boolean;
  /**
   * Custom required field validation message
   */
  requiredMessage?: string;
}

/**
 * Return type for the useForm hook
 */
export interface UseFormReturn<T extends Record<string, string>> {
  /**
   * Current form values
   */
  values: T;
  /**
   * Fields that have been touched by the user
   */
  touched: Record<keyof T, boolean>;
  /**
   * Current validation errors
   */
  errors: Record<keyof T, string>;
  /**
   * Whether the form is currently valid
   */
  isValid: boolean;
  /**
   * Whether the form has been submitted
   */
  isSubmitted: boolean;
  /**
   * Set a single field value
   */
  setValue: (name: keyof T, value: string) => void;
  /**
   * Set multiple field values
   */
  setValues: (values: Partial<T>) => void;
  /**
   * Mark a field as touched
   */
  setTouched: (name: keyof T, touched?: boolean) => void;
  /**
   * Mark multiple fields as touched
   */
  setTouchedFields: (touched: Partial<Record<keyof T, boolean>>) => void;
  /**
   * Mark all fields as touched
   */
  touchAllFields: () => void;
  /**
   * Set a field error
   */
  setError: (name: keyof T, error: string) => void;
  /**
   * Set multiple field errors
   */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  /**
   * Clear all errors
   */
  clearErrors: () => void;
  /**
   * Validate a single field
   */
  validateField: (name: keyof T) => string | null;
  /**
   * Validate all fields
   */
  validateForm: () => ValidationResult;
  /**
   * Reset the form to initial values
   */
  reset: () => void;
  /**
   * Handle form submission
   */
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>;
  /**
   * Get field props for easy integration with form components
   */
  getFieldProps: (name: keyof T) => {
    name: keyof T;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
    required: boolean;
  };
}

/**
 * Generic form hook that provides comprehensive form state management and validation.
 * 
 * @template T - The type of form values (must extend Record<string, string>)
 * @param config - Configuration options for the form
 * @returns Form state and methods
 * 
 * @example
 * ```tsx
 * interface LoginForm {
 *   username: string;
 *   password: string;
 * }
 * 
 * const {
 *   values,
 *   touched,
 *   errors,
 *   isValid,
 *   setValue,
 *   handleSubmit,
 *   getFieldProps
 * } = useForm<LoginForm>({
 *   initialValues: { username: '', password: '' },
 *   fields: [
 *     { name: 'username', required: true },
 *     { name: 'password', required: true }
 *   ]
 * });
 * 
 * const onSubmit = handleSubmit((values) => {
 *   console.log('Form submitted:', values);
 * });
 * 
 * return (
 *   <form onSubmit={onSubmit}>
 *     <input {...getFieldProps('username')} />
 *     <input {...getFieldProps('password')} type="password" />
 *     <button type="submit" disabled={!isValid}>Submit</button>
 *   </form>
 * );
 * ```
 */
export const useForm = <T extends Record<string, string>>(
  config: UseFormConfig<T> = {}
): UseFormReturn<T> => {
  const {
    initialValues = {} as T,
    fields = [],
    validator,
    validateOnChange = false,
    validateOnBlur = true,
    requiredMessage = 'This field is required',
  } = config;

  // Initialize form state
  const [values, setFormValues] = useState<T>({...initialValues} as T);
  const [touched, setFormTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [errors, setFormErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get field configuration by name
  const getFieldConfig = useCallback((name: keyof T): FormField | undefined => {
    return fields.find(field => field.name === name);
  }, [fields]);

  // Validate a single field
  const validateField = useCallback((name: keyof T): string | null => {
    const value = values[name] || '';
    const fieldConfig = getFieldConfig(name);
    
    // Check required validation
    if (fieldConfig?.required && (!value || value.trim() === '')) {
      return requiredMessage;
    }
    
    // Run custom field validator
    if (fieldConfig?.validator) {
      const fieldError = fieldConfig.validator(value);
      if (fieldError) return fieldError;
    }
    
    return null;
  }, [values, getFieldConfig, requiredMessage]);

  // Validate the entire form
  const validateForm = useCallback((): ValidationResult => {
    const newErrors: Record<keyof T, string> = {} as Record<keyof T, string>;
    
    // Validate individual fields
    fields.forEach(field => {
      const error = validateField(field.name as keyof T);
      if (error) {
        newErrors[field.name as keyof T] = error;
      }
    });
    
    // Run global validator if provided
    if (validator) {
      const globalErrors = validator(values);
      Object.keys(globalErrors).forEach(key => {
        if (globalErrors[key]) {
          newErrors[key as keyof T] = globalErrors[key];
        }
      });
    }
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  }, [fields, validateField, validator, values]);

  // Check if form is currently valid
  const isValid = Object.keys(errors).length === 0;

  // Set a single field value
  const setValue = useCallback((name: keyof T, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate on change if enabled
    if (validateOnChange) {
      const error = validateField(name);
      setFormErrors(prev => ({
        ...prev,
        [name]: error || '',
      }));
    }
  }, [validateField, validateOnChange]);

  // Set multiple field values
  const setValues = useCallback((newValues: Partial<T>) => {
    setFormValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  // Mark a field as touched
  const setTouched = useCallback((name: keyof T, isTouched: boolean = true) => {
    setFormTouched(prev => ({
      ...prev,
      [name]: isTouched,
    }));
    
    // Validate on blur if enabled and field is touched
    if (validateOnBlur && isTouched) {
      const error = validateField(name);
      setFormErrors(prev => ({
        ...prev,
        [name]: error || '',
      }));
    }
  }, [validateField, validateOnBlur]);

  // Set multiple touched fields
  const setTouchedFields = useCallback((touchedFields: Partial<Record<keyof T, boolean>>) => {
    setFormTouched(prev => ({
      ...prev,
      ...touchedFields,
    }));
  }, []);

  // Mark all fields as touched
  const touchAllFields = useCallback(() => {
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    
    setFormTouched(allTouched);
    
    // Validate all fields
    const validation = validateForm();
    setFormErrors(validation.errors as Record<keyof T, string>);
  }, [fields, validateForm]);

  // Set a field error
  const setError = useCallback((name: keyof T, error: string) => {
    setFormErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  // Set multiple field errors
  const setErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setFormErrors(prev => ({
      ...prev,
      ...newErrors,
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setFormErrors({} as Record<keyof T, string>);
  }, []);

  // Reset form to initial state
  const reset = useCallback(() => {
    setFormValues({...initialValues} as T);
    setFormTouched({} as Record<keyof T, boolean>);
    setFormErrors({} as Record<keyof T, string>);
    setIsSubmitted(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      setIsSubmitted(true);
      touchAllFields();
      
      const validation = validateForm();
      
      if (validation.isValid) {
        await onSubmit(values);
      }
    };
  }, [values, touchAllFields, validateForm]);

  // Get field props for easy integration
  const getFieldProps = useCallback((name: keyof T) => {
    const fieldConfig = getFieldConfig(name);
    
    return {
      name,
      value: values[name] || '',
      onChange: (value: string) => setValue(name, value),
      onBlur: () => setTouched(name, true),
      error: touched[name] ? errors[name] : undefined,
      touched: touched[name] || false,
      required: fieldConfig?.required || false,
    };
  }, [values, errors, touched, setValue, setTouched, getFieldConfig]);

  return {
    values,
    touched,
    errors,
    isValid,
    isSubmitted,
    setValue,
    setValues,
    setTouched,
    setTouchedFields,
    touchAllFields,
    setError,
    setErrors,
    clearErrors,
    validateField,
    validateForm,
    reset,
    handleSubmit,
    getFieldProps,
  };
};

export default useForm;
