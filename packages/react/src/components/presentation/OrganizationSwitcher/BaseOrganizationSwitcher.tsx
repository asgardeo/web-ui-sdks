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

import {withVendorCSSClassPrefix} from '@asgardeo/browser';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react';
import clsx from 'clsx';
import {CSSProperties, FC, ReactElement, ReactNode, useMemo, useState} from 'react';
import useTheme from '../../../contexts/Theme/useTheme';
import useTranslation from '../../../hooks/useTranslation';
import {Avatar} from '../../primitives/Avatar/Avatar';
import Button from '../../primitives/Button/Button';
import Building from '../../primitives/Icons/Building';
import Check from '../../primitives/Icons/Check';
import ChevronDown from '../../primitives/Icons/ChevronDown';
import Typography from '../../primitives/Typography/Typography';

const useStyles = () => {
  const {theme, colorScheme} = useTheme();

  return useMemo(
    () => ({
      trigger: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${theme.spacing.unit}px`,
        padding: `${theme.spacing.unit * 0.75}px ${theme.spacing.unit}px`,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.background.surface,
        cursor: 'pointer',
        borderRadius: theme.borderRadius.medium,
        minWidth: '160px',
        '&:hover': {
          backgroundColor: theme.colors.background,
        },
      } as CSSProperties,
      orgName: {
        color: theme.colors.text.primary,
        fontWeight: 500,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
      } as CSSProperties,
      dropdownContent: {
        minWidth: '280px',
        maxWidth: '400px',
        backgroundColor: theme.colors.background.surface,
        borderRadius: theme.borderRadius.medium,
        boxShadow: `0 4px 6px -1px ${
          colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'
        }, 0 2px 4px -1px ${colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.06)'}`,
        border: `1px solid ${theme.colors.border}`,
        outline: 'none',
        zIndex: 1000,
      } as CSSProperties,
      dropdownMenu: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      } as CSSProperties,
      menuItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: `${theme.spacing.unit}px`,
        padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 2}px`,
        width: '100%',
        color: theme.colors.text.primary,
        textDecoration: 'none',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        textAlign: 'left',
        borderRadius: theme.borderRadius.medium,
        transition: 'background-color 0.15s ease-in-out',
      } as CSSProperties,
      organizationInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing.unit / 4}px`,
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
      } as CSSProperties,
      organizationName: {
        color: theme.colors.text.primary,
        fontSize: '0.875rem',
        fontWeight: 500,
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      } as CSSProperties,
      organizationMeta: {
        color: theme.colors.text.secondary,
        fontSize: '0.75rem',
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      } as CSSProperties,
      divider: {
        margin: `${theme.spacing.unit * 0.5}px 0`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      dropdownHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: `${theme.spacing.unit}px`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        borderBottom: `1px solid ${theme.colors.border}`,
      } as CSSProperties,
      loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        gap: `${theme.spacing.unit}px`,
      } as CSSProperties,
      loadingText: {
        color: theme.colors.text.secondary,
        fontSize: '0.875rem',
      } as CSSProperties,
      errorContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        padding: `${theme.spacing.unit * 2}px`,
      } as CSSProperties,
      errorText: {
        color: theme.colors.text.secondary,
        fontSize: '0.875rem',
        textAlign: 'center',
      } as CSSProperties,
    }),
    [theme, colorScheme],
  );
};

interface MenuItem {
  href?: string;
  icon?: ReactNode;
  label: ReactNode;
  onClick?: () => void;
}

/**
 * Interface for organization data.
 */
export interface Organization {
  /**
   * Avatar URL for the organization.
   */
  avatar?: string;
  /**
   * Unique identifier for the organization.
   */
  id: string;
  /**
   * Number of members in the organization.
   */
  memberCount?: number;
  /**
   * Additional metadata for the organization.
   */
  metadata?: Record<string, any>;
  /**
   * Display name of the organization.
   */
  name: string;
  /**
   * User's role in the organization.
   */
  role?: 'owner' | 'admin' | 'member';
  /**
   * URL slug for the organization.
   */
  slug?: string;
}

/**
 * Props interface for the BaseOrganizationSwitcher component.
 */
