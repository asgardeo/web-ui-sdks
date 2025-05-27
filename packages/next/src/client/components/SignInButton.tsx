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
import useAsgardeo from '../hooks/useAsgardeo';

/**
 * Interface for SignInButton component props.
 */
export type SignInButtonProps = HTMLAttributes<HTMLButtonElement>;

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
const SignInButton: FC<PropsWithChildren<SignInButtonProps>> = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<SignInButtonProps>
>(
  (
    {children = 'Sign In', className, style, ...rest}: PropsWithChildren<SignInButtonProps>,
    ref: Ref<HTMLButtonElement>,
  ): ReactElement => {
    const {signIn} = useAsgardeo();

    const handleClick = async (): Promise<void> => {
      try {
        await signIn();
      } catch (error) {
        throw new Error(`Sign in failed: ${JSON.stringify(error)}`);
      }
    };

    return (
      <button ref={ref} onClick={handleClick} className={className} style={style} type="button" {...rest}>
        {children}
      </button>
    );
  },
);

export default SignInButton;
