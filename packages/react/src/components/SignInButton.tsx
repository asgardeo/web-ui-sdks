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

import {FC, forwardRef, HTMLAttributes, MouseEvent, ReactElement, ReactNode, Ref, useState} from 'react';
import useAsgardeo from '../hooks/useAsgardeo';

/**
 * Props passed to the render function of {@link SignedIn}
 */
export interface SignInRenderProps {
  /**
   * Function to initiate the sign-in process
   */
  signIn: () => Promise<void>;
  /**
   * Loading state during sign-in process
   */
  isLoading: boolean;
}

/**
 * Props interface of {@link SignInButton}
 */
export interface SignInButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Render prop function that receives sign-in props, or traditional ReactNode children
   */
  children?: ((props: SignInRenderProps) => ReactNode) | ReactNode;
}

/**
 * SignInButton component that supports both render props and traditional props patterns.
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
const SignInButton: FC<SignInButtonProps> = forwardRef<HTMLButtonElement, SignInButtonProps>(
  (
    {children = 'Sign In', className, style, onClick, ...rest}: SignInButtonProps,
    ref: Ref<HTMLButtonElement>,
  ): ReactElement => {
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

    if (typeof children === 'function') {
      return <>{children({signIn: handleSignIn, isLoading})}</>;
    }

    return (
      <button
        ref={ref}
        onClick={handleSignIn}
        className={className}
        style={style}
        disabled={isLoading}
        type="button"
        {...rest}
      >
        {children}
      </button>
    );
  },
);

SignInButton.displayName = 'SignInButton';

export default SignInButton;
