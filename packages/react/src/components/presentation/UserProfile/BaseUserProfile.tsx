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

import {CSSProperties, FC, ReactElement, useMemo, useState, useCallback, useRef} from 'react';
import {Dialog, DialogContent, DialogHeading} from '../../primitives/Popover/Popover';
import {Avatar} from '../../primitives/Avatar/Avatar';
import TextField from '../../primitives/TextField/TextField';
import DatePicker from '../../primitives/DatePicker/DatePicker';
import Checkbox from '../../primitives/Checkbox/Checkbox';
import Button from '../../primitives/Button/Button';
import useTheme from '../../../contexts/Theme/useTheme';
import {User, withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';
import getMappedUserProfileValue from '../../../utils/getMappedUserProfileValue';

interface ExtendedFlatSchema {
  schemaId?: string;
  path?: string;
}

interface Schema extends ExtendedFlatSchema {
  caseExact?: boolean;
  description?: string;
  displayName?: string;
  displayOrder?: string;
  multiValued?: boolean;
  mutability?: string;
  name?: string;
  required?: boolean;
  returned?: string;
  type?: string;
  uniqueness?: string;
  value?: any;
  subAttributes?: Schema[];
}

export interface BaseUserProfileProps {
  fallback?: ReactElement;
  className?: string;
  cardLayout?: boolean;
  profile?: User;
  flattenedProfile?: User;
  schemas?: Schema[];
  mode?: 'inline' | 'popup';
  title?: string;
  attributeMapping?: {
    picture?: string | string[];
    firstName?: string | string[];
    lastName?: string | string[];
    username?: string | string[];
    [key: string]: string | string[] | undefined;
  };
  editable?: boolean;
  onChange?: (field: string, value: any) => void;
  onSubmit?: (data: any) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  onUpdate?: (payload: any) => Promise<void>;
}

const BaseUserProfile: FC<BaseUserProfileProps> = ({
  fallback = null,
  className = '',
  cardLayout = true,
  profile,
  schemas,
  flattenedProfile,
  mode = 'inline',
  title = 'User Profile',
  attributeMapping = {},
  editable = true,
  onChange,
  onSubmit,
  onUpdate,
  saveButtonText = 'Save Changes',
  cancelButtonText = 'Cancel',
}): ReactElement => {
  const {theme} = useTheme();
  const [isOpen, setIsOpen] = useState(mode === 'popup');
  const [editedUser, setEditedUser] = useState(flattenedProfile || profile);
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const triggerRef = useRef<HTMLButtonElement>(null);

  const PencilIcon = () => (
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
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );

  const toggleFieldEdit = useCallback((fieldName: string) => {
    setEditingFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }, []);

  function set(obj: Record<string, any>, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      // If last key, set the value
      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        // If the next level does not exist or is not an object, create an object
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
    }
  }

  const handleFieldSave = useCallback(
    (schema: Schema) => {
      if (!onUpdate || !schema.name) return;

      let payload = {};
      const fieldName = schema.name;
      const fieldValue =
        editedUser && fieldName && editedUser[fieldName] !== undefined
          ? editedUser[fieldName]
          : flattenedProfile && flattenedProfile[fieldName] !== undefined
          ? flattenedProfile[fieldName]
          : '';

      set(payload, fieldName, fieldValue);

      onUpdate(payload);
      // Optionally, exit edit mode for this field after save
      toggleFieldEdit(fieldName);
    },
    [editedUser, flattenedProfile, onUpdate, toggleFieldEdit],
  );

  const handleFieldCancel = useCallback(
    (fieldName: string) => {
      const currentUser = flattenedProfile || profile;
      setEditedUser(prev => ({
        ...prev,
        [fieldName]: currentUser[fieldName],
      }));
      toggleFieldEdit(fieldName);
    },
    [flattenedProfile, profile, toggleFieldEdit],
  );

  const formatLabel = useCallback((key: string): string => {
    return key
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }, []);

  const styles = useStyles();
  const buttonStyle = useMemo(
    () => ({
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
      margin: `${theme.spacing.unit}px`,
      borderRadius: theme.borderRadius.small,
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
    }),
    [theme],
  );

  const saveButtonStyle = useMemo(
    () => ({
      ...buttonStyle,
      backgroundColor: theme.colors.primary.main,
      color: theme.colors.primary.contrastText,
    }),
    [theme, buttonStyle],
  );

  const cancelButtonStyle = useMemo(
    () => ({
      ...buttonStyle,
      backgroundColor: theme.colors.secondary.main,
      border: `1px solid ${theme.colors.border}`,
    }),
    [theme, buttonStyle],
  );

  const defaultAttributeMappings = {
    picture: 'profileUrl',
    firstName: 'name.givenName',
    lastName: 'name.familyName',
    username: 'userName',
  };

  const mergedMappings = {...defaultAttributeMappings, ...attributeMapping};

  // Combines label and value/field rendering for both view and edit modes
  const renderSchemaField = (
    schema: Schema,
    isEditing: boolean,
    onEditValue?: (value: any) => void,
  ): ReactElement | null => {
    if (!schema) return null;
    const {value, displayName, description, name, type, required, mutability, subAttributes} = schema;
    const label = displayName || description || name || '';

    // If complex or subAttributes, fallback to original renderSchemaValue
    if (subAttributes && Array.isArray(subAttributes)) {
      return (
        <>
          {subAttributes.map((subAttr, index) => (
            <div key={index} style={styles.field}>
              <span style={styles.label}>{subAttr.displayName || subAttr.description || ''}</span>
              <div style={styles.value}>
                {Array.isArray(subAttr.value)
                  ? subAttr.value
                      .map(item => (typeof item === 'object' ? JSON.stringify(item) : String(item)))
                      .join(', ')
                  : typeof subAttr.value === 'object'
                  ? JSON.stringify(subAttr.value)
                  : String(subAttr.value)}
              </div>
            </div>
          ))}
        </>
      );
    }
    if (Array.isArray(value)) {
      const displayValue =
        value.length > 0
          ? value.map(item => (typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ')
          : '-';
      return (
        <>
          <span style={styles.label}>{label}</span>
          <div style={styles.value}>{displayValue}</div>
        </>
      );
    }
    if (type === 'COMPLEX' && typeof value === 'object') {
      return <ObjectDisplay data={value} />;
    }
    // If editing, show field instead of value
    if (isEditing && onEditValue && mutability !== 'READ_ONLY') {
      // Use editedUser value if available, then flattenedProfile, then schema value
      const fieldValue =
        editedUser && name && editedUser[name] !== undefined
          ? editedUser[name]
          : flattenedProfile && name && flattenedProfile[name] !== undefined
          ? flattenedProfile[name]
          : value || '';

      const commonProps = {
        label: undefined, // Don't show label in field, we render it outside
        required: required,
        value: fieldValue,
        onChange: (e: any) => onEditValue(e.target ? e.target.value : e),
        style: {
          marginBottom: 0,
        },
      };
      let field: ReactElement;
      switch (type) {
        case 'STRING':
          field = <TextField {...commonProps} />;
          break;
        case 'DATE_TIME':
          field = <DatePicker {...commonProps} />;
          break;
        case 'BOOLEAN':
          field = <Checkbox {...commonProps} checked={!!fieldValue} onChange={e => onEditValue(e.target.checked)} />;
          break;
        case 'COMPLEX':
          // For complex types, use a textarea
          field = (
            <textarea
              value={fieldValue}
              onChange={e => onEditValue(e.target.value)}
              required={required}
              style={{
                ...commonProps.style,
                minHeight: '60px',
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical',
              }}
            />
          );
          break;
        default:
          field = <TextField {...commonProps} />;
      }
      return (
        <>
          <span style={styles.label}>{label}</span>
          <div style={styles.value}>{field}</div>
        </>
      );
    }
    // Default: view mode
    const displayValue = value !== undefined && value !== null && value !== '' ? String(value) : '-';
    return (
      <>
        <span style={styles.label}>{label}</span>
        <div style={styles.value}>{displayValue}</div>
      </>
    );
  };

  const renderUserInfo = (schema: Schema) => {
    if (!schema || !schema.name) return null;

    // Skip fields with undefined or empty values unless editing or editable
    const hasValue = schema.value !== undefined && schema.value !== '' && schema.value !== null;
    const isFieldEditing = editingFields[schema.name];

    // Show field if: has value, currently editing, or is editable and READ_WRITE
    const shouldShow = hasValue || isFieldEditing || (editable && schema.mutability === 'READ_WRITE');

    if (!shouldShow) {
      return null;
    }

    const fieldStyle = {
      ...styles.field,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.unit + 'px',
    };

    return (
      <div style={fieldStyle}>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: theme.spacing.unit + 'px'}}>
          {renderSchemaField(schema, isFieldEditing, value => {
            const tempEditedUser = {...editedUser};
            tempEditedUser[schema.name!] = value;
            setEditedUser(tempEditedUser);
          })}
        </div>
        {editable && schema.mutability !== 'READ_ONLY' && (
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.unit / 2 + 'px',
              alignItems: 'center',
              marginLeft: theme.spacing.unit + 'px',
            }}
          >
            {isFieldEditing ? (
              <>
                <Button size="small" color="primary" variant="solid" onClick={() => handleFieldSave(schema)}>
                  Save
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  variant="outline"
                  onClick={() => handleFieldCancel(schema.name!)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="small"
                color="tertiary"
                variant="text"
                onClick={() => toggleFieldEdit(schema.name!)}
                title="Edit"
                style={{
                  padding: theme.spacing.unit / 2 + 'px',
                }}
              >
                <PencilIcon />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  const ObjectDisplay: FC<{data: unknown}> = ({data}) => {
    if (!data || typeof data !== 'object') return null;

    return (
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} style={{borderBottom: `1px solid ${theme.colors.border}`}}>
              <td style={{padding: theme.spacing.unit + 'px', verticalAlign: 'top'}}>
                <strong>{formatLabel(key)}:</strong>
              </td>
              <td style={{padding: theme.spacing.unit + 'px', verticalAlign: 'top'}}>
                {typeof value === 'object' ? <ObjectDisplay data={value} /> : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const getDisplayName = () => {
    const currentUser = flattenedProfile || profile;
    const firstName = getMappedUserProfileValue('firstName', mergedMappings, currentUser);
    const lastName = getMappedUserProfileValue('lastName', mergedMappings, currentUser);

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    return getMappedUserProfileValue('username', mergedMappings, currentUser) || '';
  };

  if (!profile && !flattenedProfile) {
    return fallback;
  }

  const containerStyle = {
    ...styles.root,
    ...(cardLayout ? styles.card : {}),
  };

  const currentUser = flattenedProfile || profile;
  const avatarAttributes = ['picture'];
  const excludedProps = avatarAttributes.map(attr => mergedMappings[attr] || attr);

  const profileContent = (
    <div style={containerStyle} className={clsx(withVendorCSSClassPrefix('user-profile'), className)}>
      <div style={styles.header}>
        <Avatar
          imageUrl={getMappedUserProfileValue('picture', mergedMappings, currentUser)}
          name={getDisplayName()}
          size={80}
          alt={`${getDisplayName()}'s avatar`}
        />
      </div>
      <div style={styles.infoContainer}>
        {schemas
          .filter(schema => {
            // Filter out avatar-related fields and fields we don't want to show
            if (!schema.name || schema.name === 'profileUrl') return false;

            // For non-editable mode, only show fields with values
            if (!editable) {
              const value = flattenedProfile && schema.name ? flattenedProfile[schema.name] : undefined;
              return value !== undefined && value !== '' && value !== null;
            }

            return true;
          })
          .sort((a, b) => {
            const orderA = a.displayOrder ? parseInt(a.displayOrder) : 999;
            const orderB = b.displayOrder ? parseInt(b.displayOrder) : 999;
            return orderA - orderB;
          })
          .map((schema, index) => {
            // Get the value from flattenedProfile
            const value = flattenedProfile && schema.name ? flattenedProfile[schema.name] : undefined;
            const schemaWithValue = {
              ...schema,
              value: value,
            };
            return <div key={schema.name || index}>{renderUserInfo(schemaWithValue)}</div>;
          })}
      </div>
    </div>
  );

  if (mode === 'popup') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeading>{title}</DialogHeading>
          <div style={{padding: '1rem'}}>{profileContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return profileContent;
};

const useStyles = () => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      root: {
        padding: theme.spacing.unit * 4 + 'px',
        minWidth: '600px',
        margin: '0 auto',
      } as CSSProperties,
      card: {
        background: theme.colors.background.surface,
        borderRadius: theme.borderRadius.large,
      } as CSSProperties,
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.unit * 1.5 + 'px',
        marginBottom: theme.spacing.unit * 1.5 + 'px',
      } as CSSProperties,
      profileInfo: {
        flex: 1,
      } as CSSProperties,
      name: {
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: '0',
        color: theme.colors.text.primary,
      } as CSSProperties,
      infoContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing.unit + 'px',
      } as CSSProperties,
      field: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing.unit + 'px 0',
        borderBottom: `1px solid ${theme.colors.border}`,
        minHeight: '32px',
      } as CSSProperties,
      lastField: {
        borderBottom: 'none',
      } as CSSProperties,
      label: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: theme.colors.text.secondary,
        width: '120px',
        flexShrink: 0,
        lineHeight: '32px',
      } as CSSProperties,
      value: {
        color: theme.colors.text.primary,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.unit + 'px',
        overflow: 'hidden',
        minHeight: '32px',
        '& input, & .MuiInputBase-root': {
          height: '32px',
          margin: 0,
        },
        lineHeight: '32px',
        '& table': {
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius.small,
          whiteSpace: 'normal',
        },
        '& td': {
          borderColor: theme.colors.border,
        },
      } as CSSProperties,
      popup: {
        padding: theme.spacing.unit * 2 + 'px',
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

export default BaseUserProfile;
