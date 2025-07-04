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

import {BrandingPreference, Theme} from '@asgardeo/browser';
import useBrandingContext from '../contexts/Branding/useBrandingContext';

/**
 * Configuration options for the useBranding hook
 * @deprecated Use BrandingProvider instead for better performance and consistency
 */
export interface UseBrandingConfig {
  /**
   * @deprecated This configuration is now handled by BrandingProvider
   */
  locale?: string;
  /**
   * @deprecated This configuration is now handled by BrandingProvider
   */
  name?: string;
  /**
   * @deprecated This configuration is now handled by BrandingProvider
   */
  type?: string;
  /**
   * @deprecated This configuration is now handled by BrandingProvider
   */
  forceTheme?: 'light' | 'dark';
  /**
   * @deprecated This configuration is now handled by BrandingProvider
   */
  autoFetch?: boolean;
  /**
   * @deprecated This configuration is now handled by BrandingProvider
   */
  fetcher?: (url: string, config: RequestInit) => Promise<Response>;
}

/**
 * Return type of the useBranding hook
 */
export interface UseBrandingReturn {
  /**
   * The raw branding preference data
   */
  brandingPreference: BrandingPreference | null;
  /**
   * The transformed theme object
   */
  theme: Theme | null;
  /**
   * The active theme mode from branding preference ('light' | 'dark')
   */
  activeTheme: 'light' | 'dark' | null;
  /**
   * Loading state
   */
  isLoading: boolean;
  /**
   * Error state
   */
  error: Error | null;
  /**
   * Function to manually fetch branding preference
   */
  fetchBranding: () => Promise<void>;
  /**
   * Function to refetch branding preference
   * This bypasses the single-call restriction and forces a new API call
   */
  refetch: () => Promise<void>;
}

/**
 * React hook for accessing branding preferences from the BrandingProvider context.
 * This hook provides access to branding preferences, theme data, and loading states.
 *
 * @deprecated Consider using useBrandingContext directly for better performance.
 * This hook is maintained for backward compatibility.
 *
 * @param config - Configuration options (deprecated, use BrandingProvider props instead)
 * @returns Object containing branding preference data, theme, loading state, error, and refetch function
 *
 * @example
 * Basic usage:
 * ```tsx
 * function MyComponent() {
 *   const { theme, activeTheme, isLoading, error } = useBranding();
 *
 *   if (isLoading) return <div>Loading branding...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div style={{ color: theme?.colors?.primary?.main }}>
 *       <p>Active theme mode: {activeTheme}</p>
 *       <p>Styled with Asgardeo branding</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * For new implementations, use BrandingProvider with useBrandingContext:
 * ```tsx
 * // In your root component
 * <BrandingProvider baseUrl="https://api.asgardeo.io/t/your-org">
 *   <App />
 * </BrandingProvider>
 *
 * // In your component
 * function MyComponent() {
 *   const { theme, activeTheme, isLoading, error } = useBrandingContext();
 *   // ... rest of your component
 * }
 * ```
 */
export const useBranding = (config: UseBrandingConfig = {}): UseBrandingReturn => {
  try {
    return useBrandingContext();
  } catch (error) {
    console.warn(
      'useBranding: BrandingProvider not available. ' +
        'Make sure to wrap your app with BrandingProvider or AsgardeoProvider with branding preferences.',
    );

    return {
      brandingPreference: null,
      theme: null,
      activeTheme: null,
      isLoading: false,
      error: new Error('BrandingProvider not available'),
      fetchBranding: async () => {},
      refetch: async () => {},
    };
  }
};

export default useBranding;
