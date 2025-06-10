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
    promptType: string;
    params: {
      param: string;
      type: string;
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
