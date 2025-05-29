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

import {BaseSignOutButton, SignInButtonProps} from '@asgardeo/react';
import {FC, forwardRef, HTMLAttributes, PropsWithChildren, ReactElement, Ref} from 'react';

/**
 * Props interface of {@link SignOutButton}
 */
export type SignOutButtonProps = SignOutButtonProps;

/**
 * SignOutButton component that supports both render props and traditional props patterns.
 *
 * @example Using render props
 * ```tsx
 * <SignOutButton>
 *   {({ handleSignOut, isLoading }) => (
 *     <button onClick={handleSignOut} disabled={isLoading}>
 *       {isLoading ? 'Signing out...' : 'Sign Out'}
 *     </button>
 *   )}
 * </SignOutButton>
 * ```
 *
 * @example Using traditional props
 * ```tsx
 * <SignOutButton className="custom-button">Sign Out</SignOutButton>
 * ```
 */
const SignOutButton: FC<PropsWithChildren<SignOutButtonProps>> = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<SignOutButtonProps>
>(
  (
    {children = 'Sign Out', ...rest}: PropsWithChildren<SignOutButtonProps>,
    ref: Ref<HTMLButtonElement>,
  ): ReactElement => (
    <form action="/api/auth/sign-out">
      <BaseSignOutButton type="submit" {...rest}>
        {children}
      </BaseSignOutButton>
    </form>
  ),
);

SignOutButton.displayName = 'SignOutButton';

export default SignOutButton;
