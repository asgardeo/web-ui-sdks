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

import logger, {createLogger, createComponentLogger, LogLevel} from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    // Reset console methods before each test
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic logging', () => {
    it('should log info messages', () => {
      logger.info('Test info message');
      expect(console.info).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      logger.warn('Test warning message');
      expect(console.warn).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      logger.error('Test error message');
      expect(console.error).toHaveBeenCalled();
    });

    it('should log debug messages when level is DEBUG', () => {
      logger.setLevel(LogLevel.DEBUG);
      logger.debug('Test debug message');
      expect(console.debug).toHaveBeenCalled();
    });

    it('should not log debug messages when level is INFO', () => {
      logger.setLevel(LogLevel.INFO);
      logger.debug('Test debug message');
      expect(console.debug).not.toHaveBeenCalled();
    });
  });

  describe('Log levels', () => {
    it('should respect log level filtering', () => {
      logger.setLevel(LogLevel.WARN);

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('should silence all logs when level is SILENT', () => {
      logger.setLevel(LogLevel.SILENT);

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Custom loggers', () => {
    it('should create logger with custom configuration', () => {
      const customLogger = createLogger({
        level: LogLevel.DEBUG,
        prefix: 'Custom',
        timestamps: false,
        showLevel: false,
      });

      expect(customLogger.getLevel()).toBe(LogLevel.DEBUG);
      expect(customLogger.getConfig().prefix).toBe('Custom');
      expect(customLogger.getConfig().timestamps).toBe(false);
      expect(customLogger.getConfig().showLevel).toBe(false);
    });

    it('should create component logger with nested prefix', () => {
      const componentLogger = createComponentLogger('Authentication');

      componentLogger.info('Test message');

      expect(console.info).toHaveBeenCalled();
      // The exact format depends on environment detection
    });

    it('should create child logger', () => {
      const parentLogger = createLogger({prefix: 'Parent'});
      const childLogger = parentLogger.child('Child');

      expect(childLogger.getConfig().prefix).toBe('Parent - Child');
    });
  });

  describe('Configuration', () => {
    it('should update configuration', () => {
      const testLogger = createLogger({level: LogLevel.INFO});

      testLogger.configure({
        level: LogLevel.DEBUG,
        prefix: 'Updated',
      });

      expect(testLogger.getLevel()).toBe(LogLevel.DEBUG);
      expect(testLogger.getConfig().prefix).toBe('Updated');
    });
  });

  describe('Custom formatter', () => {
    it('should use custom formatter when provided', () => {
      const mockFormatter = jest.fn();
      const customLogger = createLogger({
        formatter: mockFormatter,
      });

      customLogger.info('Test message', {data: 'test'});

      expect(mockFormatter).toHaveBeenCalledWith(LogLevel.INFO, 'Test message', {data: 'test'});
      expect(console.info).not.toHaveBeenCalled();
    });
  });
});
