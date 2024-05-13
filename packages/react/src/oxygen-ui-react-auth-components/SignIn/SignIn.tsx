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
import {
  ElementType,
  ForwardRefExoticComponent,
  MutableRefObject,
  ReactElement,
  forwardRef,
  isValidElement,
} from 'react';
import {WithWrapperProps} from '../models/component';
import SignInAlert from '../SignInAlert/SignInAlert';
import SignInButton, {SignInButtonProps} from '../SignInButton/SignInButton';
import SignInDivider from '../SignInDivider/SignInDivider';
import SignInFooter from '../SignInFooter/SignInFooter';
import SignInImage from '../SignInImage/SignInImage';
import SignInLink, {SignInLinkProps} from '../SignInLink/SignInLink';
import SignInPaper from '../SignInPaper/SignInPaper';
import SignInPinInput from '../SignInPinInput/SignInPinInput';
import SignInTextField, {SignInTextFieldProps} from '../SignInTextField/SignInTextField';
import SignInTypography, {SignInTypographyProps} from '../SignInTypography/SignInTypography';
import './sign-in.scss';

type Footer =
  | ReactElement
  | {
      copyrights?: {
        link?: string;
        text: string;
      };
      locale?: {
        text: string;
      };
      privacyPolicy?: {
        link?: string;
        text: string;
      };
      termsOfUse?: {
        link?: string;
        text: string;
      };
    };

export type SignInProps<C extends ElementType = ElementType> = {
  component?: C;
  footer?: Footer;
  links?: SignInLinkProps[];
  loginOptions?: SignInButtonProps[];
  logo?: string;
  submitButton?: {text: string} & SignInButtonProps;
  subtitle?: {text: string} & SignInTypographyProps;
  textFields?: SignInTextFieldProps[];
  title?: {text: string} & SignInTypographyProps;
} & Omit<BoxProps, 'component'>;

type SignInCompoundProps = {
  Alert: typeof SignInAlert;
  Button: typeof SignInButton;
  Divider: typeof SignInDivider;
  Footer: typeof SignInFooter;
  Image: typeof SignInImage;
  Link: typeof SignInLink;
  Paper: typeof SignInPaper;
  PinInput: typeof SignInPinInput;
  TextField: typeof SignInTextField;
  Typography: typeof SignInTypography;
};

const COMPONENT_NAME: string = 'SignIn';

const renderTextFields = (textFields: SignInTextFieldProps[]): ReactElement[] =>
  textFields.map((textFieldProps: SignInTextFieldProps, index: number) => (
    <SignInTextField key={`sign-in-text-field${index + 1}`} {...textFieldProps} />
  ));

const renderLinks = (links: SignInLinkProps[]): ReactElement[] =>
  links.map((linkProps: SignInLinkProps, index: number) => (
    <div key={`sign-in-link-holder${index + 1}`}>
      <SignInLink {...linkProps} />
      <br />
    </div>
  ));

const renderLoginOptions = (loginOptions: SignInButtonProps[]): ReactElement[] =>
  loginOptions.map((loginOptionProps: SignInButtonProps, index: number) => (
    <SignInButton key={`sign-in-button-social${index + 1}`} social {...loginOptionProps} />
  ));

const SignIn: ForwardRefExoticComponent<SignInProps> & WithWrapperProps & SignInCompoundProps = forwardRef(
  <C extends ElementType>(props: SignInProps<C>, ref: MutableRefObject<HTMLHRElement>): ReactElement => {
    const {
      className,
      title,
      subtitle,
      textFields = [
        {
          label: 'username',
          name: 'text',
          placeholder: 'Enter your username',
        },
        {
          label: 'Password',
          name: 'password',
          placeholder: 'Enter your password',
          type: 'password',
        },
      ],
      links,
      loginOptions,
      logo,
      submitButton,
      footer,
      ...rest
    } = props;

    const classes: string = clsx(`Oxygen${COMPONENT_NAME}`, className);

    /**
     * Destructure the title and subtitle props to extract the title and subtitle as both cannot be passed.
     */
    const {
      children: titleChildren,
      text: titleText,
      title: titleTitle,
      subtitle: titleSubtitle,
      ...restTitleProps
    } = title ?? {};

    const {
      children: subtitleChildren,
      text: subtitleText,
      title: subtitleTitle,
      subtitle: subtitleSubtitle,
      ...restSubtitleProps
    } = subtitle ?? {};

    const {children: submitButtonChildren, text: submitButtonText, ...restSubmitButtonTextProps} = submitButton ?? {};

    /**
     * If SignIn component contains any children render only the outer box.
     * Otherwise render the default SignIn component.
     */
    if (props?.['children']) {
      return <Box ref={ref} className={classes} {...rest} />;
    }

    return (
      <Box ref={ref} className={classes} {...rest}>
        {logo && <SignInImage src={logo} />}

        <SignInPaper>
          <SignInTypography title {...restTitleProps}>
            {titleChildren ?? titleText ?? 'Sign In'}
          </SignInTypography>

          {subtitle && (
            <SignInTypography subtitle {...restSubtitleProps}>
              {subtitleChildren ?? subtitleText}
            </SignInTypography>
          )}

          {renderTextFields(textFields)}

          <SignInButton {...restSubmitButtonTextProps}>
            {submitButtonChildren ?? submitButtonText ?? 'Sign In'}
          </SignInButton>

          {links && renderLinks(links)}

          {loginOptions && (
            <>
              <SignInDivider>OR</SignInDivider>
              {renderLoginOptions(loginOptions)}
            </>
          )}
        </SignInPaper>

        {footer && isValidElement(footer) ? (
          footer
        ) : (
          <SignInFooter
            copyrights={{children: <SignInLink href={footer?.copyrights?.link}>{footer?.copyrights?.text}</SignInLink>}}
            items={[
              {children: <SignInLink href={footer?.termsOfUse?.link}>{footer?.termsOfUse?.text}</SignInLink>},
              {children: <SignInLink href={footer?.privacyPolicy?.link}>{footer?.privacyPolicy?.text}</SignInLink>},
              {children: <SignInTypography>{footer?.locale?.text}</SignInTypography>},
            ]}
          />
        )}
      </Box>
    );
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
SignIn.PinInput = SignInPinInput;
SignIn.Image = SignInImage;
SignIn.Footer = SignInFooter;

export default SignIn;
