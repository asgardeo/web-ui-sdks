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
import {FC, ReactElement, ReactNode, useMemo, CSSProperties} from 'react';
import {OrganizationWithSwitchAccess} from '../../../contexts/Organization/OrganizationContext';
import useTheme from '../../../contexts/Theme/useTheme';
import {Dialog, DialogContent, DialogHeading} from '../../primitives/Popover/Popover';
import {Avatar} from '../../primitives/Avatar/Avatar';

/**
 * Props interface for the BaseOrganizationList component.
 */
export interface BaseOrganizationListProps {
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string;
  /**
   * List of organizations with switch access information
   */
  data: OrganizationWithSwitchAccess[];
  /**
   * Error message to display
   */
  error?: string | null;
  /**
   * Function called when "Load More" is clicked
   */
  fetchMore?: () => Promise<void>;
  /**
   * Whether there are more organizations to load
   */
  hasMore?: boolean;
  /**
   * Whether the initial data is loading
   */
  isLoading?: boolean;
  /**
   * Whether more data is being loaded
   */
  isLoadingMore?: boolean;
  /**
   * Function called when refresh is requested
   */
  onRefresh?: () => Promise<void>;
  /**
   * Custom renderer for when no organizations are found
   */
  renderEmpty?: () => ReactNode;
  /**
   * Custom renderer for the error state
   */
  renderError?: (error: string) => ReactNode;
  /**
   * Custom renderer for the load more button
   */
  renderLoadMore?: (onLoadMore: () => Promise<void>, isLoading: boolean) => ReactNode;
  /**
   * Custom renderer for the loading state
   */
  renderLoading?: () => ReactNode;
  /**
   * Custom renderer for each organization item
   */
  renderOrganization?: (organization: OrganizationWithSwitchAccess, index: number) => ReactNode;
  /**
   * Inline styles to apply to the container
   */
  style?: React.CSSProperties;
  /**
   * Total number of organizations
   */
  totalCount?: number;
  /**
   * Display mode: 'inline' for normal display, 'popup' for modal dialog
   */
  mode?: 'inline' | 'popup';
  /**
   * Function called when popup open state changes (only used in popup mode)
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether the popup is open (only used in popup mode)
   */
  open?: boolean;
  /**
   * Title for the popup dialog (only used in popup mode)
   */
  title?: string;
}

/**
 * Default organization item renderer
 */
const defaultRenderOrganization = (organization: OrganizationWithSwitchAccess, styles: any): ReactNode => {
  const getOrgInitials = (name?: string): string => {
    if (!name) return 'ORG';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div key={organization.id} style={styles.organizationItem}>
      <div style={styles.organizationContent}>
        <Avatar name={getOrgInitials(organization.name)} size={48} alt={`${organization.name} logo`} />
        <div style={styles.organizationInfo}>
          <h3 style={styles.organizationName}>{organization.name}</h3>
          <p style={styles.organizationHandle}>@{organization.orgHandle}</p>
          <p style={styles.organizationStatus}>
            Status:{' '}
            <span
              style={{
                ...styles.statusText,
                color: organization.status === 'ACTIVE' ? styles.activeColor : styles.inactiveColor,
              }}
            >
              {organization.status}
            </span>
          </p>
        </div>
      </div>
      <div style={styles.organizationActions}>
        {organization.canSwitch ? (
          <span style={{...styles.badge, ...styles.successBadge}}>Can Switch</span>
        ) : (
          <span style={{...styles.badge, ...styles.errorBadge}}>No Access</span>
        )}
      </div>
    </div>
  );
};

/**
 * Default loading renderer
 */
const defaultRenderLoading = (styles: any): ReactNode => (
  <div style={styles.loadingContainer}>
    <div style={styles.loadingText}>Loading organizations...</div>
  </div>
);

/**
 * Default error renderer
 */
const defaultRenderError = (error: string, styles: any): ReactNode => (
  <div style={styles.errorContainer}>
    <strong>Error:</strong> {error}
  </div>
);

/**
 * Default load more button renderer
 */
const defaultRenderLoadMore = (onLoadMore: () => Promise<void>, isLoading: boolean, styles: any): ReactNode => (
  <button
    onClick={onLoadMore}
    disabled={isLoading}
    style={{
      ...styles.loadMoreButton,
      ...(isLoading ? styles.loadMoreButtonDisabled : {}),
    }}
    type="button"
  >
    {isLoading ? 'Loading...' : 'Load More Organizations'}
  </button>
);

/**
 * Default empty state renderer
 */