export interface BaseOrganizationSwitcherProps {
  /**
   * Optional size for the avatar
   */
  avatarSize?: number;
  /**
   * Custom class name for styling.
   */
  className?: string;
  /**
   * Currently selected organization.
   */
  currentOrganization?: Organization;
  /**
   * Error message to display.
   */
  error?: string;
  /**
   * Optional element to render when no organization is selected.
   */
  fallback?: ReactElement;
  /**
   * Whether the component is in a loading state.
   */
  loading?: boolean;
  /**
   * Additional menu items to display at the bottom of the dropdown.
   */
  menuItems?: MenuItem[];
  /**
   * Handler for when an organization is selected.
   */
  onOrganizationSwitch: (organization: Organization) => void;
  /**
   * List of available organizations.
   */
  organizations: Organization[];
  /**
   * The HTML element ID where the portal should be mounted
   */
  portalId?: string;
  /**
   * Custom render function for the error state.
   */
  renderError?: (error: string) => ReactElement;
  /**
   * Custom render function for the loading state.
   */
  renderLoading?: () => ReactElement;
  /**
   * Custom render function for the organization item.
   */
  renderOrganization?: (organization: Organization, isSelected: boolean) => ReactElement;
  /**
   * Whether to show the member count.
   */
  showMemberCount?: boolean;
  /**
   * Whether to show the role badge.
   */
  showRole?: boolean;
  /**
   * Show organization name next to avatar in the trigger button
   */
  showTriggerLabel?: boolean;
  /**
   * Custom styles for the component.
   */
  style?: React.CSSProperties;
}

/**
 * BaseOrganizationSwitcher component displays an organization selector with a dropdown menu.
 * When clicked, it shows a popover with available organizations to switch between.
 * This component serves as the base for framework-specific implementations.
 */
