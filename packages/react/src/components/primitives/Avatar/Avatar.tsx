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

import {CSSProperties, FC, useMemo} from 'react';
import {useTheme} from '../../../contexts/Theme/useTheme';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';

export interface AvatarProps {
  /**
   * The URL of the avatar image
   */
  imageUrl?: string;
  /**
   * Alternative text for the avatar image
   */
  alt?: string;
  /**
   * The size of the avatar in pixels
   */
  size?: number;
  /**
   * The name to use for generating initials when no image is provided
   */
  name?: string;
  /**
   * Optional className for the avatar
   */
  className?: string;
}

const useStyles = ({size}) => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      avatar: {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: theme.colors.background.surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.4}px`,
        fontWeight: 500,
        color: theme.colors.text.primary,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: colorScheme === 'dark' ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      } as CSSProperties,
      image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      } as CSSProperties,
    }),
    [size, theme, colorScheme],
  );
};

export const Avatar: FC<AvatarProps> = ({imageUrl, alt = 'User avatar', size = 64, name, className = ''}) => {
  const styles = useStyles({size});

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div style={styles.avatar} className={clsx(withVendorCSSClassPrefix('avatar'), className)}>
      {imageUrl ? <img src={imageUrl} alt={alt} style={styles.image} /> : name ? getInitials(name) : '?'}
    </div>
  );
};

export default Avatar;
