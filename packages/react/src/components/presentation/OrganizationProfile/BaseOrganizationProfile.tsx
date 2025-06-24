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
import {FC, ReactElement, useMemo, CSSProperties} from 'react';
import {OrganizationDetails} from '../../../api/scim2/getOrganization';
import useTheme from '../../../contexts/Theme/useTheme';
import {Avatar} from '../../primitives/Avatar/Avatar';
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
   * Whether to display the profile in a card layout.
   */
  cardLayout?: boolean;

  /**
   * CSS class name for styling the component.
   */
  className?: string;

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
    render?: (value: any, organization: OrganizationDetails) => React.ReactNode;
  }>;

  /**
   * The organization details to display.
   */
  organization?: OrganizationDetails | null;

  /**
   * Custom title for the profile.
   */
  title?: string;
}

/**
 * BaseOrganizationProfile component displays organization information in a
 * structured and styled format. It shows organization details such as name,
 * description, status, and other available information.
 *
 * This is the base component that can be used in any context where you have
 * an organization object available.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BaseOrganizationProfile organization={organizationData} />
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
  fields = [
    {
      key: 'id',
      label: 'Organization ID',
    },
    {
      key: 'name',
      label: 'Organization Name',
    },
    {
      key: 'description',
      label: 'Organization Description',
      render: value => value || '-',
    },
    {
      key: 'created',
      label: 'Created Date',
      render: value => formatDate(value),
    },
    {
      key: 'lastModified',
      label: 'Last Modified Date',
      render: value => formatDate(value),
    },
    {
      key: 'attributes',
      label: 'Organization Attributes',
    },
  ],
}): ReactElement => {
  const {theme} = useTheme();

  const formatLabel = (key: string): string =>
    key
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const getStatusColor = (status?: string): string => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return theme.colors.success.main;
      case 'INACTIVE':
        return theme.colors.warning.main;
      case 'SUSPENDED':
        return theme.colors.error.main;
      default:
        return theme.colors.text.secondary;
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

  if (!organization) {
    return fallback;
  }

  const containerStyle = {
    ...styles.root,
    ...(cardLayout ? styles.card : {}),
  };

  return (
    <Card style={containerStyle} className={clsx(withVendorCSSClassPrefix('organization-profile'), className)}>
      <div style={styles.header}>
        <Avatar name={getOrgInitials(organization.name)} size={80} alt={`${organization.name} logo`} />
        <div style={styles.orgInfo}>
          <h2 style={styles.name}>{organization.name}</h2>
          {organization.orgHandle && <p style={styles.handle}>@{organization.orgHandle}</p>}
        </div>
      </div>

      <div style={styles.infoContainer}>
        {fields.map((field, index) => {
          const value =
            field.key === 'attributes'
              ? organization.attributes || {}
              : organization[field.key as keyof OrganizationDetails];

          const renderedValue = field.render ? field.render(value, organization) : value;

          return (
            <div
              key={field.key}
              style={{
                ...styles.field,
                ...(index === fields.length - 1 ? styles.lastField : {}),
              }}
            >
              <span style={styles.label}>{field.label}:</span>
              <span style={styles.value}>
                {field.key === 'attributes' && typeof value === 'object' && value !== null ? (
                  <div style={styles.attributesList}>
                    {Object.entries(value).length > 0
                      ? Object.entries(value).map(([key, val]) => (
                          <div key={key} style={styles.attributeItem}>
                            <span style={styles.attributeKey}>{key}:</span>
                            <span style={styles.attributeValue}>{String(val)}</span>
                          </div>
                        ))
                      : '-'}
                  </div>
                ) : (
                  renderedValue || '-'
                )}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const useStyles = () => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      root: {
        padding: `${theme.spacing.unit * 4}px`,
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
        gap: `${theme.spacing.unit * 2}px`,
        marginBottom: `${theme.spacing.unit * 3}px`,
        paddingBottom: `${theme.spacing.unit * 2}px`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      orgInfo: {
        flex: 1,
      } as CSSProperties,
      name: {
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: '0 0 8px 0',
        color: theme.colors.text.primary,
      } as CSSProperties,
      handle: {
        fontSize: '1rem',
        color: theme.colors.text.secondary,
        margin: '0',
        fontFamily: 'monospace',
      } as CSSProperties,
      infoContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${theme.spacing.unit}px`,
      } as CSSProperties,
      field: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: `${theme.spacing.unit}px 0`,
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
        width: '140px',
        flexShrink: 0,
        lineHeight: '32px',
      } as CSSProperties,
      value: {
        color: theme.colors.text.primary,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: `${theme.spacing.unit}px`,
        overflow: 'hidden',
        minHeight: '32px',
        lineHeight: '32px',
        wordBreak: 'break-word' as const,
      } as CSSProperties,
      statusBadge: {
        padding: '4px 8px',
        borderRadius: theme.borderRadius.small,
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'white',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
      } as CSSProperties,
      permissionsList: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: `${theme.spacing.unit / 2}px`,
      } as CSSProperties,
      permissionBadge: {
        padding: '2px 8px',
        borderRadius: theme.borderRadius.small,
        fontSize: '0.75rem',
        backgroundColor: theme.colors.primary.main,
        color: theme.colors.primary.contrastText,
        border: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      attributesList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${theme.spacing.unit / 2}px`,
      } as CSSProperties,
      attributeItem: {
        display: 'flex',
        gap: `${theme.spacing.unit}px`,
        padding: `${theme.spacing.unit / 2}px 0`,
      } as CSSProperties,
      attributeKey: {
        fontSize: '0.75rem',
        fontWeight: 500,
        color: theme.colors.text.secondary,
        minWidth: '100px',
        flexShrink: 0,
      } as CSSProperties,
      attributeValue: {
        fontSize: '0.75rem',
        color: theme.colors.text.primary,
        wordBreak: 'break-word' as const,
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

export default BaseOrganizationProfile;
