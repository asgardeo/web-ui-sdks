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

import {FC, forwardRef, HTMLAttributes, PropsWithChildren, ReactElement, Ref} from 'react';
import useAsgardeo from '../hooks/useAsgardeo';

/**
 * Interface for SignUpButton component props.
 */
export type SignUpButtonProps = HTMLAttributes<HTMLButtonElement>;

/**
 * SignUpButton component. This button initiates the sign-up process when clicked.
 * It redirects the user to the Asgardeo sign-up page configured for the application.
 *
 * @example
 * ```tsx
 * import { SignUpButton } from '@asgardeo/auth-react';
 *
 * const App = () => {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *   return (
 *     <SignUpButton ref={buttonRef} className="custom-class" style={{ backgroundColor: 'green' }}>
 *       Create Account
 *     </SignUpButton>
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
  ): ReactElement => {
    const {signUp} = useAsgardeo();

    const handleClick = async (): Promise<void> => {
      try {
        await signUp();
      } catch (error) {
        throw new Error(`Sign up failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    return (
      <button ref={ref} onClick={handleClick} className={className} style={style} type="button" {...rest}>
        {children}
      </button>
    );
  },
);

export default SignUpButton;
