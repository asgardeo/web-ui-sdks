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

import {FC, ReactElement, useState} from 'react';

import {BaseCreateOrganization, BaseCreateOrganizationProps} from './BaseCreateOrganization';
import createOrganization, {CreateOrganizationPayload} from '../../../api/scim2/createOrganization';
import useAsgardeo from '../../../contexts/Asgardeo/useAsgardeo';
import useOrganization from '../../../contexts/Organization/useOrganization';
import {Dialog, DialogContent, DialogHeading} from '../../primitives/Popover/Popover';

/**
 * Props interface for the CreateOrganization component.
 */
export interface CreateOrganizationProps extends Omit<BaseCreateOrganizationProps, 'onSubmit' | 'loading' | 'error'> {
  /**
   * Fallback element to render when the user is not signed in.
   */
  fallback?: ReactElement;
  /**
   * Display mode - inline renders within the parent, popup renders in a modal
   */
  mode?: 'inline' | 'popup';
  /**
   * Custom organization creation handler (will use default API if not provided).
   */
  onCreateOrganization?: (payload: CreateOrganizationPayload) => Promise<any>;
  /**
   * Callback for popup open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether the popup is open (only for popup mode)
   */
  open?: boolean;
}

/**
 * CreateOrganization component that provides organization creation functionality.
 * This component automatically integrates with the Asgardeo and Organization contexts.
 *
 * @example
 * ```tsx
 * import { CreateOrganization } from '@asgardeo/react';
 *
 * // Basic usage - uses default API and contexts
 * <CreateOrganization
 *   onSuccess={(org) => console.log('Created:', org)}
 *   onCancel={() => navigate('/organizations')}
 * />
 *
 * // Popup mode
 * <CreateOrganization
 *   mode="popup"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 *
 * // With custom organization creation handler
 * <CreateOrganization
 *   onCreateOrganization={async (payload) => {
 *     const result = await myCustomAPI.createOrganization(payload);
 *     return result;
 *   }}
 *   onSuccess={(org) => {
 *     console.log('Organization created:', org.name);
 *     // Custom success logic here
 *   }}
 * />
 *
 * // With fallback for unauthenticated users
 * <CreateOrganization
 *   fallback={<div>Please sign in to create an organization</div>}
 * />
 * ```
 */
export const CreateOrganization: FC<CreateOrganizationProps> = ({
  onCreateOrganization,
  fallback = null,
  onSuccess,
  defaultParentId,
  mode = 'inline',
  onOpenChange,
  open = false,
  ...props
}: CreateOrganizationProps): ReactElement => {
  const {isSignedIn, baseUrl} = useAsgardeo();
  const {currentOrganization, revalidateOrganizations} = useOrganization();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Don't render if not authenticated
  if (!isSignedIn && fallback) {
    return fallback;
  }

  if (!isSignedIn) {
    return <></>;
  }

  // Use current organization as parent if no defaultParentId provided
  const parentId: string = defaultParentId || currentOrganization?.id || '';

  const handleSubmit = async (payload: CreateOrganizationPayload): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let result: any;

      if (onCreateOrganization) {
        // Use the provided custom creation function
        result = await onCreateOrganization(payload);
      } else {
        // Use the default API
        if (!baseUrl) {
          throw new Error('Base URL is required for organization creation');
        }
        result = await createOrganization({
          baseUrl,
          payload: {
            ...payload,
            parentId,
          },
        });
      }

      // Refresh organizations list to include the new organization
      await revalidateOrganizations();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }

      // Close popup if in popup mode
      if (mode === 'popup' && onOpenChange) {
        onOpenChange(false);
      }
    } catch (createError) {
      const errorMessage: string = createError instanceof Error ? createError.message : 'Failed to create organization';
      setError(errorMessage);
      throw createError; // Re-throw to allow form to handle it
    } finally {
      setLoading(false);
    }
  };

  const createOrgContent: ReactElement = (
    <BaseCreateOrganization
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      defaultParentId={parentId}
      onSuccess={onSuccess}
      {...props}
    />
  );

  if (mode === 'popup') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeading>Create Organization</DialogHeading>
          <div style={{padding: '1rem'}}>{createOrgContent}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return createOrgContent;
};

export default CreateOrganization;
