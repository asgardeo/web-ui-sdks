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

import AsgardeoRuntimeError from '../AsgardeoRuntimeError';

describe('AsgardeoRuntimeError', () => {
  it('should create a runtime error with details', () => {
    const message: string = 'Configuration Error';
    const code: string = 'CONFIG_ERROR';
    const origin: string = 'react';
    const details = {invalidField: 'redirectUri', value: null};
    const error = new AsgardeoRuntimeError(message, code, origin, details);

    expect(error.message).toBe('🛡️ Asgardeo - @asgardeo/react: Configuration Error\n\n(code="CONFIG_ERROR")\n');
    expect(error.code).toBe(code);
    expect(error.details).toEqual(details);
  });

  it('should create a runtime error without details', () => {
    const message: string = 'Unknown Runtime Error';
    const code: string = 'RUNTIME_ERROR';
    const origin: string = 'javascript';
    const error = new AsgardeoRuntimeError(message, code, origin);

    expect(error.message).toBe('🛡️ Asgardeo - @asgardeo/javascript: Unknown Runtime Error\n\n(code="RUNTIME_ERROR")\n');
    expect(error.details).toBeUndefined();
  });

  it('should have correct name and be instance of Error and AsgardeoRuntimeError', () => {
    const message: string = 'Test Error';
    const code: string = 'TEST_ERROR';
    const origin: string = 'react';
    const error = new AsgardeoRuntimeError(message, code, origin);

    expect(error.name).toBe('AsgardeoRuntimeError');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AsgardeoRuntimeError);
  });

  it('should format toString with details when available', () => {
    const message: string = 'Validation Error';
    const code: string = 'VALIDATION_ERROR';
    const origin: string = 'react';
    const details = {reason: 'invalid_input', field: 'email'};
    const error = new AsgardeoRuntimeError(message, code, origin, details);

    const expected: string =
      '[AsgardeoRuntimeError] (code="VALIDATION_ERROR")\n' +
      'Details: {\n  "reason": "invalid_input",\n  "field": "email"\n}\n' +
      'Message: 🛡️ Asgardeo - @asgardeo/react: Validation Error\n\n(code="VALIDATION_ERROR")\n';

    expect(error.toString()).toBe(expected);
  });

  it('should format toString without details when not available', () => {
    const message: string = 'Test Error';
    const code: string = 'TEST_ERROR';
    const origin: string = 'react';
    const error = new AsgardeoRuntimeError(message, code, origin);

    const expected: string =
      '[AsgardeoRuntimeError] (code="TEST_ERROR")\n' +
      'Message: 🛡️ Asgardeo - @asgardeo/react: Test Error\n\n(code="TEST_ERROR")\n';

    expect(error.toString()).toBe(expected);
  });

  it('should default to the agnostic SDK if no origin is provided', () => {
    const message: string = 'Test message';
    const code: string = 'TEST_ERROR';
    const error: AsgardeoError = new AsgardeoRuntimeError(message, code, '');

    expect(error.origin).toBe('@asgardeo/javascript');
  });
});
