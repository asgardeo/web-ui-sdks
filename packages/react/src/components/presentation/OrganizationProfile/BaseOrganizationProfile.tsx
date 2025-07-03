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

import {withVendorCSSClassPrefix, OrganizationDetails} from '@asgardeo/browser';
import clsx from 'clsx';
import {FC, ReactElement, useMemo, CSSProperties, useState, useCallback, useRef} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import {Avatar} from '../../primitives/Avatar/Avatar';
import Button from '../../primitives/Button/Button';
import Checkbox from '../../primitives/Checkbox/Checkbox';
import DatePicker from '../../primitives/DatePicker/DatePicker';
import KeyValueInput from '../../primitives/KeyValueInput/KeyValueInput';
import {Dialog, DialogContent, DialogHeading} from '../../primitives/Popover/Popover';
import TextField from '../../primitives/TextField/TextField';
import Card from '../../primitives/Card/Card';

/**
 * Formats a date string to a human-readable format
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export interface BaseOrganizationProfileProps {
  /**
   * Callback fired when the cancel button is clicked (only used in editable mode).
   */
  cancelButtonText?: string;

  /**
   * Whether to display the profile in a card layout.
   */
  cardLayout?: boolean;

  /**
   * CSS class name for styling the component.
   */
  className?: string;

  /**
   * Whether the organization profile is editable.
   */
  editable?: boolean;

  /**
   * Component to render when no organization data is available.
   */
  fallback?: ReactElement;

  /**
   * Array of field configurations to display. Each field specifies what organization data to show.
   */
  fields?: Array<{
    key: keyof OrganizationDetails | 'attributes';
    label: string;
    editable?: boolean;
    render?: (value: any, organization: OrganizationDetails) => React.ReactNode;
  }>;

  /**
   * Display mode for the component.
   */
  mode?: 'inline' | 'popup';

  /**
   * Callback fired when a field value changes.
   */
  onChange?: (field: string, value: any) => void;

  /**
   * Callback fired when the popup should be closed (only used in popup mode).
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Callback fired when the form is submitted (only used in editable mode).
   */
  onSubmit?: (data: any) => void;

  /**
   * Callback fired when the organization should be updated.
   */
  onUpdate?: (payload: any) => Promise<void>;

  /**
   * Whether the popup is open (only used in popup mode).
   */
  open?: boolean;

  /**
   * The organization details to display.
   */
  organization?: OrganizationDetails | null;

  /**
   * Text for the save button (only used in editable mode).
   */
  saveButtonText?: string;

  /**
   * Custom title for the profile.
   */
  title?: string;
}

/**
 * BaseOrganizationProfile component displays organization information in a
 * structured and styled format. It shows organization details such as name,
 * description, status, and other available information with support for inline editing.
 *
 * This is the base component that can be used in any context where you have
 * an organization object available. It provides editing capabilities similar to
 * the UserProfile component, allowing users to modify organization fields directly.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BaseOrganizationProfile organization={organizationData} />
 *
 * // With editing enabled and update handler
 * <BaseOrganizationProfile
 *   organization={organizationData}
 *   editable={true}
 *   onUpdate={async (payload) => {
 *     await updateOrganizationAPI(orgId, payload);
 *   }}
 * />
 *
 * // With card layout and custom title
 * <BaseOrganizationProfile
 *   organization={organizationData}
 *   cardLayout={true}
 *   title="Organization Details"
 *   fallback={<div>No organization data available</div>}
 * />
 *
 * // With custom fields configuration
 * <BaseOrganizationProfile
 *   organization={organizationData}
 *   fields={[
 *     { key: 'id', label: 'Organization ID', editable: false },
 *     { key: 'name', label: 'Organization Name', editable: true },
 *     { key: 'description', label: 'Description', editable: true, render: (value) => value || 'No description' },
 *     { key: 'created', label: 'Created Date', editable: false, render: (value) => new Date(value).toLocaleDateString() },
 *     { key: 'attributes', label: 'Custom Attributes', editable: true }
 *   ]}
 *   onUpdate={handleUpdate}
 * />
 *
 * // In popup mode
 * <BaseOrganizationProfile
 *   organization={organizationData}
 *   mode="popup"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Edit Organization"
 * />
 * ```
 * <BaseOrganizationProfile
 *   organization={organizationData}
 *   fields={[
 *     { key: 'id', label: 'Organization ID' },
 *     { key: 'name', label: 'Organization Name' },
 *     { key: 'description', label: 'Description', render: (value) => value || 'No description' },
 *     { key: 'created', label: 'Created Date', render: (value) => new Date(value).toLocaleDateString() },
 *     { key: 'attributes', label: 'Custom Attributes' }
 *   ]}
 * />
 * ```
 */
