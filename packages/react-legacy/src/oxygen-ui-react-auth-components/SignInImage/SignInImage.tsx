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

import clsx from 'clsx';
import {ForwardRefExoticComponent, ImgHTMLAttributes, MutableRefObject, ReactElement, forwardRef} from 'react';
import {WithWrapperProps} from '../models/component';
import './sign-in-image.scss';

export type SignInImageProps = ImgHTMLAttributes<HTMLImageElement>;

const COMPONENT_NAME: string = 'SignInImage';

const SignInImage: ForwardRefExoticComponent<SignInImageProps> & WithWrapperProps = forwardRef(
  (props: SignInImageProps, ref: MutableRefObject<HTMLImageElement>): ReactElement => {
    const {className, alt, ...rest} = props;

    const classes: string = clsx(`Oxygen${COMPONENT_NAME}`, className);

    return <img alt={alt} ref={ref} className={classes} {...rest} />;
  },
) as ForwardRefExoticComponent<SignInImageProps> & WithWrapperProps;

SignInImage.displayName = COMPONENT_NAME;
SignInImage.muiName = COMPONENT_NAME;

export default SignInImage;
