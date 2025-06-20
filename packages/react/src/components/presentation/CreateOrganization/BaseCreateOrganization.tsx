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
import {ChangeEvent, CSSProperties, FC, ReactElement, ReactNode, useMemo, useState} from 'react';

import {CreateOrganizationPayload} from '../../../api/scim2/createOrganization';
import useTheme from '../../../contexts/Theme/useTheme';
import useTranslation from '../../../hooks/useTranslation';
import {Avatar} from '../../primitives/Avatar/Avatar';
import Button from '../../primitives/Button/Button';
import Typography from '../../primitives/Typography/Typography';

const useStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    () => ({
      container: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing.unit * 3}px`,
        maxWidth: '600px',
        padding: `${theme.spacing.unit * 3}px`,
      } as CSSProperties,
      form: {
        backgroundColor: theme.colors.background.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.medium,
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing.unit * 2}px`,
        padding: `${theme.spacing.unit * 3}px`,
      } as CSSProperties,
      header: {
        alignItems: 'center',
        display: 'flex',
        gap: `${theme.spacing.unit}px`,
        marginBottom: `${theme.spacing.unit * 2}px`,
      } as CSSProperties,
      fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing.unit / 2}px`,
      } as CSSProperties,
      label: {
        color: theme.colors.text.primary,
        fontSize: '0.875rem',
        fontWeight: 500,
      } as CSSProperties,
      input: {
        backgroundColor: theme.colors.background.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.small,
        color: theme.colors.text.primary,
        fontSize: '0.875rem',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
        width: '100%',
      } as CSSProperties,
      textarea: {
        backgroundColor: theme.colors.background.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.small,
        color: theme.colors.text.primary,
        fontFamily: 'inherit',
        fontSize: '0.875rem',
        minHeight: '80px',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
        resize: 'vertical',
        width: '100%',
      } as CSSProperties,
      error: {
        color: theme.colors.error.main,
        fontSize: '0.75rem',
        marginTop: `${theme.spacing.unit / 2}px`,
      } as CSSProperties,
      avatarContainer: {
        alignItems: 'center',
        display: 'flex',
        gap: `${theme.spacing.unit}px`,
      } as CSSProperties,
      actions: {
        borderTop: `1px solid ${theme.colors.border}`,
        display: 'flex',
        gap: `${theme.spacing.unit}px`,
        justifyContent: 'flex-end',
        paddingTop: `${theme.spacing.unit * 2}px`,
      } as CSSProperties,
    }),
    [theme],
  );
};

/**
 * Interface for organization form data.
 */
export interface OrganizationFormData {
  description: string;
  name: string;
  type: 'TENANT' | 'STRUCTURAL';
}

/**
 * Props interface for the BaseCreateOrganization component.
 */
export interface BaseCreateOrganizationProps {
  className?: string;
  defaultParentId?: string;
  error?: string | null;
  initialValues?: Partial<OrganizationFormData>;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit?: (payload: CreateOrganizationPayload) => void | Promise<void>;
  onSuccess?: (organization: any) => void;
  renderAdditionalFields?: () => ReactNode;
  renderAvatar?: (url?: string) => ReactNode;
  renderHeader?: () => ReactNode;
  style?: CSSProperties;
}

/**
 * BaseCreateOrganization component provides the core functionality for creating organizations.
 * This component serves as the base for framework-specific implementations.
 */
export const BaseCreateOrganization: FC<BaseCreateOrganizationProps> = ({
  className = '',
  defaultParentId = '',
  error,
  initialValues = {},
  loading = false,
  onCancel,
  onSubmit,
  onSuccess,
  renderAdditionalFields,
  renderAvatar,
  renderHeader,
  style,
}): ReactElement => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [formData, setFormData] = useState<OrganizationFormData>({
    description: '',
    name: '',
    type: 'TENANT',
    ...initialValues,
  });
  const [formErrors, setFormErrors] = useState<Partial<OrganizationFormData>>({});

  const validateForm = (): boolean => {
    const errors: Partial<OrganizationFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Organization name is required';
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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm() || loading) {
      return;
    }

    const payload: CreateOrganizationPayload = {
      description: formData.description.trim(),
      name: formData.name.trim(),
      parentId: defaultParentId,
      type: formData.type,
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

  const defaultRenderHeader = (): ReactElement => (
    <div className={withVendorCSSClassPrefix('create-organization__header')} style={styles.header}>
      <Typography variant="h6" component="h2">
        {t('organization.create.title')}
      </Typography>
    </div>
  );

  const defaultRenderAvatar = (url?: string): ReactElement => (
    <div className={withVendorCSSClassPrefix('create-organization__avatar-container')} style={styles.avatarContainer}>
      <Avatar name={formData.name || 'Organization'} size={64} />
      <Button
        variant="text"
        size="small"
        onClick={() => {
          // Avatar upload functionality can be implemented here
          console.log('Avatar upload clicked');
        }}
      >
        {t('organization.create.upload.logo')}
      </Button>
    </div>
  );

  return (
    <div
      className={clsx(withVendorCSSClassPrefix('create-organization'), className)}
      style={{...styles.container, ...style}}
    >
      {renderHeader ? renderHeader() : defaultRenderHeader()}

      <form
        className={withVendorCSSClassPrefix('create-organization__form')}
        style={styles.form}
        onSubmit={handleSubmit}
      >
        {/* Avatar Section */}
        {renderAvatar ? renderAvatar(avatarUrl) : defaultRenderAvatar(avatarUrl)}

        {/* Organization Name */}
        <div className={withVendorCSSClassPrefix('create-organization__field-group')} style={styles.fieldGroup}>
          <label className={withVendorCSSClassPrefix('create-organization__label')} style={styles.label}>
            {t('organization.create.name.label')} *
          </label>
          <input
            type="text"
            className={withVendorCSSClassPrefix('create-organization__input')}
            style={styles.input}
            placeholder={t('organization.create.name.placeholder')}
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
            disabled={loading}
            required
          />
          {formErrors.name && (
            <div className={withVendorCSSClassPrefix('create-organization__error')} style={styles.error}>
              {formErrors.name}
            </div>
          )}
        </div>

        {/* Organization Description */}
        <div className={withVendorCSSClassPrefix('create-organization__field-group')} style={styles.fieldGroup}>
          <label className={withVendorCSSClassPrefix('create-organization__label')} style={styles.label}>
            {t('organization.create.description.label')} *
          </label>
          <textarea
            className={withVendorCSSClassPrefix('create-organization__textarea')}
            style={styles.textarea}
            placeholder={t('organization.create.description.placeholder')}
            value={formData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
            disabled={loading}
            required
          />
          {formErrors.description && (
            <div className={withVendorCSSClassPrefix('create-organization__error')} style={styles.error}>
              {formErrors.description}
            </div>
          )}
        </div>

        {/* Organization Type */}
        <div className={withVendorCSSClassPrefix('create-organization__field-group')} style={styles.fieldGroup}>
          <label className={withVendorCSSClassPrefix('create-organization__label')} style={styles.label}>
            {t('organization.create.type.label')}
          </label>
          <select
            className={withVendorCSSClassPrefix('create-organization__input')}
            style={styles.input}
            value={formData.type}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleInputChange('type', e.target.value as 'TENANT' | 'STRUCTURAL')
            }
            disabled={loading}
          >
            <option value="TENANT">{t('organization.create.type.tenant')}</option>
            <option value="STRUCTURAL">{t('organization.create.type.structural')}</option>
          </select>
        </div>

        {/* Additional Fields */}
        {renderAdditionalFields && renderAdditionalFields()}

        {/* Error Message */}
        {error && (
          <div className={withVendorCSSClassPrefix('create-organization__error')} style={styles.error}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className={withVendorCSSClassPrefix('create-organization__actions')} style={styles.actions}>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              {t('organization.create.cancel')}
            </Button>
          )}
          <Button type="submit" variant="solid" color="primary" disabled={loading}>
            {loading ? t('organization.create.creating') : t('organization.create.button')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BaseCreateOrganization;
