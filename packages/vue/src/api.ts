import {AsgardeoSPAClient, BasicUserInfo, FetchResponse, HttpRequestConfig, HttpResponse, SignInConfig, SPACustomGrantConfig} from '@asgardeo/auth-spa';
import {AuthStateInterface, AuthVueConfig} from './types';

class AuthAPI {
  static DEFAULT_STATE: AuthStateInterface;

  private _authState = AuthAPI.DEFAULT_STATE;
  private _client: AsgardeoSPAClient;

  constructor(spaClient?: AsgardeoSPAClient) {
    this._client = spaClient ?? AsgardeoSPAClient.getInstance();
  }

  /**
   * Method to return Auth Client instance authentication state.
   *
   * @return {AuthStateInterface} Authentication State.
   */
  public getState(): AuthStateInterface {
    return this._authState;
  }

  /**
   * Method to initialize the AuthClient instance.
   */
  public init(config: AuthVueConfig): Promise<boolean> {
    return this._client.initialize(config);
  }

  public async signIn(
    config: SignInConfig,
    autherizationcode: string,
    sessionState: string,
    authState?: string,
    tokenRequestConfig?: {params: Record<string, unknown>},
  ): Promise<BasicUserInfo> {
    return this._client
      .signIn(config, autherizationcode, sessionState, authState, tokenRequestConfig)
      .then(async (response: BasicUserInfo) => {
        if (!response) {
          return response;
        }
        if (await this._client.isAuthenticated()) {
          Object.assign(this._authState, {
            allowedScopes: response.allowedScopes,
            displayName: response.displayName,
            email: response.email,
            isAuthenticated: true,
            isLoading: false,
            isSigningOut: false,
            sub: response.sub,
            username: response.username,
          });
        }

        return response;
      })
      .catch(error => Promise.reject(error));
  }

  public async signOut(): Promise<boolean> {
    return this._client
      .signOut()
      .then(response => {
        Object.assign(this._authState, {...AuthAPI.DEFAULT_STATE, isLoading: false});
        return response;
      })
      .catch(error => Promise.reject(error));
  }

  public async getBasicUserInfo(): Promise<BasicUserInfo> {
    return this._client.getBasicUserInfo();
  }

  public async httpRequest(config: HttpRequestConfig): Promise<HttpResponse<any>> {
    return this._client.httpRequest(config);
  }


    /**
     * Sends a custom grant request.
     */
    public async requestCustomGrant(
        config: SPACustomGrantConfig,
        callback?: (response: BasicUserInfo | FetchResponse<any>) => void
    ): Promise<BasicUserInfo | FetchResponse<any>> {
        return this._client
            .requestCustomGrant(config)
            .then((response: BasicUserInfo | FetchResponse<any>) => {
                if (!response) {
                    return response;
                }

                if (config.returnsSession) {
                    Object.assign(this._authState, {
                        ...this._authState,
                        ...(response as BasicUserInfo),
                        isAuthenticated: true,
                        isLoading: false
                    });
                }

                callback && callback(response);
                return response;
            })
            .catch((error) => Promise.reject(error));
    }
}