const defaultRenderEmpty = (styles: any): ReactNode => (
  <div style={styles.emptyContainer}>
    <div style={styles.emptyText}>No organizations found</div>
  </div>
);

/**
 * BaseOrganizationList component displays a list of organizations with pagination support.
 * This component serves as the base for framework-specific implementations.
 *
 * @example
 * ```tsx
 * <BaseOrganizationList
 *   data={organizations}
 *   isLoading={isLoading}
 *   hasMore={hasMore}
 *   fetchMore={fetchMore}
 *   error={error}
 * />
 * ```
 */
export const BaseOrganizationList: FC<BaseOrganizationListProps> = ({
  className = '',
  data,
  error,
  fetchMore,
  hasMore = false,
  isLoading = false,
  isLoadingMore = false,
  mode = 'inline',
  onOpenChange,
  onRefresh,
  open = false,
  renderEmpty,
  renderError,
  renderLoading,
  renderLoadMore,
  renderOrganization,
  style,
  title = 'Organizations',
  totalCount,
}): ReactElement => {
  const styles = useStyles();

  // Use custom renderers or defaults with styles
  const renderLoadingWithStyles = renderLoading || (() => defaultRenderLoading(styles));
  const renderErrorWithStyles = renderError || ((error: string) => defaultRenderError(error, styles));
  const renderEmptyWithStyles = renderEmpty || (() => defaultRenderEmpty(styles));
  const renderLoadMoreWithStyles =
    renderLoadMore ||
    ((onLoadMore: () => Promise<void>, isLoading: boolean) => defaultRenderLoadMore(onLoadMore, isLoading, styles));
  const renderOrganizationWithStyles =
    renderOrganization || ((org: OrganizationWithSwitchAccess) => defaultRenderOrganization(org, styles));

  // Show loading state
  if (isLoading && data.length === 0) {
    const loadingContent = (
      <div
        className={clsx(withVendorCSSClassPrefix('organization-list'), className)}
        style={{...styles.root, ...style}}
      >
        {renderLoadingWithStyles()}
      </div>
    );

    if (mode === 'popup') {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeading>{title}</DialogHeading>
            <div style={styles.popupContent}>{loadingContent}</div>
          </DialogContent>
        </Dialog>
      );
    }

    return loadingContent;
  }

  // Show error state
  if (error && data.length === 0) {
    const errorContent = (
      <div
        className={clsx(withVendorCSSClassPrefix('organization-list'), className)}
        style={{...styles.root, ...style}}
      >
        {renderErrorWithStyles(error)}
      </div>
    );

    if (mode === 'popup') {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeading>{title}</DialogHeading>
            <div style={styles.popupContent}>{errorContent}</div>
          </DialogContent>
        </Dialog>
      );
    }

    return errorContent;
  }

  // Show empty state
  if (!isLoading && data.length === 0) {
    const emptyContent = (
      <div
        className={clsx(withVendorCSSClassPrefix('organization-list'), className)}
        style={{...styles.root, ...style}}
      >
        {renderEmptyWithStyles()}
      </div>
    );

    if (mode === 'popup') {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeading>{title}</DialogHeading>
            <div style={styles.popupContent}>{emptyContent}</div>
          </DialogContent>
        </Dialog>
      );
    }

    return emptyContent;
  }

  const organizationListContent = (
    <div className={clsx(withVendorCSSClassPrefix('organization-list'), className)} style={{...styles.root, ...style}}>
      {/* Header with total count and refresh button */}
      <div style={styles.header}>
        <div style={styles.headerInfo}>
          <h2 style={styles.title}>Organizations</h2>
          {totalCount !== undefined && (
            <p style={styles.subtitle}>
              Showing {data.length} of {totalCount} organizations
            </p>
          )}
        </div>
        {onRefresh && (
          <button onClick={onRefresh} style={styles.refreshButton} type="button">
            Refresh
          </button>
        )}
      </div>

      {/* Organizations list */}
      <div style={styles.listContainer}>
        {data.map((organization: OrganizationWithSwitchAccess, index: number) =>
          renderOrganizationWithStyles(organization, index),
        )}
      </div>

      {/* Error message for additional data */}
      {error && data.length > 0 && <div style={styles.errorMargin}>{renderErrorWithStyles(error)}</div>}

      {/* Load more button */}
      {hasMore && fetchMore && (
        <div style={styles.loadMoreMargin}>{renderLoadMoreWithStyles(fetchMore, isLoadingMore)}</div>
      )}
    </div>
  );

  if (mode === 'popup') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeading>{title}</DialogHeading>
          <div style={styles.popupContent}>{organizationListContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return organizationListContent;
};

