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

import {useCallback, useEffect, useState} from 'react';
import {
  getBrandingPreference,
  GetBrandingPreferenceConfig,
  BrandingPreference,
  Theme,
  transformBrandingPreferenceToTheme,
} from '@asgardeo/browser';
import useAsgardeo from '../contexts/Asgardeo/useAsgardeo';

/**
 * Configuration options for the useBranding hook
 */
export interface UseBrandingConfig {
  /**
   * Locale for the branding preference
   */
  locale?: string;
  /**
   * Name of the branding preference
   */
  name?: string;
  /**
   * Type of the branding preference
   */
  type?: string;
  /**
   * Force a specific theme ('light' or 'dark')
   * If not provided, will use the activeTheme from branding preference
   */
  forceTheme?: 'light' | 'dark';
  /**
   * Whether to automatically fetch branding preference on mount
   * @default true
   */
  autoFetch?: boolean;
  /**
   * Optional custom fetcher function.
   * If not provided, native fetch will be used
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
 * React hook for fetching and transforming branding preferences from Asgardeo.
 * This hook automatically fetches branding preferences using the configured
 * base URL from the Asgardeo context and transforms them into a theme object.
 * 
 * The hook ensures the branding API is called only once during the component lifecycle
 * unless explicitly refetched using the refetch function.
 *
 * @param config - Configuration options for the hook
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
 * With custom configuration:
 * ```tsx
 * function MyComponent() {
 *   const { theme, fetchBranding } = useBranding({
 *     locale: 'en-US',
 *     name: 'my-branding',
 *     type: 'org',
 *     forceTheme: 'dark',
 *     autoFetch: false
 *   });
 *
 *   useEffect(() => {
 *     fetchBranding();
 *   }, [fetchBranding]);
 *
 *   return <div>Custom branding component</div>;
 * }
 * ```
 *
 * @example
 * With custom fetcher:
 * ```tsx
 * function MyComponent() {
 *   const { theme, isLoading, error } = useBranding({
 *     fetcher: async (url, config) => {
 *       // Use your custom HTTP client
 *       const response = await myHttpClient.request({
 *         url,
 *         method: config.method,
 *         headers: config.headers,
 *         ...config
 *       });
 *       return response;
 *     }
 *   });
 *
 *   return <div>Component with custom fetcher</div>;
 * }
 * ```
 */
export const useBranding = (config: UseBrandingConfig = {}): UseBrandingReturn => {
  const {locale, name, type, forceTheme, autoFetch = true, fetcher} = config;

  const {baseUrl, isInitialized} = useAsgardeo();

  const [brandingPreference, setBrandingPreference] = useState<BrandingPreference | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const fetchBranding = useCallback(async (): Promise<void> => {
    if (!baseUrl) {
      setError(new Error('Base URL is not available. Make sure you are using this hook within an AsgardeoProvider.'));
      return;
    }

    // Prevent multiple calls if already fetching or already fetched (unless explicitly called)
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getBrandingConfig: GetBrandingPreferenceConfig = {
        baseUrl,
        locale,
        name,
        type,
        fetcher,
      };

      const brandingData = await getBrandingPreference(getBrandingConfig);
      setBrandingPreference(brandingData);

      // Extract active theme from branding preference
      const activeThemeFromBranding = brandingData?.preference?.theme?.activeTheme;
      let extractedActiveTheme: 'light' | 'dark' | null = null;
      
      if (activeThemeFromBranding) {
        // Convert to lowercase and map to our expected values
        const themeMode = activeThemeFromBranding.toLowerCase();
        if (themeMode === 'light' || themeMode === 'dark') {
          extractedActiveTheme = themeMode;
        }
      }
      
      setActiveTheme(extractedActiveTheme);

      // Transform branding preference to theme
      const transformedTheme = transformBrandingPreferenceToTheme(brandingData, forceTheme);
      setTheme(transformedTheme);
      setHasFetched(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to fetch branding preference');
      setError(errorMessage);
      setBrandingPreference(null);
      setTheme(null);
      setActiveTheme(null);
      setHasFetched(true); // Mark as fetched even on error to prevent retries
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, locale, name, type, forceTheme, fetcher, isLoading]);

  // Auto-fetch when dependencies change - but only once
  useEffect(() => {
    if (autoFetch && isInitialized && baseUrl && !hasFetched) {
      fetchBranding();
    }
  }, [autoFetch, isInitialized, baseUrl, hasFetched, fetchBranding]);

  // Manual refetch function that bypasses the hasFetched check
  const refetch = useCallback(async (): Promise<void> => {
    setHasFetched(false); // Reset the flag to allow refetching
    await fetchBranding();
  }, [fetchBranding]);

  return {
    brandingPreference,
    theme,
    activeTheme,
    isLoading,
    error,
    fetchBranding,
    refetch,
  };
};

export default useBranding;
