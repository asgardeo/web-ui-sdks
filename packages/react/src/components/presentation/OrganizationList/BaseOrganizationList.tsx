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

import {FC, ReactElement, ReactNode} from 'react';
import {OrganizationWithSwitchAccess} from '../../../hooks/useOrganizations';

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
   * Custom renderer for each organization item
   */
  renderOrganization?: (organization: OrganizationWithSwitchAccess, index: number) => ReactNode;
  /**
   * Custom renderer for the error state
   */
  renderError?: (error: string) => ReactNode;
  /**
   * Custom renderer for the loading state
   */
  renderLoading?: () => ReactNode;
  /**
   * Custom renderer for the load more button
   */
  renderLoadMore?: (onLoadMore: () => Promise<void>, isLoading: boolean) => ReactNode;
  /**
   * Custom renderer for when no organizations are found
   */
  renderEmpty?: () => ReactNode;
  /**
   * Inline styles to apply to the container
   */
  style?: React.CSSProperties;
  /**
   * Total number of organizations
   */
  totalCount?: number;
}

/**
 * Default organization item renderer
 */
const defaultRenderOrganization = (organization: OrganizationWithSwitchAccess): ReactNode => (
  <div
    key={organization.id}
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px',
    }}
  >
    <div>
      <h3 style={{fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0'}}>{organization.name}</h3>
      <p style={{color: '#6b7280', fontSize: '14px', margin: '0'}}>Handle: {organization.orgHandle}</p>
      <p style={{color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0'}}>
        Status: <span style={{color: organization.status === 'ACTIVE' ? '#10b981' : '#ef4444'}}>{organization.status}</span>
      </p>
    </div>
    <div style={{alignItems: 'center', display: 'flex'}}>
      {organization.canSwitch ? (
        <span
          style={{
            backgroundColor: '#dcfce7',
            borderRadius: '16px',
            color: '#16a34a',
            fontSize: '12px',
            fontWeight: 'medium',
            padding: '4px 12px',
          }}
        >
          Can Switch
        </span>
      ) : (
        <span
          style={{
            backgroundColor: '#fee2e2',
            borderRadius: '16px',
            color: '#dc2626',
            fontSize: '12px',
            fontWeight: 'medium',
            padding: '4px 12px',
          }}
        >
          No Access
        </span>
      )}
    </div>
  </div>
);

/**
 * Default loading renderer
 */
const defaultRenderLoading = (): ReactNode => (
  <div style={{padding: '32px', textAlign: 'center'}}>
    <div>Loading organizations...</div>
  </div>
);

/**
 * Default error renderer
 */
const defaultRenderError = (error: string): ReactNode => (
  <div
    style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      padding: '16px',
    }}
  >
    <strong>Error:</strong> {error}
  </div>
);

/**
 * Default load more button renderer
 */
const defaultRenderLoadMore = (onLoadMore: () => Promise<void>, isLoading: boolean): ReactNode => (
  <button
    onClick={onLoadMore}
    disabled={isLoading}
    style={{
      backgroundColor: isLoading ? '#d1d5db' : '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      fontWeight: 'medium',
      padding: '12px 24px',
      width: '100%',
    }}
    type="button"
  >
    {isLoading ? 'Loading...' : 'Load More Organizations'}
  </button>
);

/**
 * Default empty state renderer
 */
const defaultRenderEmpty = (): ReactNode => (
  <div style={{padding: '32px', textAlign: 'center'}}>
    <div style={{color: '#6b7280', fontSize: '16px'}}>No organizations found</div>
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
  onRefresh,
  renderEmpty = defaultRenderEmpty,
  renderError = defaultRenderError,
  renderLoading = defaultRenderLoading,
  renderLoadMore = defaultRenderLoadMore,
  renderOrganization = defaultRenderOrganization,
  style,
  totalCount,
}): ReactElement => {
  // Show loading state
  if (isLoading && data.length === 0) {
    return <div className={className} style={style}>{renderLoading()}</div>;
  }

  // Show error state
  if (error && data.length === 0) {
    return <div className={className} style={style}>{renderError(error)}</div>;
  }

  // Show empty state
  if (!isLoading && data.length === 0) {
    return <div className={className} style={style}>{renderEmpty()}</div>;
  }

  return (
    <div className={className} style={style}>
      {/* Header with total count and refresh button */}
      <div style={{alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
        <div>
          <h2 style={{fontSize: '24px', fontWeight: 'bold', margin: '0'}}>Organizations</h2>
          {totalCount !== undefined && (
            <p style={{color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0'}}>
              Showing {data.length} of {totalCount} organizations
            </p>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px 16px',
            }}
            type="button"
          >
            Refresh
          </button>
        )}
      </div>

      {/* Organizations list */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
        {data.map((organization: OrganizationWithSwitchAccess, index: number) =>
          renderOrganization(organization, index)
        )}
      </div>

      {/* Error message for additional data */}
      {error && data.length > 0 && (
        <div style={{marginTop: '16px'}}>
          {renderError(error)}
        </div>
      )}

      {/* Load more button */}
      {hasMore && fetchMore && (
        <div style={{marginTop: '24px'}}>
          {renderLoadMore(fetchMore, isLoadingMore)}
        </div>
      )}
    </div>
  );
};

export default BaseOrganizationList;
