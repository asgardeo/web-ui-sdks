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

import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import {cx} from '@emotion/css';
import {FC, ReactElement, useState, useCallback} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import Button from '../Button/Button';
import TextField from '../TextField/TextField';
import {Plus, X} from '../Icons';
import useStyles from './KeyValueInput.styles';

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
  const {theme, colorScheme} = useTheme();
  const styles = useStyles(theme, colorScheme, disabled, readOnly, !!error);

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

  return (
    <div className={cx(withVendorCSSClassPrefix(bem('key-value-input')), styles.container, className)}>
      {label && (
        <label className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'label')), styles.label)}>
          {label}
          {required && (
            <span
              className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'required')), styles.requiredIndicator)}
            >
              {' *'}
            </span>
          )}
        </label>
      )}

      <div className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'pairs-list')), styles.pairsList)}>
        {pairs.length === 0 && readOnly ? (
          <div className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'empty-state')), styles.emptyState)}>
            No attributes defined
          </div>
        ) : readOnly ? (
          pairs.map((pair, index) => (
            <div
              key={`${pair.key}-${index}`}
              className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'readonly-pair')), styles.readOnlyPair)}
            >
              <span
                className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'readonly-key')), styles.readOnlyKey)}
              >
                {pair.key}:
              </span>
              <span
                className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'readonly-value')), styles.readOnlyValue)}
              >
                {pair.value}
              </span>
            </div>
          ))
        ) : (
          pairs.map((pair, index) => (
            <div
              key={`${pair.key}-${index}`}
              className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'pair-row')), styles.pairRow)}
            >
              <TextField
                placeholder={keyPlaceholder}
                value={pair.key}
                onChange={e => handleUpdatePair(index, 'key', e.target.value)}
                disabled={disabled || readOnly}
                className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'pair-input')), styles.pairInput)}
                aria-label={`${keyLabel} ${index + 1}`}
              />
              <TextField
                placeholder={valuePlaceholder}
                value={pair.value}
                onChange={e => handleUpdatePair(index, 'value', e.target.value)}
                disabled={disabled || readOnly}
                className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'pair-input')), styles.pairInput)}
                aria-label={`${valueLabel} ${index + 1}`}
              />
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemovePair(index)}
                  disabled={disabled}
                  className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'remove-button')), styles.removeButton)}
                  aria-label={`${removeButtonText} ${pair.key}`}
                >
                  <X width={16} height={16} />
                </button>
              )}
            </div>
          ))
        )}

        {!readOnly && (
          <div className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'add-row')), styles.addRow)}>
            <TextField
              placeholder={keyPlaceholder}
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              disabled={disabled}
              className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'pair-input')), styles.pairInput)}
              aria-label="New key"
            />
            <TextField
              placeholder={valuePlaceholder}
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              disabled={disabled}
              className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'pair-input')), styles.pairInput)}
              aria-label="New value"
              onKeyPress={e => {
                if (e.key === 'Enter' && !isAddDisabled) {
                  handleAddPair();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddPair}
              disabled={isAddDisabled}
              className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'add-button')), styles.addButton)}
              aria-label="Add new key-value pair"
            >
              <Plus width={16} height={16} />
            </button>
          </div>
        )}
      </div>

      {(helperText || error) && (
        <div className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'helper-text')), styles.helperText)}>
          {error || helperText}
        </div>
      )}

      {maxPairs && (
        <div className={cx(withVendorCSSClassPrefix(bem('key-value-input', 'counter')), styles.counterText)}>
          {pairs.length} of {maxPairs} pairs used
        </div>
      )}
    </div>
  );
};

export default KeyValueInput;
