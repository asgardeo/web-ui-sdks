/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {Button, ButtonProps} from '@oxygen-ui/react';
import clsx from 'clsx';
import {ElementType, ForwardRefExoticComponent, MutableRefObject, ReactElement, forwardRef} from 'react';
import {WithWrapperProps} from '../models/component';
import './sign-in-button.scss';

export type SignInButtonProps<C extends ElementType = ElementType> = {
  component?: C;
  social?: boolean;
} & Omit<ButtonProps, 'component'>;

const COMPONENT_NAME: string = 'SignInButton';

const SignInButton: ForwardRefExoticComponent<SignInButtonProps> & WithWrapperProps = forwardRef(
  <C extends ElementType>(props: SignInButtonProps<C>, ref: MutableRefObject<HTMLButtonElement>): ReactElement => {
    const {className, variant, social, ...rest} = props;

    let classes: string = clsx(`Oxygen${COMPONENT_NAME}`, className);
    if (social) {
      classes = clsx(classes, `Oxygen${COMPONENT_NAME}-social`);
    }

    return <Button ref={ref} className={classes} fullWidth variant="contained" {...rest} />;
  },
) as ForwardRefExoticComponent<SignInButtonProps> & WithWrapperProps;

SignInButton.displayName = COMPONENT_NAME;
SignInButton.muiName = COMPONENT_NAME;

export default SignInButton;