const useStyles = () => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      root: {
        padding: `${theme.spacing.unit * 4}px`,
        minWidth: '600px',
        margin: '0 auto',
        background: theme.colors.background.surface,
        borderRadius: theme.borderRadius.large,
        boxShadow: theme.shadows.small,
      } as CSSProperties,
      header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: `${theme.spacing.unit * 3}px`,
        paddingBottom: `${theme.spacing.unit * 2}px`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      headerInfo: {
        flex: 1,
      } as CSSProperties,
      title: {
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: '0 0 8px 0',
        color: theme.colors.text.primary,
      } as CSSProperties,
      subtitle: {
        color: theme.colors.text.secondary,
        fontSize: '0.875rem',
        margin: '0',
      } as CSSProperties,
      refreshButton: {
        backgroundColor: theme.colors.background.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.small,
        color: theme.colors.text.primary,
        cursor: 'pointer',
        fontSize: '0.875rem',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        transition: 'all 0.2s',
      } as CSSProperties,
      listContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${theme.spacing.unit * 1.5}px`,
      } as CSSProperties,
      organizationItem: {
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.medium,
        display: 'flex',
        justifyContent: 'space-between',
        padding: `${theme.spacing.unit * 2}px`,
        transition: 'all 0.2s',
        cursor: 'pointer',
        backgroundColor: theme.colors.background.surface,
      } as CSSProperties,
      organizationContent: {
        display: 'flex',
        alignItems: 'center',
        gap: `${theme.spacing.unit * 2}px`,
        flex: 1,
      } as CSSProperties,
      organizationInfo: {
        flex: 1,
      } as CSSProperties,
      organizationName: {
        fontSize: '1.125rem',
        fontWeight: 600,
        margin: '0 0 4px 0',
        color: theme.colors.text.primary,
      } as CSSProperties,
      organizationHandle: {
        color: theme.colors.text.secondary,
        fontSize: '0.875rem',
        margin: '0 0 4px 0',
        fontFamily: 'monospace',
      } as CSSProperties,
      organizationStatus: {
        color: theme.colors.text.secondary,
        fontSize: '0.875rem',
        margin: '0',
      } as CSSProperties,
      statusText: {
        fontWeight: 500,
      } as CSSProperties,
      activeColor: theme.colors.success.main,
      inactiveColor: theme.colors.error.main,
      organizationActions: {
        display: 'flex',
        alignItems: 'center',
      } as CSSProperties,
      badge: {
        borderRadius: theme.borderRadius.large,
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '4px 12px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
      } as CSSProperties,
      successBadge: {
        backgroundColor: `${theme.colors.success.main}20`,
        color: theme.colors.success.main,
      } as CSSProperties,
      errorBadge: {
        backgroundColor: `${theme.colors.error.main}20`,
        color: theme.colors.error.main,
      } as CSSProperties,
      loadingContainer: {
        padding: `${theme.spacing.unit * 4}px`,
        textAlign: 'center' as const,
      } as CSSProperties,
      loadingText: {
        color: theme.colors.text.secondary,
        fontSize: '1rem',
      } as CSSProperties,
      errorContainer: {
        backgroundColor: `${theme.colors.error.main}20`,
        border: `1px solid ${theme.colors.error.main}`,
        borderRadius: theme.borderRadius.medium,
        color: theme.colors.error.main,
        padding: `${theme.spacing.unit * 2}px`,
      } as CSSProperties,
      emptyContainer: {
        padding: `${theme.spacing.unit * 4}px`,
        textAlign: 'center' as const,
      } as CSSProperties,
      emptyText: {
        color: theme.colors.text.secondary,
        fontSize: '1rem',
      } as CSSProperties,
      loadMoreButton: {
        backgroundColor: theme.colors.primary.main,
        border: 'none',
        borderRadius: theme.borderRadius.medium,
        color: theme.colors.primary.contrastText,
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 500,
        padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 3}px`,
        width: '100%',
        transition: 'all 0.2s',
      } as CSSProperties,
      loadMoreButtonDisabled: {
        backgroundColor: theme.colors.text.secondary,
        cursor: 'not-allowed',
        opacity: 0.6,
      } as CSSProperties,
      errorMargin: {
        marginTop: `${theme.spacing.unit * 2}px`,
      } as CSSProperties,
      loadMoreMargin: {
        marginTop: `${theme.spacing.unit * 3}px`,
      } as CSSProperties,
      popupContent: {
        padding: `${theme.spacing.unit}px`,
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

export default BaseOrganizationList;
