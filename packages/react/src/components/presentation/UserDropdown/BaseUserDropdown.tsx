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

import {CSSProperties, FC, ReactElement, ReactNode, useMemo, useState} from 'react';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';
import {useTheme} from '../../../theme/useTheme';
import {Avatar} from '../../primitives/Avatar/Avatar';
import {Popover} from '../../primitives/Popover/Popover';
import getMappedUserProfileValue from '../../../utils/getMappedUserProfileValue';

const useStyles = () => {
  const {theme} = useTheme();

  return useMemo(
    () => ({
      trigger: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: theme.spacing.unit + 'px',
        padding: theme.spacing.unit * 0.5 + 'px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        borderRadius: theme.borderRadius.small,
        '&:hover': {
          backgroundColor: theme.colors.background,
        },
      } as CSSProperties,
      userName: {
        color: theme.colors.text.primary,
        fontSize: '1rem',
        fontWeight: 500,
      } as CSSProperties,
      dropdownContent: {
        minWidth: '200px',
        maxWidth: '300px',
      } as CSSProperties,
      dropdownMenu: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      } as CSSProperties,
      menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.unit + 'px',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
        width: '100%',
        color: theme.colors.text.primary,
        textDecoration: 'none',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        '&:hover': {
          backgroundColor: theme.colors.background,
        },
      } as CSSProperties,
      divider: {
        margin: `${theme.spacing.unit * 0.5}px 0`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      dropdownHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.unit + 'px',
        padding: `${theme.spacing.unit * 1.5}px`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      headerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.unit / 2 + 'px',
      } as CSSProperties,
      headerName: {
        color: theme.colors.text.primary,
        fontSize: '1rem',
        fontWeight: 500,
        margin: 0,
      } as CSSProperties,
      headerEmail: {
        color: theme.colors.text.secondary,
        fontSize: '0.875rem',
        margin: 0,
      } as CSSProperties,
    }),
    [theme],
  );
};

export interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
}

export interface BaseUserDropdownProps {
  /**
   * Optional element to render when no user is signed in.
   */
  fallback?: ReactElement;
  /**
   * Optional className for the dropdown container.
   */
  className?: string;
  /**
   * The user object containing profile information
   */
  user: any;
  /**
   * The HTML element ID where the portal should be mounted
   */
  portalId?: string;
  /**
   * Menu items to display in the dropdown
   */
  menuItems?: MenuItem[];
  /**
   * Show user's display name next to avatar in the trigger button
   */
  showTriggerLable?: boolean;
  /**
   * Show dropdown header with user information
   */
  showDropdownHeader?: boolean;
  /**
   * Optional size for the avatar
   */
  avatarSize?: number;
  /**
   * Mapping of component attribute names to identity provider field names.
   * Allows customizing which user profile fields should be used for each attribute.
   */
  attributeMapping?: {
    picture?: string | string[];
    firstName?: string | string[];
    lastName?: string | string[];
    username?: string | string[];
    [key: string]: string | string[] | undefined;
  };
}

/**
 * BaseUserDropdown component displays a user avatar with a dropdown menu.
 * When clicked, it shows a popover with customizable menu items.
 * This component serves as the base for framework-specific implementations.
 */
export const BaseUserDropdown: FC<BaseUserDropdownProps> = ({
  fallback = <div>Please sign in</div>,
  className = '',
  user,
  portalId = 'asgardeo-user-dropdown',
  menuItems = [],
  showTriggerLable = false,
  showDropdownHeader = true,
  avatarSize = 32,
  attributeMapping = {},
}): ReactElement => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const defaultAttributeMappings = {
    picture: ['profile', 'profileUrl'],
    firstName: 'givenName',
    lastName: 'familyName',
    email: 'emails',
  };

  const mergedMappings = {...defaultAttributeMappings, ...attributeMapping};

  const getDisplayName = () => {
    const firstName = getMappedUserProfileValue('firstName', mergedMappings, user);
    const lastName = getMappedUserProfileValue('lastName', mergedMappings, user);

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    return getMappedUserProfileValue('username', mergedMappings, user) || '';
  };

  if (!user) {
    return fallback;
  }

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div className={clsx(withVendorCSSClassPrefix('user-dropdown'), className)}>
      <button
        className={withVendorCSSClassPrefix('user-dropdown-trigger')}
        style={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar
          imageUrl={getMappedUserProfileValue('picture', mergedMappings, user)}
          name={getDisplayName()}
          size={avatarSize}
          alt={`${getDisplayName()}'s avatar`}
        />
        {showTriggerLable && <span style={styles.userName}>{getDisplayName()}</span>}
      </button>

      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} portalId={portalId} mode="dropdown">
        <Popover.Content>
          <div style={styles.dropdownContent}>
            {showDropdownHeader && (
              <div className={withVendorCSSClassPrefix('user-dropdown-header')} style={styles.dropdownHeader}>
                <Avatar
                  imageUrl={getMappedUserProfileValue('picture', mergedMappings, user)}
                  name={getDisplayName()}
                  size={avatarSize * 1.25}
                  alt={`${getDisplayName()}'s avatar`}
                />
                <div className={withVendorCSSClassPrefix('user-dropdown-header-info')} style={styles.headerInfo}>
                  <span className={withVendorCSSClassPrefix('user-dropdown-header-name')} style={styles.headerName}>
                    {getDisplayName()}
                  </span>
                  {getMappedUserProfileValue('email', mergedMappings, user) !== getDisplayName() &&
                    getMappedUserProfileValue('email', mergedMappings, user) && (
                      <span
                        className={withVendorCSSClassPrefix('user-dropdown-header-email')}
                        style={styles.headerEmail}
                      >
                        {getMappedUserProfileValue('email', mergedMappings, user)}
                      </span>
                    )}
                </div>
              </div>
            )}
            <div className={withVendorCSSClassPrefix('user-dropdown-menu')} style={styles.dropdownMenu}>
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={styles.menuItem}
                      className={withVendorCSSClassPrefix('user-dropdown-menu-item')}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleMenuItemClick(item)}
                      style={styles.menuItem}
                      className={withVendorCSSClassPrefix('user-dropdown-menu-item')}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )}
                  {index < menuItems.length - 1 && <div style={styles.divider} />}
                </div>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default BaseUserDropdown;
