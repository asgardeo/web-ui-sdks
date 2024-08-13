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

import {FC, FunctionComponent, ReactElement, useContext, useEffect, useState} from 'react';
import {AuthApiResponse, Branding, BrandingProps, PredefinedThemes} from '@asgardeo/js';

import {InferGetServerSidePropsType} from 'next';
import {getServerSideProps} from '@/pages';
import {SignInGeneric} from '@asgardeo/react';

export interface SignInProps {
  authResponse?: AuthApiResponse;
  basicAuthChildren?: ReactElement;
  brandingPreference?: Branding;
  brandingProps?: BrandingProps;
  emailOtpChildren?: ReactElement;
  identifierFirstChildren?: ReactElement;
  showFooter?: boolean;
  showLogo?: boolean;
  showSignUp?: boolean;
  smsOtpChildren?: ReactElement;
  totpChildren?: ReactElement;
}
interface Repo {
  authRes: string;
  authResponse: AuthApiResponse | undefined | null;
}
export const SignIn: FunctionComponent<SignInProps> = (props: SignInProps): ReactElement => {
  const {authResponse} = props;
  console.log('authResponse');
  console.log(authResponse);

  return (
    // <main>
    <>
      <p>repo</p>
      <p>blha {authResponse?.flowStatus} hh</p>
      <SignInGeneric
        authResponse={authResponse}
        brandingPreference={{
          preference: {
            urls: {
              cookiePolicyURL: '',
              privacyPolicyURL: '',
              termsOfUseURL: '',
            },
            theme: {
              activeTheme: PredefinedThemes.Light,
              LIGHT: {
                colors: {
                  primary: {main: '#111111'},
                  alerts: {
                    error: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                    info: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                    neutral: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                    warning: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                  },
                  background: {
                    body: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                    surface: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                  },
                  illustrations: {
                    accent1: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                    accent2: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                    accent3: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                    primary: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                    secondary: {
                      contrastText: '',
                      dark: '',
                      inverted: '',
                      light: '',
                      main: '#ffd8d8',
                    },
                  },
                  outlined: {
                    default: '',
                  },
                  secondary: {
                    contrastText: '',
                    dark: '',
                    inverted: '',
                    light: '',
                    main: '#ffd8d8',
                  },
                  text: {
                    primary: '',
                    secondary: '',
                  },
                },
                buttons: {
                  externalConnection: {
                    base: {
                      background: {
                        backgroundColor: '#FFFFFF',
                      },
                      border: {
                        borderRadius: '4px',
                      },
                      font: {
                        color: '#000000de',
                      },
                    },
                  },
                  primary: {
                    base: {
                      border: {
                        borderRadius: '4px',
                      },
                      font: {
                        color: '#ffffffe6',
                      },
                    },
                  },
                  secondary: {
                    base: {
                      border: {
                        borderRadius: '4px',
                      },
                      font: {
                        color: '#000000de',
                      },
                    },
                  },
                },
                footer: {
                  border: {
                    borderColor: '',
                  },
                  font: {
                    color: '',
                  },
                },
                images: {
                  favicon: {
                    imgURL: undefined,
                  },
                  logo: {
                    altText: undefined,
                    imgURL: undefined,
                  },
                  myAccountLogo: {
                    altText: undefined,
                    imgURL: undefined,
                    title: 'Account',
                  },
                },
                inputs: {
                  base: {
                    background: {
                      backgroundColor: '#FFFFFF',
                    },
                    border: {
                      borderColor: '',
                      borderRadius: '4px',
                    },
                    font: {
                      color: '',
                    },
                    labels: {
                      font: {
                        color: '',
                      },
                    },
                  },
                },
                loginBox: {
                  background: {
                    backgroundColor: '',
                  },
                  border: {
                    borderColor: '',
                    borderRadius: '12px',
                    borderWidth: '1px',
                  },
                  font: {
                    color: '',
                  },
                },
                loginPage: {
                  background: {
                    backgroundColor: '',
                  },
                  font: {
                    color: '',
                  },
                },
                typography: {
                  font: {
                    fontFamily: 'Gilmer',
                  },
                  heading: {
                    font: {
                      color: '',
                    },
                  },
                },
              },
            },
          },
        }}
      />
    </>
    // </main>
  );
};

export default SignIn;
