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
 * Common props shared by all {@link BaseSignUpButton} components.
 */
export interface CommonBaseSignUpButtonProps {
  /**
   * Function to initiate the sign-up process
   */
  signUp?: () => Promise<void>;
  /**
   * Loading state during sign-up process
   */
  isLoading?: boolean;
}

/**
 * Props passed to the render function of {@link BaseSignUpButton}
 */
export type BaseSignUpButtonRenderProps = CommonBaseSignUpButtonProps;

/**
 * Props interface of {@link BaseSignUpButton}
 */
export interface BaseSignUpButtonProps
  extends CommonBaseSignUpButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Render prop function that receives sign-up props, or traditional ReactNode children
   */
  children?: ((props: BaseSignUpButtonRenderProps) => ReactNode) | ReactNode;
}

/**
 * Base SignUpButton component that supports both render props and traditional props patterns.
 *
 * @example Using render props
 * ```tsx
 * <BaseSignUpButton>
 *   {({ signUp, isLoading }) => (
 *     <button onClick={signUp} disabled={isLoading}>
 *       {isLoading ? 'Creating account...' : 'Create Account'}
 *     </button>
 *   )}
 * </BaseSignUpButton>
 * ```
 *
 * @example Using traditional props
 * ```tsx
 * <BaseSignUpButton className="custom-button">Create Account</BaseSignUpButton>
 * ```
 */
const BaseSignUpButton: ForwardRefExoticComponent<BaseSignUpButtonProps & RefAttributes<HTMLButtonElement>> =
  forwardRef<HTMLButtonElement, BaseSignUpButtonProps>(
    (
      {children, className, style, signUp, isLoading, ...rest}: BaseSignUpButtonProps,
      ref: Ref<HTMLButtonElement>,
    ): ReactElement => {
      if (typeof children === 'function') {
        return <>{children({signUp, isLoading})}</>;
      }

      return (
        <button
          ref={ref}
          className={clsx(withVendorCSSClassPrefix('sign-up-button'), className)}
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

BaseSignUpButton.displayName = 'BaseSignUpButton';

export default BaseSignUpButton;
