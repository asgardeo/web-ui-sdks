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

import React, {CSSProperties, FC, ReactNode, useEffect, useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import {useTheme} from '../../../contexts/Theme/useTheme';
import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import clsx from 'clsx';
import Button from '../Button/Button';

const useStyles = () => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      } as CSSProperties,
      content: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        maxHeight: '90vh',
        overflowY: 'auto',
        background: theme.colors.background.surface,
        borderRadius: theme.borderRadius.large,
        boxShadow: `0 2px 8px ${colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)'}`,
      } as CSSProperties,
      contentBody: {} as CSSProperties,
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4.5}px`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      headerTitle: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: 600,
        color: theme.colors.text.primary,
      } as CSSProperties,
      closeButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: theme.spacing.unit / 2 + 'px',
        color: theme.colors.text.secondary,
        fontSize: '1.2rem',
        '&:hover': {
          color: theme.colors.text.primary,
        },
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

interface PopoverContextType {
  onClose?: () => void;
}

const PopoverContext = React.createContext<PopoverContextType>({});

interface PopoverHeaderProps {
  children?: ReactNode;
}

const PopoverHeader: FC<PopoverHeaderProps> = ({children}) => {
  const styles = useStyles();
  const {onClose} = React.useContext(PopoverContext);

  return (
    <div style={styles.header}>
      {children && <h3 style={styles.headerTitle}>{children}</h3>}
      {onClose && (
        <Button
          color="tertiary"
          variant="text"
          size="small"
          onClick={onClose}
          aria-label="Close"
          style={{
            padding: styles.closeButton.padding,
            fontSize: styles.closeButton.fontSize,
          }}
        >
          ×
        </Button>
      )}
    </div>
  );
};

interface PopoverContentProps {
  children: ReactNode;
}

const PopoverContent: FC<PopoverContentProps> = ({children}) => {
  const styles = useStyles();
  return <div style={styles.contentBody}>{children}</div>;
};

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
  /**
   * The display mode of the popover
   * 'modal' - shows overlay and centers content
   * 'dropdown' - no overlay, content positioned relative to trigger
   */
  mode?: 'modal' | 'dropdown';
}

export const Popover: FC<PopoverProps> & {
  Header: typeof PopoverHeader;
  Content: typeof PopoverContent;
} = ({isOpen, children, onClose, className = '', portalId = 'wso2-popover-root', mode = 'modal'}) => {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const styles = useStyles();

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

  return createPortal(
    <PopoverContext.Provider value={{onClose}}>
      <div className={clsx(withVendorCSSClassPrefix('popover'), className)}>
        {mode === 'modal' && (
          <div className={withVendorCSSClassPrefix('popover-overlay')} style={styles['overlay']} onClick={onClose} />
        )}
        <div className={withVendorCSSClassPrefix('popover-content')} style={styles['content']}>
          {children}
        </div>
      </div>
    </PopoverContext.Provider>,
    portalEl,
  );
};

Popover.Header = PopoverHeader;
Popover.Content = PopoverContent;

export default Popover;
