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

import {FC, PropsWithChildren, ReactElement, useCallback, useMemo, useState} from 'react';
import FlowContext, {FlowContextValue, FlowMessage, FlowStep} from './FlowContext';

/**
 * Props for the FlowProvider component.
 */
export interface FlowProviderProps {
  /**
   * Initial step to start with.
   */
  initialStep?: FlowStep;

  /**
   * Initial title.
   */
  initialTitle?: string;

  /**
   * Initial subtitle.
   */
  initialSubtitle?: string;

  /**
   * Callback when flow type changes.
   */
  onFlowChange?: (step: FlowStep) => void;
}

/**
 * Provider component for flow context.
 * Manages shared UI state for authentication flows including titles, messages, and navigation.
 */
const FlowProvider: FC<PropsWithChildren<FlowProviderProps>> = ({
  children,
  initialStep = null,
  initialTitle = '',
  initialSubtitle,
  onFlowChange,
}: PropsWithChildren<FlowProviderProps>): ReactElement => {
  const [currentStep, setCurrentStepState] = useState<FlowStep>(initialStep);
  const [title, setTitle] = useState<string>(initialTitle);
  const [subtitle, setSubtitle] = useState<string | undefined>(initialSubtitle);
  const [messages, setMessages] = useState<FlowMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showBackButton, setShowBackButton] = useState<boolean>(false);
  const [onGoBack, setOnGoBack] = useState<(() => void) | undefined>(undefined);

  /**
   * Set the current flow step and notify listeners.
   */
  const setCurrentStep = useCallback(
    (step: FlowStep) => {
      setCurrentStepState(step);
      if (step) {
        setTitle(step.title);
        setSubtitle(step.subtitle);
        setShowBackButton(step.canGoBack ?? false);
      }
      onFlowChange?.(step);
    },
    [onFlowChange],
  );

  /**
   * Add a message to the message list.
   */
  const addMessage = useCallback((message: FlowMessage) => {
    const messageWithId = {
      ...message,
      id: message.id ?? `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setMessages(prev => [...prev, messageWithId]);
  }, []);

  /**
   * Remove a specific message by ID.
   */
  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  /**
   * Clear all messages.
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Reset the flow context to initial state.
   */
  const reset = useCallback(() => {
    setCurrentStepState(initialStep);
    setTitle(initialTitle);
    setSubtitle(initialSubtitle);
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setShowBackButton(false);
    setOnGoBack(undefined);
  }, [initialStep, initialTitle, initialSubtitle]);

  /**
   * Navigate to a different authentication flow.
   */
  const navigateToFlow = useCallback(
    (
      flowType: NonNullable<FlowStep>['type'],
      options?: {
        title?: string;
        subtitle?: string;
        metadata?: Record<string, any>;
      },
    ) => {
      const stepId = `${flowType}-${Date.now()}`;
      const step: NonNullable<FlowStep> = {
        id: stepId,
        type: flowType,
        title: options?.title,
        subtitle: options?.subtitle,
        canGoBack: flowType !== 'signin', // Usually allow going back except for main signin
        metadata: options?.metadata,
      };

      setCurrentStep(step);
      clearMessages();
      setError(null);
    },
    [setCurrentStep, clearMessages],
  );

  const contextValue: FlowContextValue = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      title,
      setTitle,
      subtitle,
      setSubtitle,
      messages,
      addMessage,
      removeMessage,
      clearMessages,
      error,
      setError,
      isLoading,
      setIsLoading,
      showBackButton,
      setShowBackButton,
      onGoBack,
      setOnGoBack,
      reset,
      navigateToFlow,
    }),
    [
      currentStep,
      setCurrentStep,
      title,
      subtitle,
      messages,
      addMessage,
      removeMessage,
      clearMessages,
      error,
      isLoading,
      showBackButton,
      onGoBack,
      reset,
      navigateToFlow,
    ],
  );

  return <FlowContext.Provider value={contextValue}>{children}</FlowContext.Provider>;
};

export default FlowProvider;
