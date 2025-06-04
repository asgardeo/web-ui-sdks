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
  forwardRef,
  ForwardRefExoticComponent,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  RefAttributes,
} from 'react';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';

/**
 * Common props shared by all {@link BaseSignOutButton} components.
 */
export interface CommonBaseSignOutButtonProps {
  /**
   * Function to initiate the sign-out process
   */
  signOut?: () => Promise<void>;
  /**
   * Loading state during sign-out process
   */
  isLoading?: boolean;
}

/**
 * Props passed to the render function of {@link BaseSignOutButton}
 */
export type BaseSignOutButtonRenderProps = CommonBaseSignOutButtonProps;

/**
 * Props interface of {@link BaseSignOutButton}
 */
export interface BaseSignOutButtonProps
  extends CommonBaseSignOutButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Render prop function that receives sign-out props, or traditional ReactNode children
   */
  children?: ((props: BaseSignOutButtonRenderProps) => ReactNode) | ReactNode;
}

/**
 * Base SignOutButton component that supports both render props and traditional props patterns.
 *
 * @example Using render props
 * ```tsx
 * <BaseSignOutButton>
 *   {({ signOut, isLoading }) => (
 *     <button onClick={signOut} disabled={isLoading}>
 *       {isLoading ? 'Signing out...' : 'Sign Out'}
 *     </button>
 *   )}
 * </BaseSignOutButton>
 * ```
 *
 * @example Using traditional props
 * ```tsx
 * <BaseSignOutButton className="custom-button">Sign Out</BaseSignOutButton>
 * ```
 */
const BaseSignOutButton: ForwardRefExoticComponent<BaseSignOutButtonProps & RefAttributes<HTMLButtonElement>> =
  forwardRef<HTMLButtonElement, BaseSignOutButtonProps>(
    (
      {children, className, style, signOut, isLoading, ...rest}: BaseSignOutButtonProps,
      ref: Ref<HTMLButtonElement>,
    ): ReactElement => {
      if (typeof children === 'function') {
        return <>{children({signOut, isLoading})}</>;
      }

      return (
        <button
          ref={ref}
          className={clsx(withVendorCSSClassPrefix('sign-out-button'), className)}
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

BaseSignOutButton.displayName = 'BaseSignOutButton';

export default BaseSignOutButton;
