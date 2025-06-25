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
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react';
import clsx from 'clsx';
import {CSSProperties, FC, ReactElement, ReactNode, useMemo, useRef, useState} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import getMappedUserProfileValue from '../../../utils/getMappedUserProfileValue';
import {Avatar} from '../../primitives/Avatar/Avatar';
import Button from '../../primitives/Button/Button';
import LogOut from '../../primitives/Icons/LogOut';
import User from '../../primitives/Icons/User';
import Typography from '../../primitives/Typography/Typography';

const useStyles = () => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      trigger: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${theme.spacing.unit}px`,
        padding: `${theme.spacing.unit * 0.5}px`,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        borderRadius: theme.borderRadius.medium,
        '&:hover': {
          backgroundColor: theme.colors.background,
        },
      } as CSSProperties,
      userName: {
        color: theme.colors.text.primary,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '120px',
      } as CSSProperties,
      dropdownContent: {
        minWidth: '200px',
        maxWidth: '300px',
        backgroundColor: theme.colors.background.surface,
        borderRadius: theme.borderRadius.medium,
        boxShadow: `0 4px 6px -1px ${
          colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'
        }, 0 2px 4px -1px ${colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.06)'}`,
        border: `1px solid ${theme.colors.border}`,
        outline: 'none',
        zIndex: 1000,
      } as CSSProperties,
      dropdownMenu: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      } as CSSProperties,
      menuItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: `${theme.spacing.unit}px`,
        padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 2}px`,
        width: '100%',
        color: theme.colors.text.primary,
        textDecoration: 'none',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        textAlign: 'left',
        borderRadius: theme.borderRadius.medium,
        transition: 'background-color 0.15s ease-in-out',
      } as CSSProperties,
      menuItemAnchor: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: `${theme.spacing.unit}px`,
        padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 2}px`,
        width: '100%',
        color: theme.colors.text.primary,
        textDecoration: 'none',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        textAlign: 'left',
        borderRadius: theme.borderRadius.medium,
        transition: 'background-color 0.15s ease-in-out',
      } as CSSProperties,
      divider: {
        margin: `${theme.spacing.unit * 0.5}px 0`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      dropdownHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: `${theme.spacing.unit}px`,
        padding: `${theme.spacing.unit * 1.5}px`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      headerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing.unit / 4}px`,
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      } as CSSProperties,
      headerName: {
        color: theme.colors.text.primary,
        fontSize: '1rem',
        fontWeight: 500,
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      } as CSSProperties,
      headerEmail: {
        color: theme.colors.text.secondary,
        fontSize: '0.875rem',
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      } as CSSProperties,
      loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        gap: `${theme.spacing.unit}px`,
      } as CSSProperties,
      loadingText: {
        color: theme.colors.text.secondary,
        fontSize: '0.875rem',
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

interface MenuItem {
  href?: string;
  icon?: ReactNode;
  label: ReactNode;
  onClick?: () => void;
}

export interface BaseUserDropdownProps {
  /**
   * Mapping of component attribute names to identity provider field names.
   * Allows customizing which user profile fields should be used for each attribute.
   */
  attributeMapping?: {
    [key: string]: string | string[] | undefined;
    firstName?: string | string[];
    lastName?: string | string[];
    picture?: string | string[];
    username?: string | string[];
  };
  /**
   * Optional size for the avatar
   */
  avatarSize?: number;
  /**
   * Optional className for the dropdown container.
   */
  className?: string;
  /**
   * Optional element to render when no user is signed in.
   */
  fallback?: ReactElement;
  /**
   * Whether the user data is currently loading
   */
  isLoading?: boolean;
  /**
   * Menu items to display in the dropdown
   */
  menuItems?: MenuItem[];
  /**
   * Callback function for "Manage Profile" action
   */
  onManageProfile?: () => void;
  /**
   * Callback function for "Sign Out" action
   */
  onSignOut?: () => void;
  /**
   * The HTML element ID where the portal should be mounted
   */
  portalId?: string;
  /**
   * Show dropdown header with user information
   */
  showDropdownHeader?: boolean;
  /**
   * Show user's display name next to avatar in the trigger button
   */
  showTriggerLabel?: boolean;
  /**
   * The user object containing profile information
   */
  user: any;
}

/**
 * BaseUserDropdown component displays a user avatar with a dropdown menu.
 * When clicked, it shows a popover with customizable menu items.
 * This component serves as the base for framework-specific implementations.
 */
export const BaseUserDropdown: FC<BaseUserDropdownProps> = ({
  fallback = null,
  className = '',
  user,
  isLoading = false,
  portalId = 'asgardeo-user-dropdown',
  menuItems = [],
  showTriggerLabel = false,
  avatarSize = 32,
  onManageProfile,
  onSignOut,
  attributeMapping = {},
}): ReactElement => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const {theme, colorScheme} = useTheme();

  const hoverBackgroundColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
    middleware: [offset(5), flip({fallbackAxisSideDirection: 'end'}), shift({padding: 5})],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss, role]);

  const defaultAttributeMappings = {
    picture: ['profile', 'profileUrl', 'picture', 'URL'],
    firstName: ['name.givenName', 'given_name'],
    lastName: ['name.familyName', 'family_name'],
    email: ['emails'],
    username: ['userName', 'username', 'user_name'],
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

  if (fallback && !user && !isLoading) {
    return fallback;
  }

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  // Create default menu items
  const defaultMenuItems: MenuItem[] = [];

  if (onManageProfile) {
    defaultMenuItems.push({
      label: 'Manage Profile',
      onClick: onManageProfile,
      icon: <User width="16" height="16" />,
    });
  }

  if (onSignOut) {
    defaultMenuItems.push({
      label: 'Sign Out',
      onClick: onSignOut,
      icon: <LogOut width="16" height="16" />,
    });
  }

  // Merge custom menu items with default ones
  const allMenuItems = [...menuItems];
  if (defaultMenuItems.length > 0) {
    // Add divider before default items if there are custom items
    if (menuItems.length > 0) {
      allMenuItems.push({label: '', onClick: undefined}); // Divider placeholder
    }
    allMenuItems.push(...defaultMenuItems);
  }

  return (
    <div className={clsx(withVendorCSSClassPrefix('user-dropdown'), className)}>
      <Button
        ref={refs.setReference}
        className={withVendorCSSClassPrefix('user-dropdown__trigger')}
        style={styles.trigger}
        color="tertiary"
        variant="text"
        size="medium"
        {...getReferenceProps()}
      >
        <Avatar
          imageUrl={getMappedUserProfileValue('picture', mergedMappings, user)}
          name={getDisplayName()}
          size={avatarSize}
          alt={`${getDisplayName()}'s avatar`}
        />
        {showTriggerLabel && (
          <Typography
            variant="body2"
            className={withVendorCSSClassPrefix('user-dropdown__trigger-label')}
            style={styles.userName}
          >
            {getDisplayName()}
          </Typography>
        )}
      </Button>

      {isOpen && (
        <FloatingPortal id={portalId}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              className={withVendorCSSClassPrefix('user-dropdown__content')}
              style={{...floatingStyles, ...styles.dropdownContent}}
              {...getFloatingProps()}
            >
              <div className={withVendorCSSClassPrefix('user-dropdown__header')} style={styles.dropdownHeader}>
                <Avatar
                  imageUrl={getMappedUserProfileValue('picture', mergedMappings, user)}
                  name={getDisplayName()}
                  size={avatarSize * 1.25}
                  alt={`${getDisplayName()}'s avatar`}
                />
                <div className={withVendorCSSClassPrefix('user-dropdown__header-info')} style={styles.headerInfo}>
                  <Typography
                    noWrap
                    className={withVendorCSSClassPrefix('user-dropdown__header-name')}
                    variant="body1"
                    fontWeight="medium"
                  >
                    {getDisplayName()}
                  </Typography>
                  <Typography
                    noWrap
                    className={withVendorCSSClassPrefix('user-dropdown__header-email')}
                    variant="caption"
                    color="secondary"
                  >
                    {getMappedUserProfileValue('username', mergedMappings, user) ||
                      getMappedUserProfileValue('email', mergedMappings, user)}
                  </Typography>
                </div>
              </div>
              <div className={withVendorCSSClassPrefix('user-dropdown__menu')} style={styles.dropdownMenu}>
                {allMenuItems.map((item, index) => (
                  <div key={index}>
                    {item.label === '' ? (
                      // Render divider for empty label placeholder
                      <div className={withVendorCSSClassPrefix('user-dropdown__menu-divider')} style={styles.divider} />
                    ) : item.href ? (
                      <a
                        href={item.href}
                        style={{
                          ...styles.menuItemAnchor,
                          backgroundColor: hoveredItemIndex === index ? hoverBackgroundColor : 'transparent',
                        }}
                        className={withVendorCSSClassPrefix('user-dropdown__menu-item')}
                        onMouseEnter={() => setHoveredItemIndex(index)}
                        onMouseLeave={() => setHoveredItemIndex(null)}
                        onFocus={() => setHoveredItemIndex(index)}
                        onBlur={() => setHoveredItemIndex(null)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <Button
                        onClick={() => handleMenuItemClick(item)}
                        style={{
                          ...styles.menuItem,
                          backgroundColor: hoveredItemIndex === index ? hoverBackgroundColor : 'transparent',
                        }}
                        className={withVendorCSSClassPrefix('user-dropdown__menu-item')}
                        color="tertiary"
                        variant="text"
                        size="small"
                        startIcon={item.icon}
                        onMouseEnter={() => setHoveredItemIndex(index)}
                        onMouseLeave={() => setHoveredItemIndex(null)}
                      >
                        {item.label}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
};

export default BaseUserDropdown;
