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

import {CSSProperties, FC, ReactNode, useCallback, useState, useMemo} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '@emotion/css';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';
import TextField from '../TextField/TextField';
import DatePicker from '../DatePicker/DatePicker';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';

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
   * Custom style object
   */
  style?: CSSProperties;
  /**
   * Input type
   */
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'date' | 'boolean';
  /**
   * Field type for different input components
   */
  fieldType?: 'STRING' | 'DATE_TIME' | 'BOOLEAN';
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
}

const useStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    () => ({
      container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${theme.spacing.unit}px`,
      },
      inputRow: {
        display: 'flex',
        alignItems: 'center',
        gap: `${theme.spacing.unit}px`,
        position: 'relative' as const,
      },
      inputWrapper: {
        flex: 1,
      },
      plusIcon: {
        background: 'var(--asgardeo-color-secondary-main)',
        borderRadius: '50%',
        outline: '4px var(--asgardeo-color-secondary-main) auto',
        color: 'var(--asgardeo-color-secondary-contrastText)',
      },
      listContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${theme.spacing.unit * 0}px`,
      },
      listItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
        backgroundColor: theme.colors.background.surface,
        borderRadius: theme.borderRadius.medium,
        fontSize: '1rem',
        color: theme.colors.text.primary,
      },
      removeButton: {
        padding: `${theme.spacing.unit / 2}px`,
        minWidth: 'auto',
        color: theme.colors.error.main,
      },
    }),
    [theme],
  );
};

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
  style = {},
  type = 'text',
  fieldType = 'STRING',
  startIcon,
  endIcon,
  minFields = 1,
  maxFields,
}) => {
  const styles = useStyles();

  const PlusIcon = ({style}) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );

  const BinIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

  const canAddMore = !maxFields || values.length < maxFields;
  const canRemove = values.length > minFields;

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
      className={cx(withVendorCSSClassPrefix('multi-input'), className)}
      style={style}
    >
      {label && (
        <InputLabel required={required} error={!!error}>
          {label}
        </InputLabel>
      )}
      <div style={styles.container}>
        {/* Input field at the top */}
        <div style={styles.inputRow}>
          <div style={styles.inputWrapper}>
            {renderInputField(
              currentInputValue,
              setCurrentInputValue,
              canAddMore ? <PlusIcon style={styles.plusIcon} /> : undefined,
              canAddMore ? handleInputSubmit : undefined,
            )}
          </div>
        </div>

        {/* List of added items */}
        {values.length > 0 && (
          <div style={styles.listContainer}>
            {values.map((value, index) => (
              <div key={index} style={styles.listItem}>
                <span>{value}</span>
                {canRemove && (
                  <Button
                    size="small"
                    color="secondary"
                    variant="text"
                    onClick={() => handleRemoveValue(index)}
                    disabled={disabled}
                    title="Remove value"
                    style={styles.removeButton}
                  >
                    <BinIcon />
                  </Button>
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
