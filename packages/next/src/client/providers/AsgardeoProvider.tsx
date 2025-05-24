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

'use client';

import {AsgardeoProviderProps as ReactAsgardeoProviderProps} from '@asgardeo/react';
import {FC, PropsWithChildren, ReactElement} from 'react';

/**
 * Props interface of {@link AsgardeoProvider}
 */
export type AsgardeoProviderProps = Partial<ReactAsgardeoProviderProps>;

const withNextAsgardeoProviderOptions = (options: AsgardeoProviderProps): AsgardeoProviderProps => ({
  ...options,
  baseUrl: process.env['NEXT_PUBLIC_ASGARDEO_BASE_URL'],
  clientId: process.env['NEXT_PUBLIC_ASGARDEO_CLIENT_ID'],
  clientSecret: process.env['ASGARDEO_CLIENT_SECRET'],
});

const AsgardeoProvider: FC<PropsWithChildren<AsgardeoProviderProps>> = ({
  children,
  ...rest
}: PropsWithChildren<AsgardeoProviderProps>): ReactElement => (
  <div {...withNextAsgardeoProviderOptions(rest || {})}>{children}</div>
);

export default AsgardeoProvider;
