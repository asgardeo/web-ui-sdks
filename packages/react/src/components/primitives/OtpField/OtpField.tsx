/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {FC, KeyboardEvent, ChangeEvent, useRef, useEffect, useState, CSSProperties} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '@emotion/css';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import useStyles from './OtpField.styles';

export type OtpFieldType = 'text' | 'number' | 'password';

export interface OtpInputProps {
  /**
   * Label text to display above the OTP input
   */
  label?: string;
  /**
   * Error message to display below the OTP input
   */
  error?: string;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Helper text to display below the OTP input
   */
  helperText?: string;
  /**
   * Number of OTP input fields
   */
  length?: number;
  /**
   * Current OTP value
   */
  value?: string;
  /**
   * Callback function called when OTP value changes
   */
  onChange?: (event: {target: {value: string}}) => void;
  /**
   * Callback function called when OTP input is complete
   */
  onComplete?: (value: string) => void;
  /**
   * Type of input (text, number, password)
   */
  type?: OtpFieldType;
  /**
   * Placeholder character for each input field
   */
  placeholder?: string;
  /**
   * Custom container style
   */
  style?: CSSProperties;
  /**
   * Auto focus the first input on mount
   */
  autoFocus?: boolean;
  /**
   * Pattern for numeric input validation
   */
  pattern?: string;
}

const OtpField: FC<OtpInputProps> = ({
  label,
  error,
  className,
  required,
  disabled,
  helperText,
  length = 6,
  value = '',
  onChange,
  onComplete,
  type = 'text',
  placeholder = '',
  style = {},
  autoFocus = false,
  pattern,
}) => {
  const {theme, colorScheme} = useTheme();
  const styles = useStyles(theme, colorScheme, !!disabled, !!error, length);
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    if (value) {
      const newOtp = value.split('').slice(0, length);
      while (newOtp.length < length) {
        newOtp.push('');
      }
      setOtp(newOtp);
    } else {
      setOtp(Array(length).fill(''));
    }
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue.length > 1) return;

    if (type === 'number' && newValue && !/^\d$/.test(newValue)) return;

    if (pattern && newValue && !new RegExp(pattern).test(newValue)) return;

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    const otpValue = newOtp.join('');

    onChange?.({target: {value: otpValue}});

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];

        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        onChange?.({target: {value: newOtp.join('')}});
      } else if (otp[index]) {
        const newOtp = [...otp];

        newOtp[index] = '';
        setOtp(newOtp);
        onChange?.({target: {value: newOtp.join('')}});
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (event.key === 'Enter') {
      event.preventDefault();

      if (otp.every(digit => digit !== '') && onComplete) {
        onComplete(otp.join(''));
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedData = event.clipboardData.getData('text').slice(0, length);

    let validData = '';

    for (const char of pastedData) {
      if (type === 'number' && !/^\d$/.test(char)) continue;
      if (pattern && !new RegExp(pattern).test(char)) continue;
      validData += char;
    }

    const newOtp = Array(length).fill('');

    for (let i = 0; i < Math.min(validData.length, length); i++) {
      newOtp[i] = validData[i];
    }

    setOtp(newOtp);
    onChange?.({target: {value: newOtp.join('')}});

    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;

    inputRefs.current[focusIndex]?.focus();

    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={cx(withVendorCSSClassPrefix(bem('otp-field')), className)}
      helperTextAlign="center"
      style={style}
    >
      {label && (
        <InputLabel required={required} error={!!error}>
          {label}
        </InputLabel>
      )}
      <div className={cx(withVendorCSSClassPrefix(bem('otp-field', 'input-container')), styles.inputContainer)}>
        {Array.from({length}, (_, index) => (
          <input
            key={index}
            ref={el => {
              if (el) inputRefs.current[index] = el;
            }}
            type={type === 'password' ? 'password' : 'text'}
            inputMode={type === 'number' ? 'numeric' : 'text'}
            value={otp[index] || ''}
            onChange={event => handleChange(index, event)}
            onKeyDown={event => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={cx(withVendorCSSClassPrefix(bem('otp-field', 'input')), styles.input, {
              [withVendorCSSClassPrefix(bem('otp-field', 'input', 'error'))]: !!error,
              [styles.inputError]: !!error,
              [withVendorCSSClassPrefix(bem('otp-field', 'input', 'disabled'))]: !!disabled,
              [styles.inputDisabled]: !!disabled,
            })}
            maxLength={1}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={`${label || 'OTP'} digit ${index + 1}`}
            aria-invalid={!!error}
            aria-required={required}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    </FormControl>
  );
};

export default OtpField;
