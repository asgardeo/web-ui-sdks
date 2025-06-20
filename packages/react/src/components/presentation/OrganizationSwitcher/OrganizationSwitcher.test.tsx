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

import React from 'react';
import {render} from '@testing-library/react';
import OrganizationSwitcher from './OrganizationSwitcher';
import {Organization} from './BaseOrganizationSwitcher';

// Mock the hooks
jest.mock('../../../contexts/Asgardeo/useAsgardeo');
jest.mock('../../../contexts/Organization/useOrganization');

const mockUseAsgardeo = require('../../../contexts/Asgardeo/useAsgardeo');
const mockUseOrganization = require('../../../contexts/Organization/useOrganization');

const mockOrganizations: Organization[] = [
  {id: '1', name: 'Organization 1'},
  {id: '2', name: 'Organization 2'},
];

describe('OrganizationSwitcher', () => {
  beforeEach(() => {
    mockUseAsgardeo.default.mockReturnValue({
      isSignedIn: true,
    });

    mockUseOrganization.default.mockReturnValue({
      currentOrganization: mockOrganizations[0],
      organizations: mockOrganizations,
      switchOrganization: jest.fn(),
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders OrganizationSwitcher when user is signed in', () => {
    const {container} = render(<OrganizationSwitcher />);
    expect(container).not.toBeEmptyDOMElement();
  });

  it('renders fallback when user is not signed in and fallback is provided', () => {
    mockUseAsgardeo.default.mockReturnValue({
      isSignedIn: false,
    });

    const fallbackElement = <div data-testid="fallback">Please sign in</div>;
    const {getByTestId} = render(<OrganizationSwitcher fallback={fallbackElement} />);

    expect(getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders empty when user is not signed in and no fallback provided', () => {
    mockUseAsgardeo.default.mockReturnValue({
      isSignedIn: false,
    });

    const {container} = render(<OrganizationSwitcher />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('uses context values when no props are provided', () => {
    const mockSwitchOrganization = jest.fn();
    mockUseOrganization.default.mockReturnValue({
      currentOrganization: mockOrganizations[0],
      organizations: mockOrganizations,
      switchOrganization: mockSwitchOrganization,
      isLoading: false,
      error: null,
    });

    render(<OrganizationSwitcher />);

    // Verify that the hook was called to get context values
    expect(mockUseOrganization.default).toHaveBeenCalled();
  });

  it('uses prop values when provided', () => {
    const propOrganizations: Organization[] = [{id: '3', name: 'Prop Organization'}];
    const propCurrentOrganization = propOrganizations[0];
    const propOnOrganizationSwitch = jest.fn();

    render(
      <OrganizationSwitcher
        organizations={propOrganizations}
        currentOrganization={propCurrentOrganization}
        onOrganizationSwitch={propOnOrganizationSwitch}
      />,
    );

    // Component should still get context for loading/error states but use prop values for data
    expect(mockUseOrganization.default).toHaveBeenCalled();
  });
});
