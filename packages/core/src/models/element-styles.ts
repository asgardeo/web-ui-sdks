/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import type * as CSS from 'csstype';

/**
 * Interface for the Primary Button Style Attributes..
 */
export interface ButtonStyleAttributesInterface {
  /**
   * Button Background.
   */
  background: BackgroundStyleAttributesInterface;
  /**
   * Button Border.
   */
  border: Pick<BorderStyleAttributesInterface, 'borderRadius'>;
  /**
   * Button Text.
   */
  font: FontStyleAttributesInterface;
}

/**
 * Color styles interface.
 * @remarks Extend with contrast, alpha. whenever necessary.
 */
export type ColorStyleAttributesInterface = Pick<CSS.Properties, 'color'>;

/**
 * Font styles interface.
 * @remarks Extend with font size, weight. whenever necessary.
 */
export type FontStyleAttributesInterface = ColorStyleAttributesInterface;

/**
 * Border styles interface.
 * @remarks Extend with borderStyle, etc. whenever necessary.
 */
export type BorderStyleAttributesInterface = Pick<CSS.Properties, 'borderColor'> &
  Pick<CSS.Properties, 'borderRadius'> &
  Pick<CSS.Properties, 'borderWidth'>;

/**
 * Background styles interface.
 * @remarks Extend with backgroundImage, backgroundSize, etc. whenever necessary.
 */
export type BackgroundStyleAttributesInterface = Pick<CSS.Properties, 'backgroundColor'>;

/**
 * Generic interface for element states.
 * @remarks Extend with hover, active & other possible element states.
 */
export interface ElementStateInterface<T> {
  base: T;
}
