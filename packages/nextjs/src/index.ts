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

export {default as AsgardeoProvider} from './server/AsgardeoProvider';
export * from './server/AsgardeoProvider';

export {default as useAsgardeo} from './client/contexts/Asgardeo/useAsgardeo';
export * from './client/contexts/Asgardeo/useAsgardeo';

export {default as isSignedIn} from './server/actions/isSignedIn';

export {default as getSessionId} from './server/actions/getSessionId';

export {default as getSessionPayload} from './server/actions/getSessionPayload';

export {default as handleOAuthCallback} from './server/actions/handleOAuthCallbackAction';

export {default as SessionManager} from './utils/SessionManager';
export * from './utils/SessionManager';

export {default as CreateOrganization} from './client/components/presentation/CreateOrganization/CreateOrganization';
export {CreateOrganizationProps} from './client/components/presentation/CreateOrganization/CreateOrganization';

export {default as OrganizationProfile} from './client/components/presentation/OrganizationProfile/OrganizationProfile';
export {OrganizationProfileProps} from './client/components/presentation/OrganizationProfile/OrganizationProfile';

export {default as OrganizationSwitcher} from './client/components/presentation/OrganizationSwitcher/OrganizationSwitcher';
export {OrganizationSwitcherProps} from './client/components/presentation/OrganizationSwitcher/OrganizationSwitcher';

export {default as SignedIn} from './client/components/control/SignedIn/SignedIn';
export {SignedInProps} from './client/components/control/SignedIn/SignedIn';

export {default as SignedOut} from './client/components/control/SignedOut/SignedOut';
export {SignedOutProps} from './client/components/control/SignedOut/SignedOut';

export {default as SignInButton} from './client/components/actions/SignInButton/SignInButton';
export type {SignInButtonProps} from './client/components/actions/SignInButton/SignInButton';

export {default as SignUpButton} from './client/components/actions/SignUpButton/SignUpButton';
export type {SignUpButtonProps} from './client/components/actions/SignUpButton/SignUpButton';

export {default as SignIn} from './client/components/presentation/SignIn/SignIn';
export type {SignInProps} from './client/components/presentation/SignIn/SignIn';

export {default as SignOutButton} from './client/components/actions/SignOutButton/SignOutButton';
export type {SignOutButtonProps} from './client/components/actions/SignOutButton/SignOutButton';

export {default as User} from './client/components/presentation/User/User';
export type {UserProps} from './client/components/presentation/User/User';

export {default as SignUp} from './client/components/presentation/SignUp/SignUp';
export type {SignUpProps} from './client/components/presentation/SignUp/SignUp';

export {default as UserDropdown} from './client/components/presentation/UserDropdown/UserDropdown';
export type {UserDropdownProps} from './client/components/presentation/UserDropdown/UserDropdown';

export {default as UserProfile} from './client/components/presentation/UserProfile/UserProfile';
export type {UserProfileProps} from './client/components/presentation/UserProfile/UserProfile';

export {default as AsgardeoNext} from './AsgardeoNextClient';

export {default as asgardeoMiddleware} from './middleware/asgardeoMiddleware';
export * from './middleware/asgardeoMiddleware';

export {default as createRouteMatcher} from './middleware/createRouteMatcher';
export * from './middleware/createRouteMatcher';
