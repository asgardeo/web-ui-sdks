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

import {
  ApplicationNativeAuthenticationAuthenticator,
  ApplicationNativeAuthenticationAuthenticatorParamType,
  FieldType,
} from '@asgardeo/browser';
import {FC} from 'react';
import {createField} from '../../../factories/FieldFactory';
import Button from '../../../primitives/Button/Button';
import {BaseSignInOptionProps} from './SignInOptionFactory';
import useTranslation from '../../../../hooks/useTranslation';

/**
 * Identifier First Sign-In Option Component.
 * Handles identifier-first authentication flow (username first, then password).
 */
const IdentifierFirst: FC<BaseSignInOptionProps> = ({
  authenticator,
  formValues,
  isLoading,
  onInputChange,
  onSubmit,
  inputClassName = '',
  buttonClassName = '',
  preferences,
}) => {
  const {t} = useTranslation(preferences?.i18n);

  const formFields = authenticator.metadata?.params?.sort((a, b) => a.order - b.order) || [];

  return (
    <>
      {formFields.map(param => (
        <div key={param.param} style={{marginBottom: '1rem'}}>
          {createField({
            name: param.param,
            type:
              param.type === ApplicationNativeAuthenticationAuthenticatorParamType.String
                ? param.confidential
                  ? FieldType.Password
                  : FieldType.Text
                : FieldType.Text,
            label: param.displayName,
            required: authenticator.requiredParams.includes(param.param),
            value: formValues[param.param] || '',
            onChange: value => onInputChange(param.param, value),
            disabled: isLoading,
            className: inputClassName,
          })}
        </div>
      ))}

      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className={buttonClassName}
        color="primary"
        variant="solid"
        fullWidth
        style={{marginBottom: '1rem'}}
      >
        {t('identifier.first.submit.button')}
      </Button>
    </>
  );
};

export default IdentifierFirst;
