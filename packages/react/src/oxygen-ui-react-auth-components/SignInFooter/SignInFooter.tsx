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

import {Grid, GridProps} from '@oxygen-ui/react';
import clsx from 'clsx';
import {ElementType, ForwardRefExoticComponent, MutableRefObject, ReactElement, forwardRef} from 'react';
import {WithWrapperProps} from '../models/component';
import SignInLink from '../SignInLink/SignInLink';
import SignInTypography from '../SignInTypography/SignInTypography';
import './sign-in-footer.scss';

const COMPONENT_NAME: string = 'SignInFooter';

export type SignInFooterProps<C extends ElementType = ElementType> = {
  component?: C;
} & Omit<GridProps, 'component'>;

// TODO: Handling props for the component
const SignInFooter: ForwardRefExoticComponent<SignInFooterProps> & WithWrapperProps = forwardRef(
  <C extends ElementType>(props: SignInFooterProps<C>, ref: MutableRefObject<HTMLDivElement>): ReactElement => {
    const year: number = new Date().getFullYear();

    const {className, ...rest} = props;

    const classes: string = clsx(`Oxygen${COMPONENT_NAME}`, className);

    return (
      <Grid className={classes} container direction="column" alignItems="center" ref={ref} {...rest}>
        <Grid>
          <SignInTypography>© {year} WSO2 LLC.</SignInTypography>
        </Grid>
        <Grid container justifyContent="space-between" xs={12}>
          <Grid>
            <SignInLink>Terms of Use</SignInLink>
          </Grid>
          <Grid>
            <SignInLink>Privacy Policy</SignInLink>
          </Grid>
          <Grid>
            <SignInTypography>en-US</SignInTypography>
          </Grid>
        </Grid>
      </Grid>
    );
  },
) as ForwardRefExoticComponent<SignInFooterProps> & WithWrapperProps;

export default SignInFooter;