export const BaseOrganizationSwitcher: FC<BaseOrganizationSwitcherProps> = ({
  organizations,
  currentOrganization,
  loading = false,
  error,
  onOrganizationSwitch,
  className = '',
  style,
  renderOrganization,
  renderLoading,
  renderError,
  showRole = false,
  showMemberCount = true,
  menuItems = [],
  portalId = 'asgardeo-organization-switcher',
  showTriggerLabel = true,
  avatarSize = 24,
  fallback = null,
}): ReactElement => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const {theme, colorScheme} = useTheme();
  const {t} = useTranslation();

  const hoverBackgroundColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end',
    middleware: [offset(5), flip({fallbackAxisSideDirection: 'end'}), shift({padding: 5})],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss, role]);

  if (fallback && !currentOrganization && !loading && organizations.length === 0) {
    return fallback;
  }

  const handleOrganizationSwitch = (organization: Organization) => {
    onOrganizationSwitch(organization);
    setIsOpen(false);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const defaultRenderOrganization = (organization: Organization, isSelected: boolean) => (
    <>
      <Avatar
        imageUrl={organization.avatar}
        name={organization.name}
        size={avatarSize * 1.25}
        alt={`${organization.name} avatar`}
      />
      <div style={styles.organizationInfo}>
        <Typography variant="body2" fontWeight="medium" style={styles.organizationName}>
          {organization.name}
        </Typography>
        <div style={styles.organizationMeta}>
          {showMemberCount && organization.memberCount !== undefined && (
            <span>
              {organization.memberCount}{' '}
              {organization.memberCount === 1 ? t('organization.switcher.member') : t('organization.switcher.members')}
            </span>
          )}
          {showRole && organization.role && showMemberCount && organization.memberCount !== undefined && (
            <span> • </span>
          )}
          {showRole && organization.role && <span style={{textTransform: 'capitalize'}}>{organization.role}</span>}
        </div>
      </div>
      {isSelected && <Check width="16" height="16" color={theme.colors.text.primary} />}
    </>
  );

  const defaultRenderLoading = () => (
    <div style={styles.loadingContainer}>
      <Typography variant="caption" style={styles.loadingText}>
        {t('organization.switcher.loading.organizations')}
      </Typography>
    </div>
  );

  const defaultRenderError = (errorMessage: string) => (
    <div style={styles.errorContainer}>
      <Typography variant="caption" style={styles.errorText}>
        {errorMessage}
      </Typography>
    </div>
  );

  return (
    <div className={clsx(withVendorCSSClassPrefix('organization-switcher'), className)} style={style}>
      <Button
        ref={refs.setReference}
        className={withVendorCSSClassPrefix('organization-switcher__trigger')}
        style={styles.trigger}
        color="tertiary"
        variant="outline"
        size="medium"
        {...getReferenceProps()}
      >
        {currentOrganization ? (
          <>
            <Avatar
              imageUrl={currentOrganization.avatar}
              name={currentOrganization.name}
              size={avatarSize}
              alt={`${currentOrganization.name} avatar`}
            />
            {showTriggerLabel && (
              <Typography
                variant="body2"
                className={withVendorCSSClassPrefix('organization-switcher__trigger-label')}
                style={styles.orgName}
              >
                {currentOrganization.name}
              </Typography>
            )}
          </>
        ) : (
          <>
            <Building width={avatarSize} height={avatarSize} />
            {showTriggerLabel && (
              <Typography
                variant="body2"
                className={withVendorCSSClassPrefix('organization-switcher__trigger-label')}
                style={styles.orgName}
              >
                {t('organization.switcher.select.organization')}
              </Typography>
            )}
          </>
        )}
        <ChevronDown width="16" height="16" />
      </Button>

      {isOpen && (
        <FloatingPortal id={portalId}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              className={withVendorCSSClassPrefix('organization-switcher__content')}
              style={{...floatingStyles, ...styles.dropdownContent}}
              {...getFloatingProps()}
            >
              {/* Header */}
              <div className={withVendorCSSClassPrefix('organization-switcher__header')} style={styles.dropdownHeader}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: theme.colors.text.secondary,
                  }}
                >
                  {t('organization.switcher.switch.organization')}
                </Typography>
              </div>

              {/* Content */}
              <div className={withVendorCSSClassPrefix('organization-switcher__menu')} style={styles.dropdownMenu}>
                {loading ? (
                  renderLoading ? (
                    renderLoading()
                  ) : (
                    defaultRenderLoading()
                  )
                ) : error ? (
                  renderError ? (
                    renderError(error)
                  ) : (
                    defaultRenderError(error)
                  )
                ) : (
                  <>
                    {organizations.map(organization => {
                      const isSelected = currentOrganization?.id === organization.id;
                      return (
                        <Button
                          key={organization.id}
                          onClick={() => handleOrganizationSwitch(organization)}
                          className={withVendorCSSClassPrefix('organization-switcher__menu-item')}
                          color="tertiary"
                          variant="text"
                          size="small"
                          style={{
                            ...styles.menuItem,
                            backgroundColor:
                              hoveredItemIndex === organizations.indexOf(organization)
                                ? hoverBackgroundColor
                                : 'transparent',
                          }}
                          onMouseEnter={() => setHoveredItemIndex(organizations.indexOf(organization))}
                          onMouseLeave={() => setHoveredItemIndex(null)}
                        >
                          {renderOrganization
                            ? renderOrganization(organization, isSelected)
                            : defaultRenderOrganization(organization, isSelected)}
                        </Button>
                      );
                    })}

                    {/* Menu Items */}
                    {menuItems.length > 0 && (
                      <>
                        <div
                          className={withVendorCSSClassPrefix('organization-switcher__menu-divider')}
                          style={styles.divider}
                        />
                        {menuItems.map((item, index) => (
                          <div key={index}>
                            {item.href ? (
                              <a
                                href={item.href}
                                style={{
                                  ...styles.menuItem,
                                  backgroundColor:
                                    hoveredItemIndex === organizations.length + index
                                      ? hoverBackgroundColor
                                      : 'transparent',
                                }}
                                className={withVendorCSSClassPrefix('organization-switcher__menu-item')}
                                onMouseEnter={() => setHoveredItemIndex(organizations.length + index)}
                                onMouseLeave={() => setHoveredItemIndex(null)}
                                onFocus={() => setHoveredItemIndex(organizations.length + index)}
                                onBlur={() => setHoveredItemIndex(null)}
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </a>
                            ) : (
                              <Button
                                onClick={() => handleMenuItemClick(item)}
                                style={{
                                  ...styles.menuItem,
                                  backgroundColor:
                                    hoveredItemIndex === organizations.length + index
                                      ? hoverBackgroundColor
                                      : 'transparent',
                                }}
                                className={withVendorCSSClassPrefix('organization-switcher__menu-item')}
                                color="tertiary"
                                variant="text"
                                size="small"
                                startIcon={item.icon}
                                onMouseEnter={() => setHoveredItemIndex(organizations.length + index)}
                                onMouseLeave={() => setHoveredItemIndex(null)}
                              >
                                {item.label}
                              </Button>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
};

export default BaseOrganizationSwitcher;
