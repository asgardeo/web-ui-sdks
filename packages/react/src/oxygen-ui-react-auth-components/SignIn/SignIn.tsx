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

import {Box, BoxProps} from '@oxygen-ui/react';
import clsx from 'clsx';
import {ElementType, ForwardRefExoticComponent, MutableRefObject, ReactElement, forwardRef} from 'react';
import {WithWrapperProps} from '../models/component';
import SignInAlert from '../SignInAlert/SignInAlert';
import SignInButton from '../SignInButton/SignInButton';
import SignInDivider from '../SignInDivider/SignInDivider';
import SignInLink from '../SignInLink/SignInLink';
import SignInPaper from '../SignInPaper/SignInPaper';
import SignInTextField from '../SignInTextField/SignInTextField';
import SignInTypography from '../SignInTypography/SignInTypography';

export type SignInProps<C extends ElementType = ElementType> = {
  component?: C;
} & Omit<BoxProps, 'component'>;

type SignInCompoundProps = {
  Alert: typeof SignInAlert;
  Button: typeof SignInButton;
  Divider: typeof SignInDivider;
  Link: typeof SignInLink;
  Paper: typeof SignInPaper;
  TextField: typeof SignInTextField;
  Typography: typeof SignInTypography;
};

const COMPONENT_NAME: string = 'SignIn';

const SignIn: ForwardRefExoticComponent<SignInProps> & WithWrapperProps & SignInCompoundProps = forwardRef(
  <C extends ElementType>(props: SignInProps<C>, ref: MutableRefObject<HTMLHRElement>): ReactElement => {
    const {className, ...rest} = props;

    const classes: string = clsx(`Oxygen${COMPONENT_NAME}`, className);

    return <Box ref={ref} className={classes} {...rest} />;
  },
) as ForwardRefExoticComponent<SignInProps> & WithWrapperProps & SignInCompoundProps;

SignIn.displayName = COMPONENT_NAME;
SignIn.muiName = COMPONENT_NAME;

SignIn.Typography = SignInTypography;
SignIn.Paper = SignInPaper;
SignIn.Alert = SignInAlert;
SignIn.Divider = SignInDivider;
SignIn.Link = SignInLink;
SignIn.Button = SignInButton;
SignIn.TextField = SignInTextField;

export default SignIn;
