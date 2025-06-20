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

import {IsomorphicCrypto} from '../../IsomorphicCrypto';
import StorageManager from '../../StorageManager';
import {AsgardeoAuthException} from '../../errors/exception';
import {AuthClientConfig, StrictAuthClientConfig} from '../models';
import {User} from '../../models/user';
import {SessionData} from '../../models/session';
import {JWKInterface} from '../../models/crypto';
import {TokenResponse, AccessTokenApiResponse} from '../../models/token';
import {IdTokenPayload} from '../../models/token';
import PKCEConstants from '../../constants/PKCEConstants';
import extractTenantDomainFromIdTokenPayload from '../../utils/extractTenantDomainFromIdTokenPayload';
import extractUserClaimsFromIdToken from '../../utils/extractUserClaimsFromIdToken';
import ScopeConstants from '../../constants/ScopeConstants';
import OIDCDiscoveryConstants from '../../constants/OIDCDiscoveryConstants';
import TokenExchangeConstants from '../../constants/TokenExchangeConstants';
import {OIDCDiscoveryEndpointsApiResponse, OIDCDiscoveryApiResponse} from '../../models/oidc-discovery';
import processOpenIDScopes from '../../utils/processOpenIDScopes';

export class AuthenticationHelper<T> {
  private _storageManager: StorageManager<T>;
  private _config: () => Promise<AuthClientConfig>;
  private _oidcProviderMetaData: () => Promise<OIDCDiscoveryApiResponse>;
  private _cryptoHelper: IsomorphicCrypto;

  public constructor(storageManager: StorageManager<T>, cryptoHelper: IsomorphicCrypto) {
    this._storageManager = storageManager;
    this._config = async () => await this._storageManager.getConfigData();
    this._oidcProviderMetaData = async () => await this._storageManager.loadOpenIDProviderConfiguration();
    this._cryptoHelper = cryptoHelper;
  }

  public async resolveEndpoints(response: OIDCDiscoveryApiResponse): Promise<OIDCDiscoveryApiResponse> {
    const oidcProviderMetaData: OIDCDiscoveryApiResponse = {};
    const configData: StrictAuthClientConfig = await this._config();

    configData.endpoints &&
      Object.keys(configData.endpoints).forEach((endpointName: string) => {
        const snakeCasedName: string = endpointName.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

        oidcProviderMetaData[snakeCasedName] = configData?.endpoints ? configData.endpoints[endpointName] : '';
      });

    return {...response, ...oidcProviderMetaData};
  }

  public async resolveEndpointsExplicitly(): Promise<OIDCDiscoveryEndpointsApiResponse> {
    const oidcProviderMetaData: OIDCDiscoveryApiResponse = {};
    const configData: StrictAuthClientConfig = await this._config();

    const requiredEndpoints: string[] = [
      OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.AUTHORIZATION,
      OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.END_SESSION,
      OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.JWKS,
      OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.SESSION_IFRAME,
      OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.REVOCATION,
      OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.TOKEN,
      OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.ISSUER,
      OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.USERINFO,
    ];

    const isRequiredEndpointsContains: boolean = configData.endpoints
      ? requiredEndpoints.every((reqEndpointName: string) => {
          return configData.endpoints
            ? Object.keys(configData.endpoints).some((endpointName: string) => {
                const snakeCasedName: string = endpointName.replace(
                  /[A-Z]/g,
                  (letter: string) => `_${letter.toLowerCase()}`,
                );

                return snakeCasedName === reqEndpointName;
              })
            : false;
        })
      : false;

    if (!isRequiredEndpointsContains) {
      throw new AsgardeoAuthException(
        'JS-AUTH_HELPER-REE-NF01',
        'Required endpoints missing',
        'Some or all of the required endpoints are missing in the object passed to the `endpoints` ' +
          'attribute of the`AuthConfig` object.',
      );
    }

    configData.endpoints &&
      Object.keys(configData.endpoints).forEach((endpointName: string) => {
        const snakeCasedName: string = endpointName.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

        oidcProviderMetaData[snakeCasedName] = configData?.endpoints ? configData.endpoints[endpointName] : '';
      });

    return {...oidcProviderMetaData};
  }

