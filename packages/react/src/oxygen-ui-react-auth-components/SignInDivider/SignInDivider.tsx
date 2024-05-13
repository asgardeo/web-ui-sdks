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

import {Divider, DividerProps} from '@oxygen-ui/react';
import clsx from 'clsx';
import {ElementType, ForwardRefExoticComponent, MutableRefObject, ReactElement, forwardRef} from 'react';
import {WithWrapperProps} from '../models/component';
import './sign-in-divider.scss';

export type SignInDividerProps<C extends ElementType = ElementType> = {
  component?: C;
} & Omit<DividerProps, 'component'>;

const COMPONENT_NAME: string = 'SignInDivider';

const SignInDivider: ForwardRefExoticComponent<SignInDividerProps> & WithWrapperProps = forwardRef(
  <C extends ElementType>(props: SignInDividerProps<C>, ref: MutableRefObject<HTMLHRElement>): ReactElement => {
    const {className, ...rest} = props;

    const classes: string = clsx(`Oxygen${COMPONENT_NAME}`, className);

    return <Divider ref={ref} className={classes} {...rest} />;
  },
) as ForwardRefExoticComponent<SignInDividerProps> & WithWrapperProps;

SignInDivider.displayName = COMPONENT_NAME;
SignInDivider.muiName = COMPONENT_NAME;

export default SignInDivider;
