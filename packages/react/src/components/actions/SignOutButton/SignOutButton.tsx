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

import {FC, forwardRef, ForwardRefExoticComponent, MouseEvent, ReactElement, Ref, RefAttributes, useState} from 'react';
import useAsgardeo from '../../../hooks/useAsgardeo';
import BaseSignOutButton, {BaseSignOutButtonProps} from './BaseSignOutButton';

/**
 * Props interface of {@link SignOutButton}
 */
export type SignOutButtonProps = BaseSignOutButtonProps;

/**
 * SignOutButton component that supports both render props and traditional props patterns.
 *
 * @example Using render props pattern
 * ```tsx
 * <SignOutButton>
 *   {({signOut, isLoading}) => (
 *     <button onClick={signOut} disabled={isLoading}>
 *       {isLoading ? 'Signing out...' : 'Sign Out'}
 *     </button>
 *   )}
 * </SignOutButton>
 * ```
 *
 * @example Using traditional props pattern
 * ```tsx
 * <SignOutButton className="custom-button">Sign Out</SignOutButton>
 * ```
 */
const SignOutButton: ForwardRefExoticComponent<SignOutButtonProps & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  SignOutButtonProps
>(({children = 'Sign Out', onClick, ...rest}: SignOutButtonProps, ref: Ref<HTMLButtonElement>): ReactElement => {
  const {signOut} = useAsgardeo();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async (e?: MouseEvent<HTMLButtonElement>): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut();

      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      throw new Error(`Sign out failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseSignOutButton ref={ref} onClick={handleSignOut} isLoading={isLoading} signOut={handleSignOut} {...rest}>
      {children}
    </BaseSignOutButton>
  );
});

SignOutButton.displayName = 'SignOutButton';

export default SignOutButton;
