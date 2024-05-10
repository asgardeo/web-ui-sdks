/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {Box, BoxProps, TextField, TextFieldProps} from '@oxygen-ui/react';
import clsx from 'clsx';
import React, {
  useState,
  useRef,
  useEffect,
  MutableRefObject,
  ForwardRefExoticComponent,
  forwardRef,
  ElementType,
  ReactElement,
} from 'react';
import {WithWrapperProps} from '../models/component';
import './sign-in-pin-input.scss';

const COMPONENT_NAME: string = 'SignInPinInput';

export type SignInPinInputProps<C extends ElementType = ElementType> = {
  component?: C;
  itemProps?: TextFieldProps;
  length: number;
  onPinChange?: (pin: string) => void;
} & Omit<BoxProps, 'component'>;

const SignInPinInput: ForwardRefExoticComponent<SignInPinInputProps> & WithWrapperProps = forwardRef(
  <C extends ElementType>(props: SignInPinInputProps<C>, ref: MutableRefObject<HTMLHRElement>): ReactElement => {
    const {length, onPinChange, className, itemProps, ...rest} = props;

    const classes: string = clsx(`Oxygen${COMPONENT_NAME}`, className);

    const [totp, setTotp] = useState(Array(length).fill('')); // Initialize a state variable for the TOTP

    const refs: MutableRefObject<React.RefObject<HTMLInputElement>[]> = useRef(
      totp.map(() => React.createRef<HTMLInputElement>()),
    );

    useEffect(() => {
      /**
       * If all fields are filled, call onPinChange
       */
      if (onPinChange && totp.every((value: string) => value !== '')) {
        onPinChange(totp.join(''));
      }
    }, [totp, onPinChange]);

    const handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTotp: string[] = [...totp];
      newTotp[index] = event.target.value;
      setTotp(newTotp);

      /**
       * If a character is entered and there's a next TextField, focus it
       */
      if (event.target.value && index < totp.length - 1) {
        refs.current[index + 1].current?.focus();
      }
    };

    const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      /**
       * If the backspace key is pressed and the current field is empty
       */
      if (event.key === 'Backspace' && totp[index] === '') {
        /**
         * Prevent the default action to stop deleting characters in the previous field
         */
        event.preventDefault();

        /**
         * If there's a previous field, focus it
         */
        if (index > 0) {
          refs.current[index - 1].current?.focus();

          /**
           * Clear the value of the previous field
           */
          const newTotp: string[] = [...totp];
          newTotp[index - 1] = '';
          setTotp(newTotp);
        }
      }
    };

    return (
      <Box className={classes} ref={ref} {...rest}>
        {[...Array(length)].map((_: number, index: number) => (
          <TextField
            key={`pincode-${index + 1}`}
            id={`pincode-${index + 1}`}
            name="number"
            placeholder="."
            className="input"
            value={totp[index]}
            onChange={handleChange(index)}
            inputRef={refs.current[index]}
            inputProps={{maxLength: 1}}
            onKeyDown={handleKeyDown(index)}
            {...itemProps}
          />
        ))}
      </Box>
    );
  },
) as ForwardRefExoticComponent<SignInPinInputProps> & WithWrapperProps;

SignInPinInput.muiName = COMPONENT_NAME;
export default SignInPinInput;
