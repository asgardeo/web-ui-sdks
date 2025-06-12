/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

export * from './__legacy__/client';
export * from './__legacy__/models';

export * from './IsomorphicCrypto';

export {default as initializeApplicationNativeAuthentication} from './api/initializeApplicationNativeAuthentication';
export {default as handleApplicationNativeAuthentication} from './api/handleApplicationNativeAuthentication';
export {default as getUserInfo} from './api/getUserInfo';

export {default as ApplicationNativeAuthenticationConstants} from './constants/ApplicationNativeAuthenticationConstants';
export {default as TokenConstants} from './constants/TokenConstants';
export {default as OIDCRequestConstants} from './constants/OIDCRequestConstants';

export {default as AsgardeoError} from './errors/AsgardeoError';
export {default as AsgardeoAPIError} from './errors/AsgardeoAPIError';
export {default as AsgardeoRuntimeError} from './errors/AsgardeoRuntimeError';
export {AsgardeoAuthException} from './errors/exception';

export {
  ApplicationNativeAuthenticationInitiateResponse,
  ApplicationNativeAuthenticationFlowStatus,
  ApplicationNativeAuthenticationFlowType,
  ApplicationNativeAuthenticationStepType,
  ApplicationNativeAuthenticationAuthenticator,
  ApplicationNativeAuthenticationLink,
  ApplicationNativeAuthenticationHandleRequestPayload,
  ApplicationNativeAuthenticationHandleResponse,
  ApplicationNativeAuthenticationAuthenticatorParamType,
  ApplicationNativeAuthenticationAuthenticatorPromptType,
  ApplicationNativeAuthenticationAuthenticatorKnownIdPType,
} from './models/application-native-authentication';
export {AsgardeoClient, SignInOptions, SignOutOptions} from './models/client';
export {BaseConfig, Config, Preferences, ThemePreferences, I18nPreferences} from './models/config';
export {TokenResponse, IdTokenPayload} from './models/token';
export {Crypto, JWKInterface} from './models/crypto';
export {OAuthResponseMode} from './models/oauth-response';
export {
  AuthorizeRequestUrlParams,
  KnownExtendedAuthorizeRequestUrlParams,
  ExtendedAuthorizeRequestUrlParams,
} from './models/oauth-request';
export {OIDCEndpoints} from './models/oidc-endpoints';
export {Storage} from './models/store';
export {User} from './models/user';
export {SessionData} from './models/session';
export {Schema, SchemaAttribute, WellKnownSchemaIds} from './models/scim2-schema';
export {RecursivePartial} from './models/utility-types';
export {FieldType} from './models/field';
export {I18nBundle, I18nTranslations, I18nMetadata} from './models/i18n';

export {default as AsgardeoJavaScriptClient} from './AsgardeoJavaScriptClient';

export {default as createTheme} from './theme/createTheme';
export {ThemeColors, ThemeConfig, Theme, ThemeMode} from './theme/types';

export {default as extractUserClaimsFromIdToken} from './utils/extractUserClaimsFromIdToken';
export {default as extractPkceStorageKeyFromState} from './utils/extractPkceStorageKeyFromState';
export {default as getI18nBundles} from './utils/getI18nBundles';
export {default as removeTrailingSlash} from './utils/removeTrailingSlash';
export {default as resolveFieldType} from './utils/resolveFieldType';
export {default as resolveFieldName} from './utils/resolveFieldName';

export {default as StorageManager} from './StorageManager';
