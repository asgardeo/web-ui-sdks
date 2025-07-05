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

'use server';

import {Organization, AsgardeoAPIError, TokenResponse} from '@asgardeo/node';
import getSessionId from './getSessionId';
import AsgardeoNextClient from '../../AsgardeoNextClient';

/**
 * Server action to switch organization.
 */
const switchOrganization = async (
  organization: Organization,
  sessionId: string | undefined,
): Promise<TokenResponse | Response> => {
  try {
    const client: AsgardeoNextClient = AsgardeoNextClient.getInstance();
    const response: TokenResponse | Response = await client.switchOrganization(
      organization,
      sessionId ?? ((await getSessionId()) as string),
    );

    // After switching organization, we need to refresh the page to get updated session data
    // This is because server components don't maintain state between function calls
    const {revalidatePath} = await import('next/cache');

    // Revalidate the current path to refresh the component with new data
    revalidatePath('/');

    return response;
  } catch (error) {
    throw new AsgardeoAPIError(
      `Failed to switch the organizations: ${error instanceof Error ? error.message : String(error)}`,
      'switchOrganization-ServerActionError-001',
      'nextjs',
      error instanceof AsgardeoAPIError ? error.statusCode : undefined,
    );
  }
};

export default switchOrganization;
