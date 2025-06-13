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

import {useContext} from 'react';
import FlowContext, {FlowContextValue} from './FlowContext';

/**
 * Hook to optionally access the flow context.
 * Unlike useFlow, this hook doesn't throw an error if used outside of FlowProvider.
 * This allows components to work both with and without the flow context.
 *
 * @example
 * ```tsx
 * const MyAuthComponent = () => {
 *   const flow = useFlowOptional();
 *
 *   const handleSuccess = () => {
 *     // Only update flow context if it's available
 *     flow?.addMessage({
 *       type: 'success',
 *       message: 'Authentication successful!'
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <h1>{flow?.title || 'Default Title'}</h1>
 *       {flow?.isLoading && <p>Loading...</p>}
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns The flow context value or undefined if not within a FlowProvider
 */
const useFlowOptional = (): FlowContextValue | undefined => {
  return useContext(FlowContext);
};

export default useFlowOptional;
