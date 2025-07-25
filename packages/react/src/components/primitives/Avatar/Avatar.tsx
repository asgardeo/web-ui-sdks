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

import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import {cx} from '@emotion/css';
import {FC, JSX, useMemo} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import useStyles from './Avatar.styles';

export interface AvatarProps {
  /**
   * Alternative text for the avatar image
   */
  alt?: string;
  /**
   * Background generation strategy
   * - 'random': Generate background color based on ASCII values of the name
   * - 'none': Use default theme background
   * - string: Use custom background color
   * @default 'random'
   */
  background?: 'random' | 'none' | string;
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

export const Avatar: FC<AvatarProps> = ({
  alt = 'User avatar',
  background = 'random',
  className = '',
  imageUrl,
  name,
  size = 64,
  variant = 'circular',
}): JSX.Element => {
  const {theme, colorScheme} = useTheme();

  const generateBackgroundColor = (inputString: string): string => {
    const hash = inputString.split('').reduce((acc, char) => {
      const charCode = char.charCodeAt(0);
      return ((acc << 5) - acc + charCode) & 0xffffffff;
    }, 0);

    const seed = Math.abs(hash);

    const generateColor = (offset: number): string => {
      const hue1 = (seed + offset) % 360;
      const hue2 = (hue1 + 60 + (seed % 120)) % 360;

      const saturation = 70 + (seed % 20);
      const lightness1 = 55 + (seed % 15);
      const lightness2 = 60 + ((seed + offset) % 15);

      return `hsl(${hue1}, ${saturation}%, ${lightness1}%), hsl(${hue2}, ${saturation}%, ${lightness2}%)`;
    };

    const angle = 45 + (seed % 91);

    const colors = generateColor(seed);
    return `linear-gradient(${angle}deg, ${colors})`;
  };

  const backgroundColor = useMemo(() => {
    if (!name || imageUrl) {
      return undefined;
    }

    if (background === 'random') {
      return generateBackgroundColor(name);
    }

    if (background === 'none') {
      return undefined;
    }

    return background;
  }, [background, name, imageUrl]);

  const styles = useStyles(theme, colorScheme, size, variant, backgroundColor);

  const getInitials = (fullName: string): string =>
    fullName
      .split(' ')
      .map((part: string) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const renderContent = (): JSX.Element | string => {
    if (imageUrl) {
      return (
        <img src={imageUrl} alt={alt} className={cx(withVendorCSSClassPrefix(bem('avatar', 'image')), styles.image)} />
      );
    }
    if (name) {
      return getInitials(name);
    }

    return <div className={cx(withVendorCSSClassPrefix(bem('avatar', 'skeleton')), styles.skeleton)} />;
  };

  return (
    <div
      className={cx(
        withVendorCSSClassPrefix(bem('avatar')),
        styles.avatar,
        styles.variant,
        withVendorCSSClassPrefix(bem('avatar', null, variant)),
        className,
      )}
    >
      {renderContent()}
    </div>
  );
};

export default Avatar;
