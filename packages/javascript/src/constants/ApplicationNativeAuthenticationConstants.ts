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

/**
 * Constants representing Application Native Authentication related configurations and constants.
 */
const ApplicationNativeAuthenticationConstants = {
  SupportedAuthenticators: {
    IdentifierFirst: 'SWRlbnRpZmllckV4ZWN1dG9yOkxPQ0FM',
    EmailOtp: 'ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I6TE9DQUw',
    Totp: 'dG90cDpMT0NBTA',
    UsernamePassword: 'QmFzaWNBdXRoZW50aWNhdG9yOkxPQ0FM',
    PushNotification: 'cHVzaC1ub3RpZmljYXRpb24tYXV0aGVudGljYXRvcjpMT0NBTA',
    Passkey: 'RklET0F1dGhlbnRpY2F0b3I6TE9DQUw',
    SmsOtp: 'c21zLW90cC1hdXRoZW50aWNhdG9yOkxPQ0FM',
    MagicLink: 'TWFnaWNMaW5rQXV0aGVudGljYXRvcjpMT0NBTA',
    Google: 'R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I6R29vZ2xl',
    Github: 'R2l0aHViQXV0aGVudGljYXRvcjpHaXRIdWI',
    Microsoft: 'T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I6TWljcm9zb2Z0',
    Facebook: 'RmFjZWJvb2tBdXRoZW50aWNhdG9yOkZhY2Vib29r',
    LinkedIn: 'TGlua2VkSW5PSURDOkxpbmtlZElu',
    SignInWithEthereum: 'T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I6U2lnbiBJbiBXaXRoIEV0aGVyZXVt',
  },
} as const;

export default ApplicationNativeAuthenticationConstants;
