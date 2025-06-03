/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {OIDCEndpoints} from '../../models/oidc-endpoints';

// TODO: Remove `Partial<OIDCEndpoints>` once the refactoring is done.
export const SERVICE_RESOURCES: Partial<OIDCEndpoints> = {
  authorizationEndpoint: '/oauth2/authorize',
  checkSessionIframe: '/oidc/checksession',
  endSessionEndpoint: '/oidc/logout',
  issuer: '/oauth2/token',
  jwksUri: '/oauth2/jwks',
  revocationEndpoint: '/oauth2/revoke',
  tokenEndpoint: '/oauth2/token',
  userinfoEndpoint: '/oauth2/userinfo',
};

export const TENANT: string = 'tenant';
export const SIGN_IN_REDIRECT_URL: string = 'sign_in_redirect_url';
export const SIGN_OUT_REDIRECT_URL: string = 'sign_out_redirect_url';
export const OPEN_ID_CONFIG: string = 'open_id_config';
