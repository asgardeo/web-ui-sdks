/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import type {Config} from '@jest/types';

const jestConfig: Config.InitialOptions = {
  displayName: '@asgardeo/react',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleDirectories: ['node_modules', 'test-configs', __dirname],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^@unit-testing(.*)$': '<rootDir>/test-configs/utils',
  },
  modulePaths: ['<rootDir>'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test-configs/setup-test.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/?(*.)test.{ts,tsx,js,jsx}'],
  testPathIgnorePatterns: ['<rootDir>/(dist|node_modules)/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!jose).+\\.js$'],
  verbose: true,
};

export default jestConfig;
