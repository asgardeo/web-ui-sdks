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

import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';
import {FC, ReactElement, useState, useCallback, CSSProperties} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import Button from '../Button/Button';
import TextField from '../TextField/TextField';
import {Plus, X} from '../Icons';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface KeyValueInputProps {
  /**
   * CSS class name for styling the component.
   */
  className?: string;

  /**
   * Whether the input is disabled.
   */
  disabled?: boolean;

  /**
   * Error message to display.
   */
  error?: string;

  /**
   * Help text to display below the input.
   */
  helperText?: string;

  /**
   * Label for the key input field.
   */
  keyLabel?: string;

  /**
   * Placeholder text for the key input field.
   */
  keyPlaceholder?: string;

  /**
   * Label for the component.
   */
  label?: string;

  /**
   * Maximum number of key-value pairs allowed.
   */
  maxPairs?: number;
  /**
   * Callback fired when the key-value pairs change.
   */
  onChange?: (pairs: KeyValuePair[]) => void;

  /**
   * Callback fired when a pair is added.
   */
  onAdd?: (pair: KeyValuePair) => void;

  /**
   * Callback fired when a pair is removed.
   */
  onRemove?: (pair: KeyValuePair, index: number) => void;

  /**
   * Whether the component is in read-only mode.
   */
  readOnly?: boolean;

  /**
   * Text for the remove button.
   */
  removeButtonText?: string;

  /**
   * Whether the component is required.
   */
  required?: boolean;

  /**
   * Current key-value pairs.
   */
  value?: Record<string, any> | KeyValuePair[];

  /**
   * Label for the value input field.
   */
  valueLabel?: string;

  /**
   * Placeholder text for the value input field.
   */
  valuePlaceholder?: string;
}

/**
 * KeyValueInput component allows users to manage key-value pairs with add/remove functionality.
 * It provides a user-friendly interface for editing organization attributes or similar data structures.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <KeyValueInput
 *   label="Organization Attributes"
 *   onChange={(pairs) => console.log(pairs)}
 * />
 *
 * // With initial values
 * <KeyValueInput
 *   label="Organization Attributes"
 *   value={{department: 'IT', location: 'New York'}}
 *   onChange={(pairs) => console.log(pairs)}
 * />
 *
 * // With add/remove callbacks
 * <KeyValueInput
 *   label="Custom Attributes"
 *   value={attributes}
 *   onChange={(pairs) => setAttributes(pairs)}
 *   onAdd={(pair) => console.log('Added:', pair)}
 *   onRemove={(pair, index) => console.log('Removed:', pair, 'at index:', index)}
 * />
 * ```
 */