const BaseOrganizationProfile: FC<BaseOrganizationProfileProps> = ({
  fallback = null,
  className = '',
  cardLayout = true,
  organization,
  title = 'Organization Profile',
  mode = 'inline',
  editable = true,
  onChange,
  onOpenChange,
  onSubmit,
  onUpdate,
  open = false,
  saveButtonText = 'Save Changes',
  cancelButtonText = 'Cancel',
  fields = [
    {
      key: 'id',
      label: 'Organization ID',
      editable: false,
    },
    {
      key: 'name',
      label: 'Organization Name',
      editable: true,
    },
    {
      key: 'description',
      label: 'Organization Description',
      editable: true,
      render: value => value || '-',
    },
    {
      key: 'created',
      label: 'Created Date',
      editable: false,
      render: value => formatDate(value),
    },
    {
      key: 'lastModified',
      label: 'Last Modified Date',
      editable: false,
      render: value => formatDate(value),
    },
  ],
}): ReactElement => {
  const {theme} = useTheme();
  const [editedOrganization, setEditedOrganization] = useState(organization);
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

  const getFieldPlaceholder = useCallback((fieldKey: string): string => {
    const fieldLabels: Record<string, string> = {
      name: 'organization name',
      description: 'organization description',
      orgHandle: 'organization handle',
      status: 'organization status',
      type: 'organization type',
    };

    const fieldLabel = fieldLabels[fieldKey] || fieldKey.toLowerCase();
    return `Enter ${fieldLabel}`;
  }, []);

  const handleFieldSave = useCallback(
    (fieldKey: string): void => {
      if (!onUpdate || !fieldKey) return;

      const fieldValue: any =
        editedOrganization && fieldKey && editedOrganization[fieldKey as keyof OrganizationDetails] !== undefined
          ? editedOrganization[fieldKey as keyof OrganizationDetails]
          : organization && organization[fieldKey as keyof OrganizationDetails] !== undefined
          ? organization[fieldKey as keyof OrganizationDetails]
          : '';

      const payload: Record<string, any> = {
        [fieldKey]: fieldValue,
      };

      onUpdate(payload);
      // Exit edit mode for this field after save
      toggleFieldEdit(fieldKey);
    },
    [editedOrganization, organization, onUpdate, toggleFieldEdit],
  );

  const handleFieldCancel = useCallback(
    (fieldKey: string) => {
      setEditedOrganization(prev => ({
        ...prev,
        [fieldKey]: organization?.[fieldKey as keyof OrganizationDetails],
      }));
      toggleFieldEdit(fieldKey);
    },
    [organization, toggleFieldEdit],
  );

  const formatLabel = (key: string): string =>
    key
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const getStatusColor = (status?: string): string => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return theme.vars.colors.success.main;
      case 'INACTIVE':
        return theme.vars.colors.warning.main;
      case 'SUSPENDED':
        return theme.vars.colors.error.main;
      default:
        return theme.vars.colors.text.secondary;
    }
  };

  const getOrgInitials = (name?: string): string => {
    if (!name) return 'ORG';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const styles = useStyles();

  // Renders individual field in view or edit mode
  const renderField = (
    field: any,
    isEditing: boolean,
    onEditValue?: (value: any) => void,
    onStartEdit?: () => void,
  ): ReactElement | null => {
    if (!field) return null;

    const {key, label, editable: fieldEditable = true} = field;
    const value =
      key === 'attributes' ? organization?.attributes || {} : organization?.[key as keyof OrganizationDetails];

    const renderedValue = field.render ? field.render(value, organization) : value;

    // If editing, show input field
    if (isEditing && onEditValue && fieldEditable && editable) {
      const fieldValue =
        editedOrganization && key && editedOrganization[key as keyof OrganizationDetails] !== undefined
          ? editedOrganization[key as keyof OrganizationDetails]
          : value || '';

      const commonProps = {
        label: undefined,
        value: typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : String(fieldValue || ''),
        onChange: (e: any) => onEditValue(e.target ? e.target.value : e),
        placeholder: getFieldPlaceholder(key),
        style: {
          marginBottom: 0,
        },
      };

      let fieldInput: ReactElement;

      if (key === 'attributes') {
        // For attributes, use KeyValueInput component
        const attributesValue = typeof fieldValue === 'object' && fieldValue !== null ? fieldValue : {};
        fieldInput = (
          <KeyValueInput
            value={attributesValue}
            onChange={pairs => {
              const attributesObject = pairs.reduce((acc, pair) => {
                acc[pair.key] = pair.value;
                return acc;
              }, {} as Record<string, any>);
              onEditValue(attributesObject);
            }}
            onAdd={pair => {
              if (onUpdate) {
                const operation = {
                  operation: 'ADD',
                  path: `/attributes/${pair.key}`,
                  value: pair.value,
                };
                onUpdate([operation]);
              }
            }}
            onRemove={(pair, index) => {
              if (onUpdate) {
                const operation = {
                  operation: 'REMOVE',
                  path: `/attributes/${pair.key}`,
                  value: '',
                };
                onUpdate([operation]);
              }
            }}
            label=""
            keyPlaceholder="Attribute name"
            valuePlaceholder="Attribute value"
            helperText="Add custom attributes as key-value pairs"
          />
        );
      } else {
        fieldInput = <TextField {...commonProps} />;
      }

      return (
        <>
          <span style={styles.label}>{label}</span>
          <div style={styles.value}>{fieldInput}</div>
        </>
      );
    }

    // Default: view mode
    const hasValue = value !== undefined && value !== null && value !== '';
    const isFieldEditable = editable && fieldEditable;

    let displayValue: string | ReactElement;
    if (hasValue) {
      displayValue =
        key === 'attributes' && typeof value === 'object' && value !== null ? (
          <KeyValueInput value={value} readOnly={true} label="" />
        ) : (
          String(renderedValue)
        );
    } else if (isFieldEditable) {
      displayValue = getFieldPlaceholder(key);
    } else {
      displayValue = '-';
    }

    return (
      <>
        <span style={styles.label}>{label}</span>
        <div
          style={{
            ...styles.value,
            fontStyle: hasValue ? 'normal' : 'italic',
            opacity: hasValue ? 1 : 0.7,
          }}
        >
          {!hasValue && isFieldEditable && onStartEdit ? (
            <Button
              onClick={onStartEdit}
              variant="text"
              color="secondary"
              size="small"
              title="Click to edit"
              style={{
                fontStyle: 'italic',
                textDecoration: 'underline',
                opacity: 0.7,
                padding: 0,
                minHeight: 'auto',
              }}
            >
              {displayValue}
            </Button>
          ) : (
            displayValue
          )}
        </div>
      </>
    );
  };

  const renderOrganizationField = (field: any) => {
    if (!field || !field.key) return null;

    const hasValue =
      organization?.[field.key as keyof OrganizationDetails] !== undefined &&
      organization?.[field.key as keyof OrganizationDetails] !== '' &&
      organization?.[field.key as keyof OrganizationDetails] !== null;
    const isFieldEditing = editingFields[field.key];
    const isFieldEditable = editable && field.editable !== false;

    // Show field if: has value, currently editing, or is editable
    const shouldShow = hasValue || isFieldEditing || isFieldEditable;

    if (!shouldShow) {
      return null;
    }

    const fieldStyle = {
      ...styles.field,
      display: 'flex',
      alignItems: 'center',
      gap: theme.vars.spacing.unit,
    };

    return (
      <div style={fieldStyle} key={field.key}>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: theme.vars.spacing.unit}}>
          {renderField(
            field,
            isFieldEditing,
            value => {
              const tempEditedOrganization = {...editedOrganization};
              tempEditedOrganization[field.key as keyof OrganizationDetails] = value;
              setEditedOrganization(tempEditedOrganization);
            },
            () => toggleFieldEdit(field.key),
          )}
        </div>
        {isFieldEditable && (
          <div style={{display: 'flex', alignItems: 'center', gap: `calc(${theme.vars.spacing.unit} / 2)`}}>
            {isFieldEditing ? (
              <>
                <Button 
                  onClick={() => handleFieldSave(field.key)} 
                  color="primary" 
                  variant="solid" 
                  size="small"
                  title="Save changes"
                >
                  {saveButtonText}
                </Button>
                <Button 
                  onClick={() => handleFieldCancel(field.key)} 
                  color="secondary" 
                  variant="outline" 
                  size="small"
                  title="Cancel editing"
                >
                  {cancelButtonText}
                </Button>
              </>
            ) : (
              // Only show pencil icon when there's a value
              hasValue && (
                <Button
                  onClick={() => toggleFieldEdit(field.key)}
                  variant="text"
                  color="secondary"
                  size="small"
                  title="Edit field"
                  style={{
                    minWidth: 'auto',
                    padding: `calc(${theme.vars.spacing.unit} / 2)`,
                    minHeight: 'auto',
                  }}
                >
                  <PencilIcon />
                </Button>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  if (!organization) {
    return fallback;
  }

  const containerStyle = {
    ...styles.root,
    ...(cardLayout ? styles.card : {}),
  };

  const profileContent = (
    <Card style={containerStyle} className={clsx(withVendorCSSClassPrefix('organization-profile'), className)}>
      <div style={styles.header}>
        <Avatar name={getOrgInitials(organization.name)} size={80} alt={`${organization.name} logo`} />
        <div style={styles.orgInfo}>
          <h2 style={styles.name}>{organization.name}</h2>
          {organization.orgHandle && <p style={styles.handle}>@{organization.orgHandle}</p>}
        </div>
      </div>

      <div style={styles.infoContainer}>{fields.map((field, index) => renderOrganizationField(field))}</div>
    </Card>
  );

  if (mode === 'popup') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeading>{title}</DialogHeading>
          <div style={{padding: `calc(${theme.vars.spacing.unit} * 2)`}}>{profileContent}</div>
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
        padding: `calc(${theme.vars.spacing.unit} * 4)`,
        minWidth: '600px',
        margin: '0 auto',
      } as CSSProperties,
      card: {
        background: theme.vars.colors.background.surface,
        borderRadius: theme.vars.borderRadius.large,
      } as CSSProperties,
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: `calc(${theme.vars.spacing.unit} * 2)`,
        marginBottom: `calc(${theme.vars.spacing.unit} * 3)`,
        paddingBottom: `calc(${theme.vars.spacing.unit} * 2)`,
      } as CSSProperties,
      orgInfo: {
        flex: 1,
      } as CSSProperties,
      name: {
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: '0 0 8px 0',
        color: theme.vars.colors.text.primary,
      } as CSSProperties,
      handle: {
        fontSize: '1rem',
        color: theme.vars.colors.text.secondary,
        margin: '0',
        fontFamily: 'monospace',
      } as CSSProperties,
      infoContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.vars.spacing.unit,
      } as CSSProperties,
      field: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: `calc(${theme.vars.spacing.unit} / 2) 0`,
        borderBottom: `1px solid ${theme.vars.colors.border}`,
        minHeight: '28px',
      } as CSSProperties,
      lastField: {
        borderBottom: 'none',
      } as CSSProperties,
      label: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: theme.vars.colors.text.secondary,
        width: '120px',
        flexShrink: 0,
        lineHeight: '28px',
      } as CSSProperties,
      value: {
        color: theme.vars.colors.text.primary,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: theme.vars.spacing.unit,
        overflow: 'hidden',
        minHeight: '28px',
        lineHeight: '28px',
        wordBreak: 'break-word' as const,
      } as CSSProperties,
      statusBadge: {
        padding: `calc(${theme.vars.spacing.unit} / 2) ${theme.vars.spacing.unit}`,
        borderRadius: theme.vars.borderRadius.small,
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'white',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
      } as CSSProperties,
      permissionsList: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: `calc(${theme.vars.spacing.unit} / 2)`,
      } as CSSProperties,
      permissionBadge: {
        padding: `calc(${theme.vars.spacing.unit} / 4) ${theme.vars.spacing.unit}`,
        borderRadius: theme.vars.borderRadius.small,
        fontSize: '0.75rem',
        backgroundColor: theme.vars.colors.primary.main,
        color: theme.vars.colors.primary.contrastText,
        border: `1px solid ${theme.vars.colors.border}`,
      } as CSSProperties,
      attributesList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `calc(${theme.vars.spacing.unit} / 4)`,
      } as CSSProperties,
      attributeItem: {
        display: 'flex',
        gap: theme.vars.spacing.unit,
        padding: `calc(${theme.vars.spacing.unit} / 4) 0`,
        alignItems: 'center',
      } as CSSProperties,
      attributeKey: {
        fontSize: '0.75rem',
        fontWeight: 500,
        color: theme.vars.colors.text.secondary,
        minWidth: '80px',
        flexShrink: 0,
      } as CSSProperties,
      attributeValue: {
        fontSize: '0.75rem',
        color: theme.vars.colors.text.primary,
        wordBreak: 'break-word' as const,
        flex: 1,
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

export default BaseOrganizationProfile;
