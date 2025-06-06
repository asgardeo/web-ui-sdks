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

import {forwardRef, ForwardRefExoticComponent, MouseEvent, ReactElement, Ref, RefAttributes, useState} from 'react';
import useAsgardeo from '../../../hooks/useAsgardeo';
import BaseSignInButton, {BaseSignInButtonProps} from './BaseSignInButton';

/**
 * Props interface of {@link SignInButton}
 */
export type SignInButtonProps = BaseSignInButtonProps;

/**
 * SignInButton component that supports both render props and traditional props patterns.
 *
 * @remarks This component is only supported in browser based React applications (CSR).
 *
 * @example Using render props
 * ```tsx
 * <SignInButton>
 *   {({ handleSignIn, isLoading }) => (
 *     <button onClick={handleSignIn} disabled={isLoading}>
 *       {isLoading ? 'Signing in...' : 'Sign In'}
 *     </button>
 *   )}
 * </SignInButton>
 * ```
 *
 * @example Using traditional props
 * ```tsx
 * <SignInButton className="custom-button">Sign In</SignInButton>
 * ```
 */
const SignInButton: ForwardRefExoticComponent<SignInButtonProps & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  SignInButtonProps
>(({children = 'Sign In', onClick, ...rest}: SignInButtonProps, ref: Ref<HTMLButtonElement>): ReactElement => {
  const {signIn} = useAsgardeo();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e?: MouseEvent<HTMLButtonElement>): Promise<void> => {
    try {
      setIsLoading(true);

      await signIn();

      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      throw new Error(`Sign in failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseSignInButton ref={ref} onClick={handleSignIn} isLoading={isLoading} signIn={handleSignIn} {...rest}>
      {children}
    </BaseSignInButton>
  );
});

SignInButton.displayName = 'SignInButton';

export default SignInButton;
