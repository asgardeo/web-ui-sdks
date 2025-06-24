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

import {FC, ReactElement} from 'react';
import BaseOrganizationList, {BaseOrganizationListProps} from './BaseOrganizationList';
import useOrganizations, {UseOrganizationsConfig} from '../../../hooks/useOrganizations';

/**
 * Props interface for the OrganizationList component.
 * Combines BaseOrganizationListProps with UseOrganizationsConfig.
 */
export interface OrganizationListProps
  extends Omit<
      BaseOrganizationListProps,
      'data' | 'error' | 'fetchMore' | 'hasMore' | 'isLoading' | 'isLoadingMore' | 'totalCount'
    >,
    UseOrganizationsConfig {
  /**
   * Function called when an organization is selected/clicked
   */
  onOrganizationSelect?: (organization: any) => void;
}

/**
 * OrganizationList component that provides organization listing functionality with pagination.
 * This component automatically fetches organizations and handles pagination.
 *
 * @example
 * ```tsx
 * import { OrganizationList } from '@asgardeo/react';
 *
 * // Basic usage
 * <OrganizationList />
 *
 * // With custom limit and filter
 * <OrganizationList
 *   limit={20}
 *   filter="active"
 *   onOrganizationSelect={(org) => {
 *     console.log('Selected organization:', org.name);
 *   }}
 * />
 *
 * // As a popup dialog
 * <OrganizationList
 *   mode="popup"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Select Organization"
 * />
 *
 * // With custom organization renderer
 * <OrganizationList
 *   renderOrganization={(org) => (
 *     <div key={org.id}>
 *       <h3>{org.name}</h3>
 *       <p>Can switch: {org.canSwitch ? 'Yes' : 'No'}</p>
 *     </div>
 *   )}
 * />
 * ```
 */
export const OrganizationList: FC<OrganizationListProps> = ({
  autoFetch = true,
  filter,
  limit = 10,
  onOrganizationSelect,
  recursive = false,
  ...baseProps
}: OrganizationListProps): ReactElement => {
  const {data, error, fetchMore, hasMore, isLoading, isLoadingMore, refresh, totalCount} = useOrganizations({
    autoFetch,
    filter,
    limit,
    recursive,
  });

  // Enhanced organization renderer that includes selection handler
  const enhancedRenderOrganization = baseProps.renderOrganization
    ? baseProps.renderOrganization
    : onOrganizationSelect
    ? (organization: any, index: number) => (
        <div
          key={organization.id}
          onClick={() => onOrganizationSelect(organization)}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div>
            <h3 style={{fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0'}}>{organization.name}</h3>
            <p style={{color: '#6b7280', fontSize: '14px', margin: '0'}}>Handle: {organization.orgHandle}</p>
            <p style={{color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0'}}>
              Status:{' '}
              <span style={{color: organization.status === 'ACTIVE' ? '#10b981' : '#ef4444'}}>
                {organization.status}
              </span>
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
      )
    : undefined;

  return (
    <BaseOrganizationList
      data={data}
      error={error}
      fetchMore={fetchMore}
      hasMore={hasMore}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      onRefresh={refresh}
      renderOrganization={enhancedRenderOrganization}
      totalCount={totalCount}
      {...baseProps}
    />
  );
};

export default OrganizationList;
