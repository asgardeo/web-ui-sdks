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

import {withVendorCSSClassPrefix, CreateOrganizationPayload} from '@asgardeo/browser';
import clsx from 'clsx';
import {ChangeEvent, CSSProperties, FC, ReactElement, ReactNode, useMemo, useState} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import useTranslation from '../../../hooks/useTranslation';
import Alert from '../../primitives/Alert/Alert';
import Button from '../../primitives/Button/Button';
import {Dialog, DialogContent, DialogHeading} from '../../primitives/Popover/Popover';
import FormControl from '../../primitives/FormControl/FormControl';
import InputLabel from '../../primitives/InputLabel/InputLabel';
import TextField from '../../primitives/TextField/TextField';
import Typography from '../../primitives/Typography/Typography';

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
        padding: `calc(${theme.vars.spacing.unit} * 4)`,
      } as CSSProperties,
      content: {
        display: 'flex',
        flexDirection: 'column',
        gap: `calc(${theme.vars.spacing.unit} * 2)`,
      } as CSSProperties,
      form: {
        display: 'flex',
        flexDirection: 'column',
        gap: `calc(${theme.vars.spacing.unit} * 2)`,
        width: '100%',
      } as CSSProperties,
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: `calc(${theme.vars.spacing.unit} * 1.5)`,
        marginBottom: `calc(${theme.vars.spacing.unit} * 1.5)`,
      } as CSSProperties,
      field: {
        display: 'flex',
        alignItems: 'center',
        padding: `${theme.vars.spacing.unit} 0`,
        borderBottom: `1px solid ${theme.vars.colors.border}`,
        minHeight: '32px',
      } as CSSProperties,
      textarea: {
        width: '100%',
        padding: `${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 1.5)`,
        border: `1px solid ${theme.vars.colors.border}`,
        borderRadius: theme.vars.borderRadius.medium,
        fontSize: theme.vars.typography.fontSizes.md,
        color: theme.vars.colors.text.primary,
        backgroundColor: theme.vars.colors.background.surface,
        fontFamily: 'inherit',
        minHeight: '80px',
        resize: 'vertical',
        outline: 'none',
        '&:focus': {
          borderColor: theme.vars.colors.primary.main,
          boxShadow: `0 0 0 2px ${theme.vars.colors.primary.main}20`,
        },
        '&:disabled': {
          backgroundColor: theme.vars.colors.background.disabled,
          color: theme.vars.colors.text.secondary,
          cursor: 'not-allowed',
        },
      } as CSSProperties,
      avatarContainer: {
        alignItems: 'flex-start',
        display: 'flex',
        gap: `calc(${theme.vars.spacing.unit} * 2)`,
        marginBottom: theme.vars.spacing.unit,
      } as CSSProperties,
      actions: {
        display: 'flex',
        gap: theme.vars.spacing.unit,
        justifyContent: 'flex-end',
        paddingTop: `calc(${theme.vars.spacing.unit} * 2)`,
      } as CSSProperties,
      infoContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.vars.spacing.unit,
      } as CSSProperties,
      value: {
        color: theme.vars.colors.text.primary,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: theme.vars.spacing.unit,
        overflow: 'hidden',
        minHeight: '32px',
        lineHeight: '32px',
      } as CSSProperties,
      popup: {
        padding: `calc(${theme.vars.spacing.unit} * 2)`,
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

/**
 * Interface for organization form data.
 */
export interface OrganizationFormData {
  description: string;
  handle: string;
  name: string;
}

/**
 * Props interface for the BaseCreateOrganization component.
 */
export interface BaseCreateOrganizationProps {
  cardLayout?: boolean;
  className?: string;
  defaultParentId?: string;
  error?: string | null;
  initialValues?: Partial<OrganizationFormData>;
  loading?: boolean;
  mode?: 'inline' | 'popup';
  onCancel?: () => void;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (payload: CreateOrganizationPayload) => void | Promise<void>;
  onSuccess?: (organization: any) => void;
  open?: boolean;
  renderAdditionalFields?: () => ReactNode;
  style?: CSSProperties;
  title?: string;
}

/**
 * BaseCreateOrganization component provides the core functionality for creating organizations.
 * This component serves as the base for framework-specific implementations.
 */
export const BaseCreateOrganization: FC<BaseCreateOrganizationProps> = ({
  cardLayout = true,
  className = '',
  defaultParentId = '',
  error,
  initialValues = {},
  loading = false,
  mode = 'inline',
  onCancel,
  onOpenChange,
  onSubmit,
  onSuccess,
  open = false,
  renderAdditionalFields,
  style,
  title = 'Create Organization',
}): ReactElement => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [formData, setFormData] = useState<OrganizationFormData>({
    description: '',
    handle: '',
    name: '',
    ...initialValues,
  });
  const [formErrors, setFormErrors] = useState<Partial<OrganizationFormData> & {avatar?: string}>({});

  const validateForm = (): boolean => {
    const errors: Partial<OrganizationFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Organization name is required';
    }

    if (!formData.handle.trim()) {
      errors.handle = 'Organization handle is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.handle)) {
      errors.handle = 'Handle can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.description.trim()) {
      errors.description = 'Organization description is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof OrganizationFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleNameChange = (value: string): void => {
    handleInputChange('name', value);

    // Auto-generate handle from name if handle is empty or matches previous auto-generated value
    if (!formData.handle || formData.handle === generateHandleFromName(formData.name)) {
      const newHandle = generateHandleFromName(value);
      handleInputChange('handle', newHandle);
    }
  };

  const generateHandleFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm() || loading) {
      return;
    }

    const payload: CreateOrganizationPayload = {
      description: formData.description.trim(),
      orgHandle: formData.handle.trim(),
      name: formData.name.trim(),
      parentId: defaultParentId,
      type: 'TENANT',
    };

    try {
      await onSubmit?.(payload);
      if (onSuccess) {
        onSuccess(payload);
      }
    } catch (submitError) {
      // Error handling is done by parent component
      console.error('Form submission error:', submitError);
    }
  };

  const containerStyle = {
    ...styles.root,
    ...(cardLayout ? styles.card : {}),
  };

  const createOrganizationContent = (
    <div
      className={clsx(withVendorCSSClassPrefix('create-organization'), className)}
      style={{...containerStyle, ...style}}
    >
      <div className={withVendorCSSClassPrefix('create-organization__content')} style={styles.content}>
        <form
          id="create-organization-form"
          className={withVendorCSSClassPrefix('create-organization__form')}
          style={styles.form}
          onSubmit={handleSubmit}
        >
          {/* Error Alert */}
          {error && (
            <Alert variant="error" style={{marginBottom: `calc(${theme.vars.spacing.unit} * 2)`}}>
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}

          {/* Organization Name */}
          <div className={withVendorCSSClassPrefix('create-organization__field-group')}>
            <TextField
              label={`${t('organization.create.name.label')}`}
              placeholder={t('organization.create.name.placeholder')}
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChange(e.target.value)}
              disabled={loading}
              required
              error={formErrors.name}
              className={withVendorCSSClassPrefix('create-organization__input')}
            />
          </div>

          {/* Organization Handle */}
          <div className={withVendorCSSClassPrefix('create-organization__field-group')}>
            <TextField
              label={`${t('organization.create.handle.label') || 'Organization Handle'}`}
              placeholder={t('organization.create.handle.placeholder') || 'my-organization'}
              value={formData.handle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('handle', e.target.value)}
              disabled={loading}
              required
              error={formErrors.handle}
              helperText="This will be your organization's unique identifier. Only lowercase letters, numbers, and hyphens are allowed."
              className={withVendorCSSClassPrefix('create-organization__input')}
            />
          </div>

          {/* Organization Description */}
          <div className={withVendorCSSClassPrefix('create-organization__field-group')}>
            <FormControl error={formErrors.description}>
              <InputLabel required>{t('organization.create.description.label')}</InputLabel>
              <textarea
                className={withVendorCSSClassPrefix('create-organization__textarea')}
                style={{
                  ...styles.textarea,
                  borderColor: formErrors.description ? theme.vars.colors.error.main : theme.vars.colors.border,
                }}
                placeholder={t('organization.create.description.placeholder')}
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                disabled={loading}
                required
              />
            </FormControl>
          </div>

          {/* Additional Fields */}
          {renderAdditionalFields && renderAdditionalFields()}
        </form>

        {/* Actions */}
        <div className={withVendorCSSClassPrefix('create-organization__actions')} style={styles.actions}>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              {t('organization.create.cancel')}
            </Button>
          )}
          <Button type="submit" variant="solid" color="primary" disabled={loading} form="create-organization-form">
            {loading ? t('organization.create.creating') : t('organization.create.button')}
          </Button>
        </div>
      </div>
    </div>
  );

  if (mode === 'popup') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeading>{title}</DialogHeading>
          <div style={{padding: `calc(${theme.vars.spacing.unit} * 2)`}}>{createOrganizationContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return createOrganizationContent;
};

export default BaseCreateOrganization;
