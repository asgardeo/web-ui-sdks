import {forwardRef, HTMLAttributes, PropsWithChildren, ReactElement} from 'react';
import useAsgardeo from '../hooks/useAsgardeo';

/**
 * Interface for SignInButton component props.
 */
export type SignInButtonProps = HTMLAttributes<HTMLButtonElement>;

/**
 * SignInButton component. This button initiates the sign-in process when clicked.
 *
 * @example
 * ```tsx
 * import { SignInButton } from '@asgardeo/auth-react';
 *
 * const App = () => {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *   return (
 *     <SignInButton ref={buttonRef} className="custom-class" style={{ backgroundColor: 'blue' }}>
 *       Sign In
 *     </SignInButton>
 *   );
 * }
 * ```
 */
const SignInButton = forwardRef<HTMLButtonElement, PropsWithChildren<SignInButtonProps>>(
  ({children = 'Sign In', className, style, ...rest}, ref): ReactElement => {
    const {signIn} = useAsgardeo();

    const handleClick = async () => {
      try {
        await signIn();
      } catch (error) {
        throw new Error('Sign in failed: ' + (error instanceof Error ? error.message : String(error)));
      }
    };

    return (
      <button ref={ref} onClick={handleClick} className={className} style={style} type="button" {...rest}>
        {children}
      </button>
    );
  },
);

export default SignInButton;
