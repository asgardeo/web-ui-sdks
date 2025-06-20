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
import clsx from 'clsx';
import {CSSProperties, FC, JSX, useMemo} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';

export interface AvatarProps {
  /**
   * Alternative text for the avatar image
   */
  alt?: string;
  /**
   * Optional className for the avatar
   */
  className?: string;
  /**
   * The URL of the avatar image
   */
  imageUrl?: string;
  /**
   * The name to use for generating initials when no image is provided
   */
  name?: string;
  /**
   * The size of the avatar in pixels
   */
  size?: number;
  /**
   * The variant of the avatar shape
   * @default 'circular'
   */
  variant?: 'circular' | 'square';
}

const useStyles = ({
  size,
  variant,
}: {
  size: number;
  variant: 'circular' | 'square';
}): {
  avatar: CSSProperties;
  image: CSSProperties;
} => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      avatar: {
        alignItems: 'center',
        backgroundColor: theme.colors.background.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: variant === 'circular' ? '50%' : '8px',
        color: theme.colors.text.primary,
        display: 'flex',
        fontSize: `${size * 0.4}px`,
        fontWeight: 500,
        height: `${size}px`,
        justifyContent: 'center',
        overflow: 'hidden',
        width: `${size}px`,
      } as CSSProperties,
      image: {
        height: '100%',
        objectFit: 'cover',
        width: '100%',
      } as CSSProperties,
    }),
    [size, theme, colorScheme, variant],
  );
};

export const Avatar: FC<AvatarProps> = ({
  alt = 'User avatar',
  className = '',
  imageUrl,
  name,
  size = 64,
  variant = 'circular',
}): JSX.Element => {
  const styles: {avatar: CSSProperties; image: CSSProperties} = useStyles({size, variant});

  const getInitials = (fullName: string): string =>
    fullName
      .split(' ')
      .map((part: string) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const renderContent = (): JSX.Element | string => {
    if (imageUrl) {
      return <img src={imageUrl} alt={alt} style={styles.image} />;
    }
    if (name) {
      return getInitials(name);
    }
    return '?';
  };

  return (
    <div style={styles.avatar} className={clsx(withVendorCSSClassPrefix('avatar'), className)}>
      {renderContent()}
    </div>
  );
};

export default Avatar;
