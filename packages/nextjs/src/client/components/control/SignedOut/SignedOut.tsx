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

import {FC, PropsWithChildren, ReactNode} from 'react';
import useAsgardeo from '../../../contexts/Asgardeo/useAsgardeo';

/**
 * Props interface of {@link SignedOut}
 */
export interface SignedOutProps {
  /**
   * Content to show when the user is not signed-out.
   */
  fallback?: ReactNode;
}

/**
 * A component that only renders its children when the user is signed out.
 *
 * @example
 * ```tsx
 * import { SignedOut } from '@asgardeo/auth-next';
 *
 * const App = () => {
 *   return (
 *     <SignedOut fallback={<p>Please sign out to continue</p>}>
 *       <p>Welcome! You are signed out.</p>
 *     </SignedOut>
 *   );
 * }
 * ```
 */
const SignedOut: FC<PropsWithChildren<SignedOutProps>> = ({
  children,
  fallback = null,
}: PropsWithChildren<SignedOutProps>) => {
  const {isSignedIn} = useAsgardeo();

  return <>{!isSignedIn ? children : fallback}</>;
};

export default SignedOut;
