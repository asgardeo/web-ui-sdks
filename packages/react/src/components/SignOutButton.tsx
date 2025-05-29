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
 * Props passed to the render function
 */
export interface SignOutButtonRenderProps {
  /**
   * Function to initiate the sign-out process
   */
  signOut: () => Promise<void>;
  /**
   * Loading state during sign-out process
   */
  isLoading: boolean;
}

/**
 * Props interface for SignOutButton component
 */
export interface SignOutButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Render prop function that receives sign-out props, or traditional ReactNode children
   */
  children?: ((props: SignOutButtonRenderProps) => ReactNode) | ReactNode;
}

/**
 * SignOutButton component that supports both render props and traditional props patterns.
 *
 * @example Using render props pattern
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
 * @example Using traditional props pattern
 * ```tsx
 * <SignOutButton className="custom-button">Sign Out</SignOutButton>
 * ```
 */
const SignOutButton: FC<SignOutButtonProps> = forwardRef<HTMLButtonElement, SignOutButtonProps>(
  (
    {children = 'Sign Out', className, style, onClick, ...rest}: SignOutButtonProps,
    ref: Ref<HTMLButtonElement>,
  ): ReactElement => {
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

    if (typeof children === 'function') {
      return <>{children({signOut: handleSignOut, isLoading})}</>;
    }

    return (
      <button
        ref={ref}
        onClick={handleSignOut}
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

SignOutButton.displayName = 'SignOutButton';

export default SignOutButton;
