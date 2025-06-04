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

import {CSSProperties, FC, ReactElement, useMemo, useState} from 'react';
import {Popover} from '../../primitives/Popover/Popover';
import {Avatar} from '../../primitives/Avatar/Avatar';

const useStyles = () => {
  return useMemo(
    () => ({
      root: {
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
      },
      card: {
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
      },
      darkCard: {
        background: '#1e1e1e',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      },
      profileInfo: {
        flex: 1,
      },
      name: {
        fontSize: '1.5rem',
        fontWeight: 600,
        margin: '0',
        color: '#1a1a1a',
      },
      darkName: {
        color: '#ffffff',
      },
      infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      },
      field: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid #eee',
      },
      darkField: {
        borderBottomColor: '#333',
      },
      lastField: {
        borderBottom: 'none',
      },
      label: {
        fontWeight: 500,
        color: '#666',
        width: '120px',
        flexShrink: 0,
      },
      darkLabel: {
        color: '#999',
      },
      value: {
        color: '#1a1a1a',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      darkValue: {
        color: '#ffffff',
      },
      popup: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        maxHeight: '90vh',
        overflowY: 'auto',
      },
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      },
    }),
    [],
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
}): ReactElement => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(mode === 'popup');
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (!user) {
    return fallback;
  }

  const renderUserInfo = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <div style={{...styles.field, ...(isDarkMode ? styles.darkField : {})}}>
        <span style={{...styles.label, ...(isDarkMode ? styles.darkLabel : {})}}>{label}</span>
        <span style={{...styles.value, ...(isDarkMode ? styles.darkValue : {})}}>{value}</span>
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
    ...(cardLayout ? {...styles.card, ...(isDarkMode ? styles.darkCard : {})} : {}),
  };

  const excludedProps = ['displayName', 'profileUrl'];

  const profileContent = (
    <div style={containerStyle} className={className}>
      <div style={styles.header}>
        <Avatar imageUrl={user.profileUrl} name={user.displayName} size={80} alt={`${user.displayName}'s avatar`} />
        <div style={styles.profileInfo}>
          {user.displayName && (
            <h2 style={{...styles.name, ...(isDarkMode ? styles.darkName : {})}}>{user.displayName}</h2>
          )}
        </div>
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
        {profileContent}
      </Popover>
    );
  }

  return profileContent;
};

export default BaseUserProfile;
