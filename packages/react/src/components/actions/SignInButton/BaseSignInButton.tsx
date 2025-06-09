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

import {
  ButtonHTMLAttributes,
  forwardRef,
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
  Ref,
  RefAttributes,
} from 'react';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';

/**
 * Common props shared by all {@link BaseSignInButton} components.
 */
export interface CommonBaseSignInButtonProps {
  /**
   * Function to initiate the sign-in process
   */
  signIn: () => Promise<void>;
  /**
   * Loading state during sign-in process
   */
  isLoading?: boolean;
}

/**
 * Props passed to the render function of {@link BaseSignInButton}
 */
export type BaseSignInButtonRenderProps = CommonBaseSignInButtonProps;

/**
 * Props interface of {@link BaseSignInButton}
 */
export interface BaseSignInButtonProps
  extends Partial<CommonBaseSignInButtonProps>,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Render prop function that receives sign-in props, or traditional ReactNode children
   */
  children?: ((props: BaseSignInButtonRenderProps) => ReactNode) | ReactNode;
}

/**
 * Base SignInButton component that supports both render props and traditional props patterns.
 *
 * @example Using render props
 * ```tsx
 * <BaseSignInButton>
 *   {({signIn, isLoading}) => (
 *     <button onClick={signIn} disabled={isLoading}>
 *       {isLoading ? 'Signing in...' : 'Sign In'}
 *     </button>
 *   )}
 * </BaseSignInButton>
 * ```
 *
 * @example Using traditional props
 * ```tsx
 * <BaseSignInButton className="custom-button">Sign In</BaseSignInButton>
 * ```
 */
const BaseSignInButton: ForwardRefExoticComponent<BaseSignInButtonProps & RefAttributes<HTMLButtonElement>> =
  forwardRef<HTMLButtonElement, BaseSignInButtonProps>(
    (
      {children, className, style, signIn, isLoading, ...rest}: BaseSignInButtonProps,
      ref: Ref<HTMLButtonElement>,
    ): ReactElement => {
      if (typeof children === 'function') {
        return <>{children({signIn, isLoading})}</>;
      }

      return (
        <button
          ref={ref}
          className={clsx(withVendorCSSClassPrefix('sign-in-button'), className)}
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

BaseSignInButton.displayName = 'BaseSignInButton';

export default BaseSignInButton;
