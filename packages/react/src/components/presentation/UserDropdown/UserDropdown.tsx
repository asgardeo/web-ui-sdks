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
import useAsgardeo from '../../../hooks/useAsgardeo';
import BaseUserDropdown, {BaseUserDropdownProps} from './BaseUserDropdown';

/**
 * Props for the UserDropdown component.
 * Extends BaseUserDropdownProps but makes the user prop optional since it will be obtained from useAsgardeo
 */
export type UserDropdownProps = Omit<BaseUserDropdownProps, 'user'>;

/**
 * UserDropdown component displays a user avatar with a dropdown menu.
 * When clicked, it shows a popover with customizable menu items.
 * This component is the React-specific implementation that uses the BaseUserDropdown
 * and automatically retrieves the user data from Asgardeo context.
 *
 * @example
 * ```tsx
 * // Basic usage - will use user from Asgardeo context
 * <UserDropdown menuItems={[
 *   { label: 'Profile', onClick: () => {} },
 *   { label: 'Settings', href: '/settings' },
 *   { label: 'Sign Out', onClick: () => {} }
 * ]} />
 *
 * // With custom configuration
 * <UserDropdown
 *   showUsername={false}
 *   avatarSize={40}
 *   fallback={<div>Please sign in</div>}
 * />
 * ```
 */
const UserDropdown: FC<UserDropdownProps> = ({...rest}: UserDropdownProps): ReactElement => {
  const {user} = useAsgardeo();

  return <BaseUserDropdown user={user} {...rest} />;
};

export default UserDropdown;
