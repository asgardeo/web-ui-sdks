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

import {Paper, PaperProps} from '@oxygen-ui/react';
import clsx from 'clsx';
import {ElementType, ForwardRefExoticComponent, MutableRefObject, ReactElement, forwardRef} from 'react';
import {WithWrapperProps} from '../models/component';
import pascalCaseToKebabCase from '../utils/pascal-case-to-kebab-case';
import './sign-in-paper.scss';

export type SignInPaperProps<C extends ElementType = ElementType> = {
  component?: C;
} & Omit<PaperProps, 'component'>;

const COMPONENT_NAME: string = 'SignInPaper';

const SignInPaper: ForwardRefExoticComponent<SignInPaperProps> & WithWrapperProps = forwardRef(
  <C extends ElementType>(props: SignInPaperProps<C>, ref: MutableRefObject<HTMLDivElement>): ReactElement => {
    const {className, variant, ...rest} = props;

    const classes: string = clsx(`oxygen-${pascalCaseToKebabCase(COMPONENT_NAME)}`, className);

    const extendedVariant: string = variant || 'outlined';

    return <Paper ref={ref} className={classes} variant={extendedVariant} {...rest} />;
  },
) as ForwardRefExoticComponent<SignInPaperProps> & WithWrapperProps;

SignInPaper.displayName = COMPONENT_NAME;
SignInPaper.muiName = COMPONENT_NAME;

export default SignInPaper;
