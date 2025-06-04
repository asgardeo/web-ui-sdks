/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance wi      <div style={styles.header}>
        <Avatar imageUrl={getMappedValue('profileUrl')} name={getMappedValue('displayName')} size={80} alt={`${getMappedValue('displayName')}'s avatar`} />
        <div style={styles.profileInfo}>{getMappedValue('displayName') && <h2 style={styles.name}>{getMappedValue('displayName')}</h2>}</div>
      </div>he License.
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

import {CSSProperties, FC, ReactElement, useMemo, useState} from 'react';
import {Popover} from '../../primitives/Popover/Popover';
import {Avatar} from '../../primitives/Avatar/Avatar';
import {useTheme} from '../../../theme/useTheme';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';

const useStyles = () => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      root: {
        padding: theme.spacing.unit + 'px',
        maxWidth: '600px',
        margin: '0 auto',
      } as CSSProperties,
      card: {
        background: theme.colors.surface,
        borderRadius: theme.borderRadius.medium,
      } as CSSProperties,
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.unit * 1.5 + 'px',
        marginBottom: theme.spacing.unit * 1.5 + 'px',
      } as CSSProperties,
      profileInfo: {
        flex: 1,
      } as CSSProperties,
      name: {
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: '0',
        color: theme.colors.text.primary,
      } as CSSProperties,
      infoContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing.unit + 'px',
      } as CSSProperties,
      field: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing.unit * 0.5 + 'px 0',
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      lastField: {
        borderBottom: 'none',
      } as CSSProperties,
      label: {
        fontWeight: 500,
        color: theme.colors.text.secondary,
        width: '120px',
        flexShrink: 0,
      } as CSSProperties,
      value: {
        color: theme.colors.text.primary,
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      } as CSSProperties,
      popup: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        maxHeight: '90vh',
        overflowY: 'auto',
      } as CSSProperties,
      popupHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.unit * 1.5 + 'px',
        borderBottom: `1px solid ${theme.colors.border}`,
        paddingBottom: theme.spacing.unit + 'px',
      } as CSSProperties,
      popupTitle: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: 600,
        color: theme.colors.text.primary,
      } as CSSProperties,
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

/**
 * Props for the BaseUserProfile component.
 */
export interface BaseUserProfileProps {
  /**
   * Optional element to render when no user is signed in.
   */
  fallback?: ReactElement;
  /**
   * Optional className for the profile container.
   */
  className?: string;
  /**
   * Determines if the profile should display in a card layout.
   */
  cardLayout?: boolean;
  /**
   * The user object containing profile information
   */
  user: any;
  /**
   * Display mode for the profile. Use 'popup' to render in a portal
   */
  mode?: 'inline' | 'popup';
  /**
   * The HTML element ID where the portal should be mounted
   */
  portalId?: string;
  /**
   * Optional title for the profile popup
   */
  title?: string;
  /**
   * Mapping of component attribute names to identity provider field names.
   * Allows customizing which user profile fields should be used for each attribute.
   */
  attributeMapping?: {
    picture?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    [key: string]: string | undefined;
  };
}

/**
 * BaseUserProfile component displays the authenticated user's profile information in a
 * structured and styled format. It shows user details such as display name, email,
 * username, and other available profile information.
 * This component serves as the base for framework-specific implementations.
 */
export const BaseUserProfile: FC<BaseUserProfileProps> = ({
  fallback = <div>Please sign in to view your profile</div>,
  className = '',
  cardLayout = true,
  user,
  mode = 'inline',
  portalId = 'asgardeo-user-profile',
  title = 'User Profile',
  attributeMapping = {},
}): ReactElement => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(mode === 'popup');

  const defaultAttributeMappings = {
    picture: 'profile',
    firstName: 'given_name',
    lastName: 'family_name'
  };

  const mergedMappings = { ...defaultAttributeMappings, ...attributeMapping };

  const getMappedValue = (key: string) => {
    const mappedKey = mergedMappings[key];
    return mappedKey ? user[mappedKey] : user[key];
  };

  const getDisplayName = () => {
    const firstName = getMappedValue('firstName');
    const lastName = getMappedValue('lastName');

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    return getMappedValue('username') || '';
  };

  if (!user) {
    return fallback;
  }

  const renderUserInfo = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <div style={styles.field}>
        <span style={styles.label}>{label}</span>
        <span style={styles.value}>{value}</span>
      </div>
    );
  };

  const formatLabel = (key: string): string =>
    key
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const containerStyle = {
    ...styles.root,
    ...(cardLayout ? styles.card : {}),
  };

  // Get the component attributes that are being used in the Avatar
  const avatarAttributes = ['picture'];
  const excludedProps = avatarAttributes.map(attr => mergedMappings[attr] || attr);

  const profileContent = (
    <div style={containerStyle} className={clsx(withVendorCSSClassPrefix('user-profile'), className)}>
      <div style={styles.header}>
        <Avatar
          imageUrl={getMappedValue('picture')}
          name={getDisplayName()}
          size={80}
          alt={`${getDisplayName()}'s avatar`}
        />
      </div>
      <div style={styles.infoContainer}>
        {Object.entries(user)
          .filter(([key]) => !excludedProps.includes(key) && user[key])
          .map(([key, value]) => {
            const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return renderUserInfo(formatLabel(key), displayValue);
          })}
      </div>
    </div>
  );

  if (mode === 'popup') {
    return (
      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} portalId={portalId}>
        <Popover.Header>{title}</Popover.Header>
        <Popover.Content>{profileContent}</Popover.Content>
      </Popover>
    );
  }

  return profileContent;
};

export default BaseUserProfile;
