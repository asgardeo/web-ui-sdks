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

import {CSSProperties, FC, ReactNode, useCallback, useState} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '@emotion/css';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import TextField from '../TextField/TextField';
import DatePicker from '../DatePicker/DatePicker';
import Checkbox from '../Checkbox/Checkbox';
import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import useStyles from './MultiInput.styles';

export type MultiInputType = 'text' | 'email' | 'tel' | 'url' | 'password' | 'date' | 'boolean';
export type MultiInputFieldType = 'STRING' | 'DATE_TIME' | 'BOOLEAN';

export interface MultiInputProps {
  /**
   * Label text to display above the inputs
   */
  label?: string;
  /**
   * Error message to display below the inputs
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
   * Helper text to display below the inputs
   */
  helperText?: string;
  /**
   * Placeholder text for input fields
   */
  placeholder?: string;
  /**
   * Array of values
   */
  values: string[];
  /**
   * Callback when values change
   */
  onChange: (values: string[]) => void;
  /**
   * Input type
   */
  type?: MultiInputType;
  /**
   * Field type for different input components
   */
  fieldType?: MultiInputFieldType;
  /**
   * Icon to display at the start (left) of each input
   */
  startIcon?: ReactNode;
  /**
   * Icon to display at the end (right) of each input (in addition to add/remove buttons)
   */
  endIcon?: ReactNode;
  /**
   * Minimum number of fields to show (default: 1)
   */
  minFields?: number;
  /**
   * Maximum number of fields to allow (default: unlimited)
   */
  maxFields?: number;
  /**
   * Custom style object
   */
  style?: CSSProperties;
}

const MultiInput: FC<MultiInputProps> = ({
  label,
  error,
  required,
  className,
  disabled,
  helperText,
  placeholder = 'Enter value',
  values = [],
  onChange,
  type = 'text',
  fieldType = 'STRING',
  startIcon,
  endIcon,
  minFields = 1,
  maxFields,
  style = {},
}) => {
  const {theme, colorScheme} = useTheme();
  const canAddMore = !maxFields || values.length < maxFields;
  const canRemove = values.length > minFields;
  const styles = useStyles(theme, colorScheme, !!disabled, !!error, canAddMore, canRemove);

  const PlusIcon = ({className}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" className={cx(styles.icon, className)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );

  const BinIcon = ({className}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" className={cx(styles.icon, className)}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14ZM10 11v6M14 11v6" />
    </svg>
  );

  const handleAddValue = useCallback(
    (newValue: string) => {
      if (newValue.trim() !== '' && (!maxFields || values.length < maxFields)) {
        onChange([...values, newValue.trim()]);
      }
    },
    [values, onChange, maxFields],
  );

  const handleRemoveValue = useCallback(
    (index: number) => {
      if (values.length > minFields) {
        const updatedValues = values.filter((_, i) => i !== index);
        onChange(updatedValues);
      }
    },
    [values, onChange, minFields],
  );

  const renderInputField = useCallback(
    (
      value: string,
      onValueChange: (value: string) => void,
      attachedEndIcon?: ReactNode,
      onEndIconClick?: () => void,
    ) => {
      const handleInputChange = (e: any) => {
        const newValue = e.target ? e.target.value : e;
        onValueChange(newValue);
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && onEndIconClick) {
          e.preventDefault();
          onEndIconClick();
        }
      };

      const finalEndIcon = attachedEndIcon || endIcon;

      const commonProps = {
        value,
        onChange: handleInputChange,
        onKeyDown: handleKeyDown,
        placeholder,
        disabled,
        startIcon,
        endIcon: finalEndIcon,
        onEndIconClick,
        error,
      };

      switch (fieldType) {
        case 'DATE_TIME':
          return <DatePicker {...commonProps} />;
        case 'BOOLEAN':
          return (
            <Checkbox
              {...commonProps}
              checked={value === 'true' || Boolean(value)}
              onChange={(e: any) => onValueChange(e.target.checked ? 'true' : 'false')}
            />
          );
        default:
          return <TextField {...commonProps} type={type} />;
      }
    },
    [placeholder, disabled, startIcon, endIcon, error, fieldType, type],
  );

  // State for the current input value
  const [currentInputValue, setCurrentInputValue] = useState('');

  const handleInputSubmit = useCallback(() => {
    if (currentInputValue.trim() !== '') {
      handleAddValue(currentInputValue);
      setCurrentInputValue('');
    }
  }, [currentInputValue, handleAddValue]);

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={cx(withVendorCSSClassPrefix(bem('multi-input')), className)}
      style={style}
    >
      {label && (
        <InputLabel required={required} error={!!error}>
          {label}
        </InputLabel>
      )}
      <div className={cx(withVendorCSSClassPrefix(bem('multi-input', 'container')), styles.container)}>
        {/* Input field at the top */}
        <div className={cx(withVendorCSSClassPrefix(bem('multi-input', 'input-row')), styles.inputRow)}>
          <div className={cx(withVendorCSSClassPrefix(bem('multi-input', 'input-wrapper')), styles.inputWrapper)}>
            {renderInputField(
              currentInputValue,
              setCurrentInputValue,
              canAddMore ? <PlusIcon className={styles.plusIcon} /> : undefined,
              canAddMore ? handleInputSubmit : undefined,
            )}
          </div>
        </div>

        {/* List of added items */}
        {values.length > 0 && (
          <div className={cx(withVendorCSSClassPrefix(bem('multi-input', 'list-container')), styles.listContainer)}>
            {values.map((value, index) => (
              <div
                key={index}
                className={cx(withVendorCSSClassPrefix(bem('multi-input', 'list-item')), styles.listItem)}
              >
                <span
                  className={cx(withVendorCSSClassPrefix(bem('multi-input', 'list-item-text')), styles.listItemText)}
                >
                  {value}
                </span>
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(index)}
                    disabled={disabled}
                    className={cx(withVendorCSSClassPrefix(bem('multi-input', 'remove-button')), styles.removeButton)}
                    title="Remove value"
                  >
                    <BinIcon className={styles.icon} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FormControl>
  );
};

export default MultiInput;