  public async resolveEndpointsByBaseURL(): Promise<OIDCDiscoveryEndpointsApiResponse> {
    const oidcProviderMetaData: OIDCDiscoveryEndpointsApiResponse = {};
    const configData: StrictAuthClientConfig = await this._config();

    const baseUrl: string = (configData as any).baseUrl;

    if (!baseUrl) {
      throw new AsgardeoAuthException(
        'JS-AUTH_HELPER_REBO-NF01',
        'Base URL not defined.',
        'Base URL is not defined in AuthClient config.',
      );
    }

    configData.endpoints &&
      Object.keys(configData.endpoints).forEach((endpointName: string) => {
        const snakeCasedName: string = endpointName.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

        oidcProviderMetaData[snakeCasedName] = configData?.endpoints ? configData.endpoints[endpointName] : '';
      });

    const defaultEndpoints: OIDCDiscoveryApiResponse = {
      [OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints
        .AUTHORIZATION]: `${baseUrl}${OIDCDiscoveryConstants.Endpoints.AUTHORIZATION}`,
      [OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints
        .END_SESSION]: `${baseUrl}${OIDCDiscoveryConstants.Endpoints.END_SESSION}`,
      [OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints
        .ISSUER]: `${baseUrl}${OIDCDiscoveryConstants.Endpoints.ISSUER}`,
      [OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints.JWKS]: `${baseUrl}${OIDCDiscoveryConstants.Endpoints.JWKS}`,
      [OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints
        .SESSION_IFRAME]: `${baseUrl}${OIDCDiscoveryConstants.Endpoints.SESSION_IFRAME}`,
      [OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints
        .REVOCATION]: `${baseUrl}${OIDCDiscoveryConstants.Endpoints.REVOCATION}`,
      [OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints
        .TOKEN]: `${baseUrl}${OIDCDiscoveryConstants.Endpoints.TOKEN}`,
      [OIDCDiscoveryConstants.Storage.StorageKeys.Endpoints
        .USERINFO]: `${baseUrl}${OIDCDiscoveryConstants.Endpoints.USERINFO}`,
    };

    return {...defaultEndpoints, ...oidcProviderMetaData};
  }

  public async validateIdToken(idToken: string): Promise<boolean> {
    const jwksEndpoint: string | undefined = (await this._storageManager.loadOpenIDProviderConfiguration()).jwks_uri;
    const configData: StrictAuthClientConfig = await this._config();

    if (!jwksEndpoint || jwksEndpoint.trim().length === 0) {
      throw new AsgardeoAuthException(
        'JS_AUTH_HELPER-VIT-NF01',
        'JWKS endpoint not found.',
        'No JWKS endpoint was found in the OIDC provider meta data returned by the well-known endpoint ' +
          'or the JWKS endpoint passed to the SDK is empty.',
      );
    }

    let response: Response;

    try {
      response = await fetch(jwksEndpoint, {
        credentials: configData.sendCookiesInRequests ? 'include' : 'same-origin',
      });
    } catch (error: any) {
      throw new AsgardeoAuthException(
        'JS-AUTH_HELPER-VIT-NE02',
        'Request to jwks endpoint failed.',
        error ?? 'The request sent to get the jwks from the server failed.',
      );
    }

    if (response.status !== 200 || !response.ok) {
      throw new AsgardeoAuthException(
        'JS-AUTH_HELPER-VIT-HE03',
        `Invalid response status received for jwks request (${response.statusText}).`,
        (await response.json()) as string,
      );
    }

    const issuer: string | undefined = (await this._oidcProviderMetaData()).issuer;

    const {keys}: {keys: JWKInterface[]} = (await response.json()) as {
      keys: JWKInterface[];
    };

    const jwk: any = await this._cryptoHelper.getJWKForTheIdToken(idToken.split('.')[0], keys);

    return this._cryptoHelper.isValidIdToken(
      idToken,
      jwk,
      (await this._config()).clientId,
      issuer ?? '',
      this._cryptoHelper.decodeIdToken(idToken).sub,
      (await this._config()).clockTolerance,
      (await this._config()).validateIDTokenIssuer ?? true,
    );
  }

