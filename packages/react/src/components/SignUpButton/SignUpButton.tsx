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
import useAsgardeo from '../../hooks/useAsgardeo';
import BaseSignUpButton, {BaseSignUpButtonProps} from './BaseSignUpButton';

/**
 * Props interface of {@link SignUpButton}
 */
export type SignUpButtonProps = BaseSignUpButtonProps;

/**
 * SignUpButton component that supports both render props and traditional props patterns.
 * It redirects the user to the Asgardeo sign-up page configured for the application.
 *
 * @example Using render props pattern
 * ```tsx
 * <SignUpButton>
 *   {({ signUp, isLoading }) => (
 *     <button onClick={signUp} disabled={isLoading}>
 *       {isLoading ? 'Creating Account...' : 'Create Account'}
 *     </button>
 *   )}
 * </SignUpButton>
 * ```
 *
 * @example Using traditional props pattern
 * ```tsx
 * <SignUpButton className="custom-button">Create Account</SignUpButton>
 * ```
 */
const SignUpButton: ForwardRefExoticComponent<SignUpButtonProps & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  SignUpButtonProps
>(({children = 'Sign Up', onClick, ...rest}: SignUpButtonProps, ref: Ref<HTMLButtonElement>): ReactElement => {
  const {signUp} = useAsgardeo();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e?: MouseEvent<HTMLButtonElement>): Promise<void> => {
    try {
      setIsLoading(true);
      await signUp();

      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      throw new Error(`Sign up failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseSignUpButton ref={ref} onClick={handleSignUp} isLoading={isLoading} signUp={handleSignUp} {...rest}>
      {children}
    </BaseSignUpButton>
  );
});

SignUpButton.displayName = 'SignUpButton';

export default SignUpButton;
