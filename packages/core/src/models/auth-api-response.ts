/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

export interface AuthApiResponse {
  /* If user is successfully authenticated, contains the authentication data. */
  authData?: AuthData;
  /* A unique identifier for the authentication flow. */
  flowId: string;
  /* The status of the authentication flow. */
  flowStatus: FlowStatus;
  /* The type of the authentication flow. */
  flowType: string;
  /* Contains the urls related to the authentication flow. */
  links: Link[];
  /* Contains the authenticator data related to the next step. */
  nextStep: AuthStep;
}

export interface AuthData {
  code: string;
  session_state: string;
}

export enum FlowStatus {
  FailIncomplete = 'FAIL_INCOMPLETE',
  Incomplete = 'INCOMPLETE',
  SuccessCompleted = 'SUCCESS_COMPLETED',
}

export interface Link {
  /* The relative url of the link. */
  href: string;
  /* The supported http methods of the link. */
  method: LinkMethod;
  /* The identifier of the link. */
  name: string;
}

export enum LinkMethod {
  Get = 'GET',
  Post = 'POST',
}

export interface AuthStep {
  /* Contains the data related to the available authentication steps. */
  authenticators: Authenticator[];
  /* The type of the next step in the authentication flow. */
  stepType: StepType;
}

export enum StepType {
  /* The next step is for authenticating the user through a configured authenticator. */
  AuthenticatorPrompt = 'AUTHENTICATOR_PROMPT',
  /* The next step is for authenticator selection. */
  MultiOptionsPrompt = 'MULTI_OPTIONS_PROMPT',
}

export interface Authenticator {
  /* The authenticator name. */
  authenticator: string;
  /* The authenticator identifier. */
  authenticatorId: string;
  /* The identity provider identifier. */
  idp: string;
  /* Contains the metadata related to an authenticator. */
  metadata: Metadata;
  /* Contains the required parameters that should be sent to the server for processing the current step of the authentication request. */
  requiredParams: string[];
}

export interface Metadata {
  /* Contains any additional data related to the authenticator which would be needed for the application to perform authentication. */
  additionalData?: AdditionalData;
  /* The i18n key for the authenticator. */
  i18nKey: string;
  /* If the promptType is USER_PROMPT, contains the data related to input parameters of the authenticator. */
  params?: Params;
  /* The type of the prompt. */
  promptType: PromptType;
}

export enum PromptType {
  /*  The prompt is for the system to perform an internal action which will result in obtaining the required parameters. */
  InternalPrompt = 'INTERNAL_PROMPT',
  /* The prompt is for the user to be redirected to a different url which will result in obtaining the required parameters. */
  RedirectionPromt = 'REDIRECTION_PROMPT',
  /* The prompt is for the user to input the required parameters for the authenticator. */
  UserPrompt = 'USER_PROMPT',
}

export interface Params {
  /* Indicates whether the parameter is confidential or not. */
  confidential: boolean;
  /* Display name when prompting for the user. */
  displayName: string;
  i18nKey: string;
  /* Indicates the recommended display order of the parameter. */
  order: number;
  /* The parameter identifier. */
  param: string;
  /* Indicates the data type of the parameter. */
  type: ParamsType;
}

export enum ParamsType {
  Boolean = 'BOOLEAN',
  Integer = 'INTEGER',
  String = 'STRING',
}

export interface AdditionalData {
  redirectUrl: string;
  state: string;
}
