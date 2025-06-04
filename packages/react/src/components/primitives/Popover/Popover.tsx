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

import {FC, ReactNode, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import useStyles from './styles';

export interface PopoverProps {
  /**
   * Whether the popover is open
   */
  isOpen: boolean;
  /**
   * The content to display inside the popover
   */
  children: ReactNode;
  /**
   * Callback when the popover should close
   */
  onClose: () => void;
  /**
   * Optional custom class name for the popover container
   */
  className?: string;
  /**
   * The HTML element ID where the portal should be mounted
   */
  portalId?: string;
}

export const Popover: FC<PopoverProps> = ({
  isOpen,
  children,
  onClose,
  className = '',
  portalId = 'wso2-popover-root',
}) => {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const existing = document.getElementById(portalId);
    if (existing) {
      setPortalEl(existing);
      return void 0;
    }

    const el = document.createElement('div');
    el.id = portalId;
    document.body.appendChild(el);
    setPortalEl(el);

    return () => {
      if (document.getElementById(portalId)) {
        document.getElementById(portalId)?.remove();
      }
    };
  }, [portalId]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !portalEl) {
    return null;
  }

  const styles = useStyles();

  return createPortal(
    <div>
      <div style={styles['overlay']} onClick={onClose} />
      <div className={className} style={styles['content']}>
        {children}
      </div>
    </div>,
    portalEl,
  );
};

export default Popover;
