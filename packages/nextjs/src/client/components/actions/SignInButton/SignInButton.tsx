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

import {forwardRef, ForwardRefExoticComponent, ReactElement, Ref, RefAttributes} from 'react';
import InternalAuthAPIRoutesConfig from '../../../../configs/InternalAuthAPIRoutesConfig';
import {BaseSignInButton, BaseSignInButtonProps} from '@asgardeo/react';

/**
 * Props interface of {@link SignInButton}
 */
export type SignInButtonProps = BaseSignInButtonProps;

/**
 * SignInButton component that supports both render props and traditional props patterns for Next.js.
 *
 * @example Using render props
 * ```tsx
 * <SignInButton>
 *   {({isLoading}) => (
 *     <button type="submit" disabled={isLoading}>
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
 *
 * @remarks
 * In Next.js with server actions, the sign-in is handled via form submission.
 * When using render props, the custom button should use `type="submit"` instead of `onClick={signIn}`.
 * The `signIn` function in render props is provided for API consistency but should not be used directly.
 */
const SignInButton = forwardRef<HTMLButtonElement, SignInButtonProps>(
  ({className, style, ...rest}: SignInButtonProps, ref: Ref<HTMLButtonElement>): ReactElement => {
    return (
      <form action={InternalAuthAPIRoutesConfig.signIn}>
        <BaseSignInButton className={className} style={style} ref={ref} type="submit" {...rest} />
      </form>
    );
  },
);

SignInButton.displayName = 'SignInButton';

export default SignInButton;
