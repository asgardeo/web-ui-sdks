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

import {Alert} from '@oxygen-ui/react';
import clsx from 'clsx';
import {ElementType, ForwardRefExoticComponent, MutableRefObject, ReactElement, forwardRef} from 'react';
import {WithWrapperProps} from '../models/component';
import pascalCaseToKebabCase from '../utils/pascal-case-to-kebab-case';
import './sign-in-alert.scss';

// TODO: AlertProps is not available in oxygen-ui/react
export type SignInAlertProps<C extends ElementType = ElementType> = {
  component?: C;
  error?: boolean;
};

const COMPONENT_NAME: string = 'SignInAlert';

const SignInAlert: ForwardRefExoticComponent<SignInAlertProps> & WithWrapperProps = forwardRef(
  <C extends ElementType>(props: SignInAlertProps<C>, ref: MutableRefObject<HTMLHRElement>): ReactElement => {
    const {className, error, color, icon, ...rest} = props;

    const classes: string = clsx(`oxygen-${pascalCaseToKebabCase(COMPONENT_NAME)}`, className);

    const extendedColor: string = color || (error ? 'error' : 'error');

    const extendedIcon: Node | boolean = icon || false;

    return <Alert ref={ref} className={classes} color={extendedColor} icon={extendedIcon} {...rest} />;
  },
) as ForwardRefExoticComponent<SignInAlertProps> & WithWrapperProps;

SignInAlert.displayName = COMPONENT_NAME;
SignInAlert.muiName = COMPONENT_NAME;

export default SignInAlert;
