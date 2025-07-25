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

import {FC, forwardRef, ReactElement, Ref, useState, MouseEvent} from 'react';
import {BaseSignOutButton, BaseSignOutButtonProps, useTranslation} from '@asgardeo/react';
import useAsgardeo from '../../../../client/contexts/Asgardeo/useAsgardeo';
import logger from '../../../../utils/logger';

/**
 * Interface for SignInButton component props.
 */
export type SignOutButtonProps = BaseSignOutButtonProps;

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
const SignOutButton = forwardRef<HTMLButtonElement, SignOutButtonProps>(
  (
    {className, style, preferences, onClick, children, ...rest}: SignOutButtonProps,
    ref: Ref<HTMLButtonElement>,
  ): ReactElement => {
    const {signOut} = useAsgardeo();
    const {t} = useTranslation(preferences?.i18n);

    const [isLoading, setIsLoading] = useState(false);

    const handleOnClick = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
      try {
        setIsLoading(true);

        logger.debug('[SignOutButton] Initiating a sign-out from a button click');

        await signOut();

        if (onClick) {
          onClick(e);
        }
      } catch (error) {
        logger.error('[SignOutButton] Error occurred initiating sign-out from a button click:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <BaseSignOutButton ref={ref} onClick={handleOnClick} isLoading={isLoading} preferences={preferences} {...rest}>
        {children ?? t('elements.buttons.signOut')}
      </BaseSignOutButton>
    );
  },
);

export default SignOutButton;
