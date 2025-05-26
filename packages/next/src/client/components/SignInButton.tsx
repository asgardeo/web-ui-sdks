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

// import {SignInButton as ReactSignInButton} from '@asgardeo/react';
import React, {ReactElement} from 'react';
import useAsgardeo from '../hooks/useAsgardeo';

export interface SignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Additional parameters to pass to the sign-in request
   */
  params?: Record<string, string>;
}

/**
 * A button component that triggers the Asgardeo sign-in flow in Next.js applications.
 * Wraps the React SignInButton with Next.js specific functionality.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SignInButton>Sign In</SignInButton>
 *
 * // With custom styling
 * <SignInButton className="my-button" style={{ padding: '1rem' }}>
 *   Login with Asgardeo
 * </SignInButton>
 *
 * // With additional auth params
 * <SignInButton params={{ prompt: 'login' }}>
 *   Sign In
 * </SignInButton>
 * ```
 */
export function SignInButton({children, params, ...props}: SignInButtonProps): ReactElement {
  const {signIn} = useAsgardeo();

  const handleSignIn = async (): Promise<void> => {
    await signIn();
  };

  return (
    <button onClick={handleSignIn} {...props}>
      {children}
    </button>
  );
}
