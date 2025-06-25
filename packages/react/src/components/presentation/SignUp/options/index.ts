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

export {default as TextInput} from './TextInput';
export {default as EmailInput} from './EmailInput';
export {default as PasswordInput} from './PasswordInput';
export {default as SubmitButton} from './SubmitButton';
export {default as SocialButton} from './SocialButton';
export {default as GoogleButton} from './GoogleButton';
export {default as Typography} from './Typography';
export {default as FormContainer} from './FormContainer';

export {
  createSignUpComponent,
  createSignUpOptionFromComponent,
  renderSignUpComponents,
  type BaseSignUpOptionProps,
} from './SignUpOptionFactory';
