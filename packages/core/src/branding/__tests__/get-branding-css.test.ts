/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import BrandingPreferenceMock from './__mocks__/branding-preference.json';
import {BrandingPreference, ThemeConfig} from '../../models/branding-api-response';
import GetBrandingProps from '../../models/get-branding-props';
import getBranding from '../get-branding'; // Import the function that getBrandingCSS depends on
import getBrandingCSS from '../get-branding-css';

jest.mock('../get-branding', () => jest.fn());

describe('getBrandingCSS', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should generate CSS string with valid theme data', async () => {
    const brandingPreference: BrandingPreference = BrandingPreferenceMock.preference as BrandingPreference;
    const theme: ThemeConfig = brandingPreference.theme.LIGHT;

    const mockGetBrandingProps: any = {
      branding: BrandingPreferenceMock,
      merged: null,
    };

    (getBranding as jest.Mock).mockResolvedValue({preference: theme});

    const generatedCSS: string = await getBrandingCSS(mockGetBrandingProps);

    expect(generatedCSS).toContain(`@import url(${theme.typography.font.importURL});`);
    expect(generatedCSS).toContain(`--asg-colors-primary-main: ${theme.colors.primary.main};`);
    expect(generatedCSS).toContain(`--asg-footer-text-color: ${theme.footer.font.color};`);
  });

  it('should return empty string when no active theme is found', async () => {
    const brandingPreference: BrandingPreference = BrandingPreferenceMock.preference as BrandingPreference;
    const theme: ThemeConfig = brandingPreference.theme.LIGHT;

    const mockGetBrandingProps: GetBrandingProps = {
      branding: null,
      merged: null,
    };

    (getBranding as jest.Mock).mockResolvedValue({preference: theme});

    const generatedCSS: string = await getBrandingCSS(mockGetBrandingProps);

    expect(generatedCSS).toBe('');
  });
});
