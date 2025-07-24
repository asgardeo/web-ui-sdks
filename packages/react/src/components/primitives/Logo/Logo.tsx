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

import {FC} from 'react';
import {cx} from '@emotion/css';
import {withVendorCSSClassPrefix, bem} from '@asgardeo/browser';
import useTheme from '../../../contexts/Theme/useTheme';
import useStyles from './Logo.styles';

export type LogoSize = 'small' | 'medium' | 'large';

/**
 * Props for the Logo component.
 */
export interface LogoProps {
  /**
   * Custom CSS class name for the logo.
   */
  className?: string;
  /**
   * Custom logo URL to override theme logo.
   */
  src?: string;
  /**
   * Custom alt text for the logo.
   */
  alt?: string;
  /**
   * Custom title for the logo.
   */
  title?: string;
  /**
   * Size of the logo.
   */
  size?: LogoSize;
}

/**
 * Logo component that displays the brand logo from theme or custom source.
 *
 * @param props - The props for the Logo component.
 * @returns The rendered Logo component.
 */
const Logo: FC<LogoProps> = ({className, src, alt, title, size = 'medium'}) => {
  const {theme, colorScheme} = useTheme();
  const styles = useStyles(theme, colorScheme, size);

  const logoConfig = theme.images?.logo;

  const logoSrc = src || logoConfig?.url;

  const logoAlt = alt || logoConfig?.alt || 'Logo';

  const logoTitle = title || logoConfig?.title;

  if (!logoSrc) {
    return null;
  }

  return (
    <img
      src={logoSrc}
      alt={logoAlt}
      title={logoTitle}
      className={cx(
        withVendorCSSClassPrefix(bem('logo')),
        withVendorCSSClassPrefix(bem('logo', size)),
        styles.logo,
        styles.size,
        className,
      )}
    />
  );
};

export default Logo;
