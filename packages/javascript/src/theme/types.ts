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

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
  };
  border: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  spacing: {
    unit: number;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface Theme extends ThemeConfig {
  cssVariables: Record<string, string>;
}

export type ThemeMode = 'light' | 'dark' | 'system';
