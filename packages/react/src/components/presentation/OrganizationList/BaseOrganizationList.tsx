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

import {AllOrganizationsApiResponse, Organization, withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';
import {FC, ReactElement, ReactNode, useMemo, CSSProperties} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import useTranslation from '../../../hooks/useTranslation';
import {Dialog, DialogContent, DialogHeading} from '../../primitives/Popover/Popover';
import Avatar from '../../primitives/Avatar/Avatar';
import Button from '../../primitives/Button/Button';
import Typography from '../../primitives/Typography/Typography';
import Spinner from '../../primitives/Spinner/Spinner';

export interface OrganizationWithSwitchAccess extends Organization {
  canSwitch: boolean;
}

/**
 * Props interface for the BaseOrganizationList component.
 */
export interface BaseOrganizationListProps {
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string;
  /**
   * List of organizations discoverable to the signed-in user.
   */
  allOrganizations: AllOrganizationsApiResponse;
  /**
   * List of organizations associated to the signed-in user.
   */
  myOrganizations: Organization[];
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
   * Function called when an organization is selected/clicked
   */
  onOrganizationSelect?: (organization: OrganizationWithSwitchAccess) => void;
  /**
   * Inline styles to apply to the container
   */
  style?: React.CSSProperties;
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
  /**
   * Whether to show the organization status in the list
   */
  showStatus?: boolean;
}

/**
 * Default organization item renderer
 */
const defaultRenderOrganization = (
  organization: OrganizationWithSwitchAccess,
  styles: any,
  t: (key: string, params?: Record<string, string | number>) => string,
  onOrganizationSelect?: (organization: OrganizationWithSwitchAccess) => void,
  showStatus?: boolean,
): ReactNode => {
  return (
    <div
      key={organization.id}
      style={{
        ...styles.organizationItem,
      }}
    >
      <div style={styles.organizationContent}>
        <Avatar variant="square" name={organization.name} size={48} alt={`${organization.name} logo`} />
        <div style={styles.organizationInfo}>
          <Typography variant="h6" style={styles.organizationName}>
            {organization.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" style={styles.organizationHandle}>
            @{organization.orgHandle}
          </Typography>
          {showStatus && (
            <Typography variant="body2" color="textSecondary" style={styles.organizationStatus}>
              {t('organization.switcher.status.label')}{' '}
              <span
                style={{
                  ...styles.statusText,
                  color: organization.status === 'ACTIVE' ? styles.activeColor : styles.inactiveColor,
                }}
              >
                {organization.status}
              </span>
            </Typography>
          )}
        </div>
      </div>
      {organization.canSwitch && (
        <div style={styles.organizationActions}>
          <Button
            onClick={e => {
              e.stopPropagation();
              onOrganizationSelect(organization);
            }}
            type="button"
            size="small"
          >
            {t('organization.switcher.switch.button')}
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Default loading renderer
 */
const defaultRenderLoading = (
  t: (key: string, params?: Record<string, string | number>) => string,
  styles: any,
): ReactNode => (
  <div style={styles.loadingContainer}>
    <Spinner size="medium" />
    <Typography variant="body1" color="textSecondary" style={styles.loadingText}>
      {t('organization.switcher.loading.organizations')}
    </Typography>
  </div>
);

/**
 * Default error renderer
 */
const defaultRenderError = (
  error: string,
  t: (key: string, params?: Record<string, string | number>) => string,
  styles: any,
): ReactNode => (
  <div style={styles.errorContainer}>
    <Typography variant="body1" color="error">
      <strong>{t('organization.switcher.error.prefix')}</strong> {error}
    </Typography>
  </div>
);

/**
 * Default load more button renderer
 */
const defaultRenderLoadMore = (
  onLoadMore: () => Promise<void>,
  isLoading: boolean,
  t: (key: string, params?: Record<string, string | number>) => string,
  styles: any,
): ReactNode => (
  <Button
    onClick={onLoadMore}
    disabled={isLoading}
    style={{
      ...styles.loadMoreButton,
      ...(isLoading ? styles.loadMoreButtonDisabled : {}),
    }}
    type="button"
    fullWidth
  >
    {isLoading ? t('organization.switcher.loading.more') : t('organization.switcher.load.more')}
  </Button>
);

/**
 * Default empty state renderer
 */
const defaultRenderEmpty = (
  t: (key: string, params?: Record<string, string | number>) => string,
  styles: any,
): ReactNode => (
  <div style={styles.emptyContainer}>
    <Typography variant="body1" color="textSecondary" style={styles.emptyText}>
      {t('organization.switcher.no.organizations')}
    </Typography>
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
  allOrganizations,
  myOrganizations,
  error,
  fetchMore,
  hasMore = false,
  isLoading = false,
  isLoadingMore = false,
  mode = 'inline',
  onOpenChange,
  onOrganizationSelect,
  onRefresh,
  open = false,
  renderEmpty,
  renderError,
  renderLoading,
  renderLoadMore,
  renderOrganization,
  style,
  title = 'Organizations',
  showStatus,
}): ReactElement => {
  const styles = useStyles();
  const {t} = useTranslation();

  // Combine allOrganizations with myOrganizations to determine which orgs can be switched to
  const organizationsWithSwitchAccess: OrganizationWithSwitchAccess[] = useMemo(() => {
    if (!allOrganizations?.organizations) {
      return [];
    }

    // Create a Set of IDs from myOrganizations for faster lookup
    const myOrgIds = new Set(myOrganizations?.map(org => org.id) || []);

    return allOrganizations.organizations.map(org => ({
      ...org,
      canSwitch: myOrgIds.has(org.id),
    }));
  }, [allOrganizations?.organizations, myOrganizations]);

  // Use custom renderers or defaults with styles and translations
  const renderLoadingWithStyles = renderLoading || (() => defaultRenderLoading(t, styles));
  const renderErrorWithStyles = renderError || ((error: string) => defaultRenderError(error, t, styles));
  const renderEmptyWithStyles = renderEmpty || (() => defaultRenderEmpty(t, styles));
  const renderLoadMoreWithStyles =
    renderLoadMore ||
    ((onLoadMore: () => Promise<void>, isLoading: boolean) => defaultRenderLoadMore(onLoadMore, isLoading, t, styles));
  const renderOrganizationWithStyles =
    renderOrganization ||
    ((org: OrganizationWithSwitchAccess) =>
      defaultRenderOrganization(org, styles, t, onOrganizationSelect, showStatus));

  // Show loading state
  if (isLoading && organizationsWithSwitchAccess?.length === 0) {
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
  if (error && organizationsWithSwitchAccess?.length === 0) {
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
  if (!isLoading && organizationsWithSwitchAccess?.length === 0) {
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
          <Typography variant="body2" color="textSecondary" style={styles.subtitle}>
            {t('organization.switcher.showing.count', {
              showing: organizationsWithSwitchAccess?.length,
              total: allOrganizations?.organizations?.length || 0,
            })}
          </Typography>
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} style={styles.refreshButton} type="button" variant="outline" size="small">
            {t('organization.switcher.refresh.button')}
          </Button>
        )}
      </div>

      {/* Organizations list */}
      <div style={styles.listContainer}>
        {organizationsWithSwitchAccess?.map((organization: OrganizationWithSwitchAccess, index: number) =>
          renderOrganizationWithStyles(organization, index),
        )}
      </div>

      {/* Error message for additional data */}
      {error && organizationsWithSwitchAccess?.length > 0 && (
        <div style={styles.errorMargin}>{renderErrorWithStyles(error)}</div>
      )}

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
        padding: `calc(${theme.vars.spacing.unit} * 4)`,
        minWidth: '600px',
        margin: '0 auto',
        background: theme.vars.colors.background.surface,
        borderRadius: theme.vars.borderRadius.large,
      } as CSSProperties,
      header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: `calc(${theme.vars.spacing.unit} * 3)`,
        paddingBottom: `calc(${theme.vars.spacing.unit} * 2)`,
        borderBottom: `1px solid ${theme.vars.colors.border}`,
      } as CSSProperties,
      headerInfo: {
        flex: 1,
      } as CSSProperties,
      title: {
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: '0 0 8px 0',
        color: theme.vars.colors.text.primary,
      } as CSSProperties,
      subtitle: {
        color: theme.vars.colors.text.secondary,
        fontSize: '0.875rem',
        margin: '0',
      } as CSSProperties,
      refreshButton: {
        backgroundColor: theme.vars.colors.background.surface,
        border: `1px solid ${theme.vars.colors.border}`,
        borderRadius: theme.vars.borderRadius.small,
        color: theme.vars.colors.text.primary,
        cursor: 'pointer',
        fontSize: '0.875rem',
        padding: `${theme.vars.spacing.unit} calc(${theme.vars.spacing.unit} * 2)`,
        transition: 'all 0.2s',
      } as CSSProperties,
      listContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `calc(${theme.vars.spacing.unit} * 1.5)`,
      } as CSSProperties,
      organizationItem: {
        border: `1px solid ${theme.vars.colors.border}`,
        borderRadius: theme.vars.borderRadius.medium,
        display: 'flex',
        justifyContent: 'space-between',
        padding: `calc(${theme.vars.spacing.unit} * 2)`,
        transition: 'all 0.2s',
        backgroundColor: theme.vars.colors.background.surface,
      } as CSSProperties,
      organizationContent: {
        display: 'flex',
        alignItems: 'center',
        gap: `calc(${theme.vars.spacing.unit} * 2)`,
        flex: 1,
      } as CSSProperties,
      organizationInfo: {
        flex: 1,
      } as CSSProperties,
      organizationName: {
        fontSize: '1.125rem',
        fontWeight: 600,
        margin: '0 0 4px 0',
        color: theme.vars.colors.text.primary,
      } as CSSProperties,
      organizationHandle: {
        color: theme.vars.colors.text.secondary,
        fontSize: '0.875rem',
        margin: '0 0 4px 0',
        fontFamily: 'monospace',
      } as CSSProperties,
      organizationStatus: {
        color: theme.vars.colors.text.secondary,
        fontSize: '0.875rem',
        margin: '0',
      } as CSSProperties,
      statusText: {
        fontWeight: 500,
      } as CSSProperties,
      activeColor: theme.vars.colors.success.main,
      inactiveColor: theme.vars.colors.error.main,
      organizationActions: {
        display: 'flex',
        alignItems: 'center',
      } as CSSProperties,
      badge: {
        borderRadius: theme.vars.borderRadius.large,
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: `calc(${theme.vars.spacing.unit} / 2) calc(${theme.vars.spacing.unit} * 1.5)`,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
      } as CSSProperties,
      successBadge: {
        backgroundColor: `color-mix(in srgb, ${theme.vars.colors.success.main} 20%, transparent)`,
        color: theme.vars.colors.success.main,
      } as CSSProperties,
      errorBadge: {
        backgroundColor: `color-mix(in srgb, ${theme.vars.colors.error.main} 20%, transparent)`,
        color: theme.vars.colors.error.main,
      } as CSSProperties,
      loadingContainer: {
        padding: `calc(${theme.vars.spacing.unit} * 4)`,
        textAlign: 'center' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: `calc(${theme.vars.spacing.unit} * 2)`,
      } as CSSProperties,
      loadingText: {
        marginTop: theme.vars.spacing.unit,
      } as CSSProperties,
      errorContainer: {
        backgroundColor: `color-mix(in srgb, ${theme.vars.colors.error.main} 20%, transparent)`,
        border: `1px solid ${theme.vars.colors.error.main}`,
        borderRadius: theme.vars.borderRadius.medium,
        color: theme.vars.colors.error.main,
        padding: `calc(${theme.vars.spacing.unit} * 2)`,
      } as CSSProperties,
      emptyContainer: {
        padding: `calc(${theme.vars.spacing.unit} * 4)`,
        textAlign: 'center' as const,
      } as CSSProperties,
      emptyText: {
        color: theme.vars.colors.text.secondary,
        fontSize: '1rem',
      } as CSSProperties,
      loadMoreButton: {
        backgroundColor: theme.vars.colors.primary.main,
        border: 'none',
        borderRadius: theme.vars.borderRadius.medium,
        color: theme.vars.colors.primary.contrastText,
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 500,
        padding: `calc(${theme.vars.spacing.unit} * 1.5) calc(${theme.vars.spacing.unit} * 3)`,
        width: '100%',
        transition: 'all 0.2s',
      } as CSSProperties,
      loadMoreButtonDisabled: {
        backgroundColor: theme.vars.colors.text.secondary,
        cursor: 'not-allowed',
        opacity: 0.6,
      } as CSSProperties,
      errorMargin: {
        marginTop: `calc(${theme.vars.spacing.unit} * 2)`,
      } as CSSProperties,
      loadMoreMargin: {
        marginTop: `calc(${theme.vars.spacing.unit} * 3)`,
      } as CSSProperties,
      popupContent: {
        padding: theme.vars.spacing.unit,
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

export default BaseOrganizationList;
