export interface ApplicationNativeAuthenticationInitiateResponse {
  flowId: string;
  flowStatus: ApplicationNativeAuthenticationFlowStatus;
  flowType: ApplicationNativeAuthenticationFlowType;
  nextStep: {
    stepType: ApplicationNativeAuthenticationStepType;
    authenticators: ApplicationNativeAuthenticationAuthenticator[];
  };
  links: ApplicationNativeAuthenticationLink[];
}

export enum ApplicationNativeAuthenticationFlowStatus {
  SuccessCompleted = 'SUCCESS_COMPLETED',
  FailCompleted = 'FAIL_COMPLETED',
  FailIncomplete = 'FAIL_INCOMPLETE',
  Incomplete = 'INCOMPLETE',
}

export enum ApplicationNativeAuthenticationFlowType {
  Authentication = 'AUTHENTICATION',
}

export enum ApplicationNativeAuthenticationStepType {
  AuthenticatorPrompt = 'AUTHENTICATOR_PROMPT',
  MultOptionsPrompt = 'MULTI_OPTIONS_PROMPT',
}

export interface ApplicationNativeAuthenticationAuthenticator {
  authenticatorId: string;
  authenticator: string;
  idp: string;
  metadata: {
    i18nKey: string;
    promptType: ApplicationNativeAuthenticationAuthenticatorPromptType;
    params: {
      param: string;
      type: ApplicationNativeAuthenticationAuthenticatorParamType;
      order: number;
      i18nKey: string;
      displayName: string;
      confidential: boolean;
    }[];
  };
  requiredParams: string[];
}

export interface ApplicationNativeAuthenticationLink {
  name: string;
  href: string;
  method: string;
}

export interface ApplicationNativeAuthenticationHandleRequestPayload {
  flowId: string;
  selectedAuthenticator: {
    authenticatorId: string;
    params: Record<string, string>;
  };
}

export interface ApplicationNativeAuthenticationHandleResponse {
  flowStatus: string;
  authData: Record<string, any>;
}

export enum ApplicationNativeAuthenticationAuthenticatorParamType {
  String = 'STRING',
  Integer = 'INTEGER',
  MultiValued = 'MULTI_VALUED',
}

export enum ApplicationNativeAuthenticationAuthenticatorExtendedParamType {
  Otp = 'OTPCode',
}

export enum ApplicationNativeAuthenticationAuthenticatorKnownIdPType {
  Local = 'LOCAL',
}

export enum ApplicationNativeAuthenticationAuthenticatorPromptType {
  /**
   * Prompt for user input, typically for username/password or similar credentials.
   */
  UserPrompt = 'USER_PROMPT',
  /**
   * Prompt for internal system use, such as API keys or tokens.
   */
  InternalPrompt = 'INTERNAL_PROMPT',
  /**
   * Prompt for redirection to another page or service.
   */
  RedirectionPrompt = 'REDIRECTION_PROMPT',
}
