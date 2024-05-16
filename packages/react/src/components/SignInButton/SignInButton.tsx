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

import {Box, Button} from '@oxygen-ui/react';
import React, {ReactElement, useState} from 'react';
import './sign-in-button.scss';
import SignIn from '../SignIn/SignIn';

const SignInButton = ({customComponent}: {customComponent?: ReactElement}): ReactElement => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (): void => {
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };

  return (
    <div className="asgardeo" style={{padding: '2rem'}}>
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
          <SignIn />
        </Box>
      )}

      {modalVisible && <Box className="popup-box-overlay" onClick={closeModal} />}
    </div>
  );
};

export default SignInButton;
