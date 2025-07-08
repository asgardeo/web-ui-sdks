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

import {withVendorCSSClassPrefix, CreateOrganizationPayload, bem} from '@asgardeo/browser';
import {cx} from '@emotion/css';
import {ChangeEvent, CSSProperties, FC, ReactElement, ReactNode, useState} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import useTranslation from '../../../hooks/useTranslation';
import Alert from '../../primitives/Alert/Alert';
import Button from '../../primitives/Button/Button';
import {Dialog, DialogContent, DialogHeading} from '../../primitives/Popover/Popover';
import FormControl from '../../primitives/FormControl/FormControl';
import InputLabel from '../../primitives/InputLabel/InputLabel';
import TextField from '../../primitives/TextField/TextField';
import Typography from '../../primitives/Typography/Typography';
import {useStyles} from './BaseCreateOrganization.styles';

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
  const {theme, colorScheme} = useTheme();
  const styles = useStyles(theme, colorScheme);
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

  /**
   * Handles changes to the organization name input.
   * Automatically generates the organization handle based on the name if the handle is not set or matches
   *
   * @param value - The new value for the organization name.
   */
  const handleNameChange = (value: string): void => {
    handleInputChange('name', value);

    if (!formData.handle || formData.handle === generateHandleFromName(formData.name)) {
      const newHandle = generateHandleFromName(value);
      handleInputChange('handle', newHandle);
    }
  };

  /**
   * Removes special characters except space and hyphen from the organization name
   * and generates a valid handle.
   * @param name
   * @returns
   */
  const generateHandleFromName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
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

  const createOrganizationContent = (
    <div
      className={cx(
        withVendorCSSClassPrefix(bem('create-organization')),
        styles.createOrganization,
        cardLayout && withVendorCSSClassPrefix(bem('create-organization', null, 'card')),
        cardLayout && styles['createOrganization--card'],
        className,
      )}
      style={style}
    >
      <div
        className={cx(
          withVendorCSSClassPrefix(bem('create-organization', 'content')),
          styles.createOrganization__content,
        )}
      >
        <form
          id="create-organization-form"
          className={cx(withVendorCSSClassPrefix(bem('create-organization', 'form')), styles.createOrganization__form)}
          onSubmit={handleSubmit}
        >
          {error && (
            <Alert variant="error" className={styles.createOrganization__errorAlert}>
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}
          <div
            className={cx(
              withVendorCSSClassPrefix(bem('create-organization', 'field-group')),
              styles.createOrganization__fieldGroup,
            )}
          >
            <TextField
              label={`${t('organization.create.name.label')}`}
              placeholder={t('organization.create.name.placeholder')}
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChange(e.target.value)}
              disabled={loading}
              required
              error={formErrors.name}
              className={cx(
                withVendorCSSClassPrefix(bem('create-organization', 'input')),
                styles.createOrganization__input,
              )}
            />
          </div>
          <div
            className={cx(
              withVendorCSSClassPrefix(bem('create-organization', 'field-group')),
              styles.createOrganization__fieldGroup,
            )}
          >
            <TextField
              label={`${t('organization.create.handle.label') || 'Organization Handle'}`}
              placeholder={t('organization.create.handle.placeholder') || 'my-organization'}
              value={formData.handle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('handle', e.target.value)}
              disabled={loading}
              required
              error={formErrors.handle}
              helperText="This will be your organization's unique identifier. Only lowercase letters, numbers, and hyphens are allowed."
              className={cx(
                withVendorCSSClassPrefix(bem('create-organization', 'input')),
                styles.createOrganization__input,
              )}
            />
          </div>
          <div
            className={cx(
              withVendorCSSClassPrefix(bem('create-organization', 'field-group')),
              styles.createOrganization__fieldGroup,
            )}
          >
            <FormControl error={formErrors.description}>
              <InputLabel required>{t('organization.create.description.label')}</InputLabel>
              <textarea
                className={cx(
                  withVendorCSSClassPrefix(bem('create-organization', 'textarea')),
                  styles.createOrganization__textarea,
                  formErrors.description && withVendorCSSClassPrefix(bem('create-organization', 'textarea', 'error')),
                  formErrors.description && styles['createOrganization__textarea--error'],
                )}
                placeholder={t('organization.create.description.placeholder')}
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                disabled={loading}
                required
              />
            </FormControl>
          </div>
          {renderAdditionalFields && renderAdditionalFields()}
        </form>
        <div
          className={cx(
            withVendorCSSClassPrefix(bem('create-organization', 'actions')),
            styles.createOrganization__actions,
          )}
        >
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
          <div className={styles.createOrganization__popup}>{createOrganizationContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return createOrganizationContent;
};

export default BaseCreateOrganization;
