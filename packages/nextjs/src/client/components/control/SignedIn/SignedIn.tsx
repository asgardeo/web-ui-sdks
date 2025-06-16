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

import {FC, PropsWithChildren, ReactNode, useEffect, useState} from 'react';
import isSignedIn from '../../../../server/actions/isSignedIn';

/**
 * Props interface of {@link SignedIn}
 */
export interface SignedInProps {
  /**
   * Content to show when the user is not signed in.
   */
  fallback?: ReactNode;
}

/**
 * A component that only renders its children when the user is signed in.
 *
 * @example
 * ```tsx
 * import { SignedIn } from '@asgardeo/auth-next';
 *
 * const App = () => {
 *   return (
 *     <SignedIn fallback={<p>Please sign in to continue</p>}>
 *       <p>Welcome! You are signed in.</p>
 *     </SignedIn>
 *   );
 * }
 * ```
 */
const SignedIn: FC<PropsWithChildren<SignedInProps>> = ({
  children,
  fallback = null,
}: PropsWithChildren<SignedInProps>) => {
  const [isSignedInSync, setIsSignedInSync] = useState<boolean | null>(null);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const result: boolean = await isSignedIn();

        setIsSignedInSync(result);
      } catch (error) {
        setIsSignedInSync(false);
      }
    })();
  }, []);

  if (isSignedInSync === null) return null;

  return <>{isSignedInSync ? children : fallback}</>;
};

export default SignedIn;