  public getAuthenticatedUserInfo(idToken: string): User {
    const payload: IdTokenPayload = this._cryptoHelper.decodeIdToken(idToken);
    const username: string = payload?.['username'] ?? '';
    const givenName: string = payload?.['given_name'] ?? '';
    const familyName: string = payload?.['family_name'] ?? '';
    const fullName: string =
      givenName && familyName ? `${givenName} ${familyName}` : givenName ? givenName : familyName ? familyName : '';
    const displayName: string = payload.preferred_username ?? fullName;

    return {
      displayName: displayName,
      username: username,
      ...extractUserClaimsFromIdToken(payload),
    };
  }

  public async replaceCustomGrantTemplateTags(text: string, userId?: string): Promise<string> {
    const configData: StrictAuthClientConfig = await this._config();
    const sessionData: SessionData = await this._storageManager.getSessionData(userId);

    let scope: string = processOpenIDScopes(configData.scopes);

    return text
      .replace(TokenExchangeConstants.Placeholders.TOKEN, sessionData.access_token)
      .replace(
        TokenExchangeConstants.Placeholders.USERNAME,
        this.getAuthenticatedUserInfo(sessionData.id_token).username,
      )
      .replace(TokenExchangeConstants.Placeholders.SCOPE, scope)
      .replace(TokenExchangeConstants.Placeholders.CLIENT_ID, configData.clientId)
      .replace(TokenExchangeConstants.Placeholders.CLIENT_SECRET, configData.clientSecret ?? '');
  }

  public async clearSession(userId?: string): Promise<void> {
    await this._storageManager.removeTemporaryData(userId);
    await this._storageManager.removeSessionData(userId);
  }

  public async handleTokenResponse(response: Response, userId?: string): Promise<TokenResponse> {
    if (response.status !== 200 || !response.ok) {
      throw new AsgardeoAuthException(
        'JS-AUTH_HELPER-HTR-NE01',
        `Invalid response status received for token request (${response.statusText}).`,
        (await response.json()) as string,
      );
    }

    //Get the response in JSON
    const parsedResponse: AccessTokenApiResponse = (await response.json()) as AccessTokenApiResponse;

    parsedResponse.created_at = new Date().getTime();

    const shouldValidateIdToken: boolean | undefined = (await this._config()).validateIDToken;

    if (shouldValidateIdToken) {
      return this.validateIdToken(parsedResponse.id_token).then(async () => {
        await this._storageManager.setSessionData(parsedResponse, userId);

        const tokenResponse: TokenResponse = {
          accessToken: parsedResponse.access_token,
          createdAt: parsedResponse.created_at,
          expiresIn: parsedResponse.expires_in,
          idToken: parsedResponse.id_token,
          refreshToken: parsedResponse.refresh_token,
          scope: parsedResponse.scope,
          tokenType: parsedResponse.token_type,
        };

        return Promise.resolve(tokenResponse);
      });
    } else {
      const tokenResponse: TokenResponse = {
        accessToken: parsedResponse.access_token,
        createdAt: parsedResponse.created_at,
        expiresIn: parsedResponse.expires_in,
        idToken: parsedResponse.id_token,
        refreshToken: parsedResponse.refresh_token,
        scope: parsedResponse.scope,
        tokenType: parsedResponse.token_type,
      };

      await this._storageManager.setSessionData(parsedResponse, userId);

      return Promise.resolve(tokenResponse);
    }
  }
}
