/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {Box, Button, CircularProgress} from '@oxygen-ui/react';
import React, {ReactElement, useContext, useState} from 'react';
import './sign-in-button.scss';
import AsgardeoContext from '../../contexts/asgardeo-context';
import AuthContext from '../../models/auth-context';
import {SignInButtonProps} from '../../models/sign-in';
import SignIn from '../SignIn/SignIn';

/**
 * SignInButton component. This button will render a modal with the SignIn component when clicked.
 *
 * @param {Object} props - Component props.
 * @param {ReactElement} props.customComponent - Optional custom component to be rendered.
 * @returns {ReactElement} Rendered SignInButton component.
 */
const SignInButton = (props: SignInButtonProps): ReactElement => {
  const {customComponent, showFooter = false, showLogo = false, showSignUp = false} = props;

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const authContext: AuthContext | undefined = useContext(AsgardeoContext);

  const openModal = (): void => {
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };

  if (authContext.isBrandingLoading) {
    return (
      <Button className="asgardeo-sign-in-button">
        <CircularProgress />
      </Button>
    );
  }

  return (
    <div className="asgardeo">
      {customComponent ? (
        React.cloneElement(customComponent, {
          onClick: openModal,
        })
      ) : (
        <Button className="asgardeo-sign-in-button" variant="contained" onClick={openModal}>
          Sign In
        </Button>
      )}

      {modalVisible && (
        <Box className="popup-box">
          <SignIn showFooter={showFooter} showLogo={showLogo} showSignUp={showSignUp} />
        </Box>
      )}

      {modalVisible && <Box className="popup-box-overlay" onClick={closeModal} />}
    </div>
  );
};

export default SignInButton;
