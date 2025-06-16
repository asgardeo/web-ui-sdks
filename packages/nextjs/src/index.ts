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

export {default as isSignedIn} from './server/actions/isSignedIn';

export {default as SignedIn} from './client/components/control/SignedIn';
export * from './client/components/control/SignedIn';

export {default as SignedOut} from './client/components/control/SignedOut';
export * from './client/components/control/SignedOut';

export {default as SignInButton} from './client/components/actions/SignInButton';
export type {SignInButtonProps} from './client/components/actions/SignInButton';

export {default as SignOutButton} from './client/components/actions/SignOutButton';
export type {SignOutButtonProps} from './client/components/actions/SignOutButton';

export {default as AsgardeoNext} from './AsgardeoNextClient';
