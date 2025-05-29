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

import {FC, forwardRef, HTMLAttributes, PropsWithChildren, ReactElement, Ref} from 'react';
import InternalAuthAPIRoutesConfig from '../configs/InternalAuthAPIRoutesConfig';

/**
 * Interface for SignInButton component props.
 */
export type SignUpButtonProps = HTMLAttributes<HTMLButtonElement>;

/**
 * SignInButton component. This button initiates the sign-in process when clicked.
 *
 * @example
 * ```tsx
 * import { SignInButton } from '@asgardeo/auth-react';
 *
 * const App = () => {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *   return (
 *     <SignInButton ref={buttonRef} className="custom-class" style={{ backgroundColor: 'blue' }}>
 *       Sign In
 *     </SignInButton>
 *   );
 * }
 * ```
 */
const SignUpButton: FC<PropsWithChildren<SignUpButtonProps>> = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<SignUpButtonProps>
>(
  (
    {children = 'Sign Up', className, style, ...rest}: PropsWithChildren<SignUpButtonProps>,
    ref: Ref<HTMLButtonElement>,
  ): ReactElement => (
    <form action={InternalAuthAPIRoutesConfig.signUp}>
      <button ref={ref} className={className} style={style} type="submit" {...rest}>
        {children}
      </button>
    </form>
  ),
);

export default SignUpButton;
