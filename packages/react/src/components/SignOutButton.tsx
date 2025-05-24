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

import {FC, forwardRef, HTMLAttributes, PropsWithChildren, Ref} from 'react';
import useAsgardeo from '../hooks/useAsgardeo';

/**
 * Interface for SignOutButton component props.
 */
export type SignOutButtonProps = HTMLAttributes<HTMLButtonElement>;

/**
 * SignOutButton component. This button initiates the sign-out process when clicked.
 *
 * @example
 * ```tsx
 * import { SignOutButton } from '@asgardeo/auth-react';
 *
 * const App = () => {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *   return (
 *     <SignOutButton ref={buttonRef} className="custom-class" style={{ backgroundColor: 'blue' }}>
 *       Sign Out
 *     </SignOutButton>
 *   );
 * }
 * ```
 */
const SignOutButton: FC<PropsWithChildren<SignOutButtonProps>> = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<SignOutButtonProps>
>(
  (
    {children = 'Sign Out', className, style, ...rest}: PropsWithChildren<SignOutButtonProps>,
    ref: Ref<HTMLButtonElement>,
  ) => {
    const {signOut} = useAsgardeo();

    const handleClick = async (): Promise<void> => {
      try {
        await signOut();
      } catch (error) {
        throw new Error(`Sign out failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    return (
      <button ref={ref} onClick={handleClick} className={className} style={style} type="button" {...rest}>
        {children}
      </button>
    );
  },
);

export default SignOutButton;