const KeyValueInput: FC<KeyValueInputProps> = ({
  className = '',
  disabled = false,
  error,
  helperText,
  keyLabel = 'Key',
  keyPlaceholder = 'Enter key',
  label,
  maxPairs,
  onChange,
  onAdd,
  onRemove,
  readOnly = false,
  removeButtonText = 'Remove',
  required = false,
  value = {},
  valueLabel = 'Value',
  valuePlaceholder = 'Enter value',
}): ReactElement => {
  const {theme} = useTheme();

  // Convert value to array format
  const initialPairs: KeyValuePair[] = Array.isArray(value)
    ? value
    : Object.entries(value).map(([key, val]) => ({key, value: String(val)}));

  const [pairs, setPairs] = useState<KeyValuePair[]>(initialPairs);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddPair = useCallback(() => {
    if (!newKey.trim() || !newValue.trim()) return;
    if (maxPairs && pairs.length >= maxPairs) return;

    const newPair: KeyValuePair = {
      key: newKey.trim(),
      value: newValue.trim(),
    };

    const updatedPairs = [...pairs, newPair];
    setPairs(updatedPairs);
    setNewKey('');
    setNewValue('');

    if (onChange) {
      onChange(updatedPairs);
    }

    if (onAdd) {
      onAdd(newPair);
    }
  }, [newKey, newValue, pairs, maxPairs, onChange, onAdd]);

  const handleRemovePair = useCallback(
    (index: number) => {
      const pairToRemove = pairs[index];
      const updatedPairs = pairs.filter((_, i) => i !== index);
      setPairs(updatedPairs);

      if (onChange) {
        onChange(updatedPairs);
      }

      if (onRemove) {
        onRemove(pairToRemove, index);
      }
    },
    [pairs, onChange, onRemove],
  );

  const handleUpdatePair = useCallback(
    (index: number, field: 'key' | 'value', newVal: string) => {
      const updatedPairs = pairs.map((pair, i) => {
        if (i === index) {
          return {...pair, [field]: newVal};
        }
        return pair;
      });
      setPairs(updatedPairs);

      if (onChange) {
        onChange(updatedPairs);
      }
    },
    [pairs, onChange],
  );

  const canAddMore = !maxPairs || pairs.length < maxPairs;
  const isAddDisabled = disabled || readOnly || !canAddMore || !newKey.trim() || !newValue.trim();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${theme.spacing.unit / 2}px`,
    } as CSSProperties,
    label: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: theme.colors.text.primary,
      marginBottom: `${theme.spacing.unit / 2}px`,
    } as CSSProperties,
    pairsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${theme.spacing.unit / 4}px`,
    } as CSSProperties,
    pairRow: {
      display: 'flex',
      alignItems: 'center',
      gap: `${theme.spacing.unit / 2}px`,
      padding: `${theme.spacing.unit / 2}px`,
      borderRadius: theme.borderRadius.small,
      backgroundColor: 'transparent',
      border: 'none',
      '&:hover': {
        backgroundColor: theme.colors.background.surface,
      },
    } as CSSProperties,
    pairInput: {
      flex: 1,
      minWidth: 0,
    } as CSSProperties,
    addRow: {
      display: 'flex',
      alignItems: 'center',
      gap: `${theme.spacing.unit / 2}px`,
      padding: `${theme.spacing.unit / 2}px`,
      border: 'none',
      borderRadius: theme.borderRadius.small,
      backgroundColor: 'transparent',
      marginTop: `${theme.spacing.unit / 2}px`,
    } as CSSProperties,
    removeButton: {
      minWidth: 'auto',
      width: '24px',
      height: '24px',
      padding: '0',
      backgroundColor: 'transparent',
      color: theme.colors.text.secondary,
      border: 'none',
      borderRadius: theme.borderRadius.small,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: theme.colors.background.surface,
        color: theme.colors.error.main,
      },
    } as CSSProperties,
    addButton: {
      minWidth: 'auto',
      width: '24px',
      height: '24px',
      padding: '0',
      backgroundColor: 'transparent',
      color: theme.colors.primary.main,
      border: 'none',
      borderRadius: theme.borderRadius.small,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: theme.colors.primary.main,
        color: theme.colors.primary.contrastText,
      },
    } as CSSProperties,
    helperText: {
      fontSize: '0.75rem',
      color: error ? theme.colors.error.main : theme.colors.text.secondary,
      marginTop: `${theme.spacing.unit / 2}px`,
    } as CSSProperties,
    emptyState: {
      padding: `${theme.spacing.unit}px`,
      textAlign: 'center' as const,
      color: theme.colors.text.secondary,
      fontStyle: 'italic',
      fontSize: '0.75rem',
    } as CSSProperties,
    readOnlyPair: {
      display: 'flex',
      alignItems: 'center',
      gap: `${theme.spacing.unit / 2}px`,
      padding: `${theme.spacing.unit / 4}px 0`,
      minHeight: '20px',
    } as CSSProperties,
    readOnlyKey: {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: theme.colors.text.secondary,
      minWidth: '80px',
      flexShrink: 0,
    } as CSSProperties,
    readOnlyValue: {
      fontSize: '0.75rem',
      color: theme.colors.text.primary,
      wordBreak: 'break-word' as const,
      flex: 1,
    } as CSSProperties,
  };

  return (
    <div className={clsx(withVendorCSSClassPrefix('key-value-input'), className)} style={styles.container}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={{color: theme.colors.error.main}}> *</span>}
        </label>
      )}

      <div style={styles.pairsList}>
        {pairs.length === 0 && readOnly ? (
          <div style={styles.emptyState}>No attributes defined</div>
        ) : readOnly ? (
          pairs.map((pair, index) => (
            <div key={`${pair.key}-${index}`} style={styles.readOnlyPair}>
              <span style={styles.readOnlyKey}>{pair.key}:</span>
              <span style={styles.readOnlyValue}>{pair.value}</span>
            </div>
          ))
        ) : (
          pairs.map((pair, index) => (
            <div key={`${pair.key}-${index}`} style={styles.pairRow}>
              <TextField
                placeholder={keyPlaceholder}
                value={pair.key}
                onChange={e => handleUpdatePair(index, 'key', e.target.value)}
                disabled={disabled || readOnly}
                style={styles.pairInput}
                aria-label={`${keyLabel} ${index + 1}`}
              />
              <TextField
                placeholder={valuePlaceholder}
                value={pair.value}
                onChange={e => handleUpdatePair(index, 'value', e.target.value)}
                disabled={disabled || readOnly}
                style={styles.pairInput}
                aria-label={`${valueLabel} ${index + 1}`}
              />
              {!readOnly && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleRemovePair(index)}
                  disabled={disabled}
                  style={styles.removeButton}
                  aria-label={`${removeButtonText} ${pair.key}`}
                >
                  <X width={16} height={16} />
                </Button>
              )}
            </div>
          ))
        )}

        {!readOnly && (
          <div style={styles.addRow}>
            <TextField
              placeholder={keyPlaceholder}
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              disabled={disabled}
              style={styles.pairInput}
              aria-label="New key"
            />
            <TextField
              placeholder={valuePlaceholder}
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              disabled={disabled}
              style={styles.pairInput}
              aria-label="New value"
              onKeyPress={e => {
                if (e.key === 'Enter' && !isAddDisabled) {
                  handleAddPair();
                }
              }}
            />
            <Button
              variant="solid"
              size="small"
              onClick={handleAddPair}
              disabled={isAddDisabled}
              style={styles.addButton}
              aria-label="Add new key-value pair"
            >
              <Plus width={16} height={16} />
            </Button>
          </div>
        )}
      </div>

      {(helperText || error) && <div style={styles.helperText}>{error || helperText}</div>}

      {maxPairs && (
        <div style={styles.helperText}>
          {pairs.length} of {maxPairs} pairs used
        </div>
      )}
    </div>
  );
};

export default KeyValueInput;
