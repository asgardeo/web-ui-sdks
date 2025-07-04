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
import {clsx} from 'clsx';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import useTheme from '../../../contexts/Theme/useTheme';

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
  size?: 'small' | 'medium' | 'large';
  /**
   * Custom style object.
   */
  style?: React.CSSProperties;
}

/**
 * Logo component that displays the brand logo from theme or custom source.
 *
 * @param props - The props for the Logo component.
 * @returns The rendered Logo component.
 */
const Logo: FC<LogoProps> = ({className, src, alt, title, size = 'medium', style}) => {
  const {theme} = useTheme();

  // Get logo configuration from theme - use actual values, not CSS variables
  // Access the actual theme config values, not the CSS variable references from .vars
  const logoConfig = theme.images?.logo;

  const logoSrc = src || logoConfig?.url;

  const logoAlt = alt || logoConfig?.alt || 'Logo';

  const logoTitle = title || logoConfig?.title;

  const logoClasses = clsx(withVendorCSSClassPrefix('logo'), withVendorCSSClassPrefix(`logo--${size}`), className);

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: {
      height: '32px',
      maxWidth: '120px',
    },
    medium: {
      height: '48px',
      maxWidth: '180px',
    },
    large: {
      height: '64px',
      maxWidth: '240px',
    },
  };

  const defaultStyles: React.CSSProperties = {
    width: 'auto',
    objectFit: 'contain',
    ...sizeStyles[size],
    ...style,
  };

  if (!logoSrc) {
    return null;
  }

  return <img src={logoSrc} alt={logoAlt} title={logoTitle} className={logoClasses} style={defaultStyles} />;
};

export default Logo;
