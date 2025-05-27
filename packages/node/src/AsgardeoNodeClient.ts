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

import {AsgardeoJavaScriptClient} from '@asgardeo/javascript';
import {AsgardeoNodeConfig} from './models/config';
import {SignOutOptions} from '@asgardeo/javascript/dist/models/client';

/**
 * Base class for implementing Asgardeo in Node.js based applications.
 * This class provides the core functionality for managing user authentication and sessions.
 *
 * @typeParam T - Configuration type that extends AsgardeoNodeConfig.
 */
abstract class AsgardeoNodeClient<T = AsgardeoNodeConfig> extends AsgardeoJavaScriptClient<T> {}

export default AsgardeoNodeClient;
