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

import AsgardeoAPIError from '../AsgardeoAPIError';

describe('AsgardeoAPIError', (): void => {
  it('should create an API error with status code and text', (): void => {
    const message: string = 'Not Found Error';
    const code: string = 'API_NOT_FOUND';
    const origin: string = 'react';
    const statusCode: number = 404;
    const statusText: string = 'Not Found';
    const error = new AsgardeoAPIError(message, code, origin, statusCode, statusText);

    expect(error.message).toBe('🛡️ Asgardeo - @asgardeo/react: Not Found Error\n\n(code="API_NOT_FOUND")\n');
    expect(error.code).toBe(code);
    expect(error.statusCode).toBe(statusCode);
    expect(error.statusText).toBe(statusText);
  });

  it('should create an API error without status code and text', (): void => {
    const message: string = 'Unknown API Error';
    const code: string = 'API_ERROR';
    const origin: string = 'javascript';
    const error = new AsgardeoAPIError(message, code, origin);

    expect(error.message).toBe('🛡️ Asgardeo - @asgardeo/javascript: Unknown API Error\n\n(code="API_ERROR")\n');
    expect(error.statusCode).toBeUndefined();
    expect(error.statusText).toBeUndefined();
  });

  it('should have correct name and be instance of Error and AsgardeoAPIError', (): void => {
    const message: string = 'Test Error';
    const code: string = 'TEST_ERROR';
    const origin: string = 'react';
    const error = new AsgardeoAPIError(message, code, origin);

    expect(error.name).toBe('AsgardeoAPIError');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AsgardeoAPIError);
  });

  it('should format toString with status when available', (): void => {
    const message: string = 'Bad Request';
    const code: string = 'API_BAD_REQUEST';
    const origin: string = 'react';
    const statusCode: number = 400;
    const statusText: string = 'Bad Request';
    const error = new AsgardeoAPIError(message, code, origin, statusCode, statusText);

    const expected: string =
      '[AsgardeoAPIError] (code="API_BAD_REQUEST") (HTTP 400 - Bad Request)\n' +
      'Message: 🛡️ Asgardeo - @asgardeo/react: Bad Request\n\n(code="API_BAD_REQUEST")\n';

    expect(error.toString()).toBe(expected);
  });

  it('should format toString without status when not available', (): void => {
    const message: string = 'Test Error';
    const code: string = 'TEST_ERROR';
    const origin: string = 'react';
    const error = new AsgardeoAPIError(message, code, origin);

    const expected: string =
      '[AsgardeoAPIError] (code="TEST_ERROR")\n' +
      'Message: 🛡️ Asgardeo - @asgardeo/react: Test Error\n\n(code="TEST_ERROR")\n';

    expect(error.toString()).toBe(expected);
  });

  it('should default to the agnostic SDK if no origin is provided', (): void => {
    const message: string = 'Test message';
    const code: string = 'TEST_ERROR';
    const error: AsgardeoError = new AsgardeoAPIError(message, code, '');

    expect(error.origin).toBe('@asgardeo/javascript');
  });
});
