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

export {default as SignedIn} from './client/components/control/SignedIn/SignedIn';
export {SignedInProps} from './client/components/control/SignedIn/SignedIn';

export {default as SignedOut} from './client/components/control/SignedOut/SignedOut';
export {SignedOutProps} from './client/components/control/SignedOut/SignedOut';

export {default as SignInButton} from './client/components/actions/SignInButton/SignInButton';
export type {SignInButtonProps} from './client/components/actions/SignInButton/SignInButton';

export {default as SignIn} from './client/components/presentation/SignIn/SignIn';
export type {SignInProps} from './client/components/presentation/SignIn/SignIn';

export {default as SignOutButton} from './client/components/actions/SignOutButton/SignOutButton';
export type {SignOutButtonProps} from './client/components/actions/SignOutButton/SignOutButton';

export {default as User} from './client/components/presentation/User/User';
export type {UserProps} from './client/components/presentation/User/User';

export {default as UserDropdown} from './client/components/presentation/UserDropdown/UserDropdown';
export type {UserDropdownProps} from './client/components/presentation/UserDropdown/UserDropdown';

export {default as UserProfile} from './client/components/presentation/UserProfile/UserProfile';
export type {UserProfileProps} from './client/components/presentation/UserProfile/UserProfile';

export {default as AsgardeoNext} from './AsgardeoNextClient';

export {default as asgardeoMiddleware} from './middleware/asgardeoMiddleware';
