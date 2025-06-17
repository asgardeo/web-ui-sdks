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

import {createContext} from 'react';

/**
 * Types of authentication flows/steps that can be displayed.
 */
export type FlowStep = {
  id: string;
  type: 'signin' | 'signup' | 'organization-signin' | 'forgot-password' | 'reset-password' | 'verify-email' | 'mfa';
  title: string;
  subtitle?: string;
  canGoBack?: boolean;
  metadata?: Record<string, any>;
} | null;

/**
 * Message types for displaying in authentication flows.
 */
export interface FlowMessage {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  dismissible?: boolean;
}

/**
 * Context value for managing authentication flow UI state.
 */
export interface FlowContextValue {
  // Current step/flow
  currentStep: FlowStep;
  setCurrentStep: (step: FlowStep) => void;

  // Title and subtitle
  title: string;
  setTitle: (title: string) => void;
  subtitle?: string;
  setSubtitle: (subtitle?: string) => void;

  // Messages
  messages: FlowMessage[];
  addMessage: (message: FlowMessage) => void;
  removeMessage: (messageId: string) => void;
  clearMessages: () => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Navigation
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
  onGoBack?: () => void;
  setOnGoBack: (callback?: () => void) => void;

  // Utilities
  reset: () => void;
  navigateToFlow: (
    flowType: NonNullable<FlowStep>['type'],
    options?: {
      title?: string;
      subtitle?: string;
      metadata?: Record<string, any>;
    },
  ) => void;
}

/**
 * Context for managing authentication flow UI state.
 * This context handles titles, messages, navigation, and loading states
 * for authentication flows like SignIn, SignUp, organization signin, etc.
 */
const FlowContext = createContext<FlowContextValue | undefined>(undefined);

FlowContext.displayName = 'FlowContext';

export default FlowContext;
