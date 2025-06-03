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

export interface BaseConfig<T = unknown> {
  /**
   * Optional URL where the authorization server should redirect after authentication.
   * This must match one of the allowed redirect URIs configured in your IdP.
   * If not provided, the framework layer will use the default redirect URL based on the application type.
   *
   * @example
   * For development: "http://localhost:3000/api/auth/callback"
   * For production: "https://your-app.com/api/auth/callback"
   */
  afterSignInUrl?: string | undefined;

  /**
   * The base URL of the Asgardeo identity server.
   * Example: "https://api.asgardeo.io/t/{org_name}"
   */
  baseUrl: string | undefined;

  /**
   * The client ID obtained from the Asgardeo application registration.
   * This is used to identify your application during authentication.
   */
  clientId: string | undefined;

  /**
   * Optional client secret for the application.
   * Only required when using confidential client flows.
   * Not recommended for public clients like browser applications.
   */
  clientSecret?: string | undefined;
}

export type Config<T = unknown> = BaseConfig<T>;
