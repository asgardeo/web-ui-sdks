import {forwardRef, HTMLAttributes, PropsWithChildren} from 'react';
import useAsgardeo from '../hooks/useAsgardeo';

/**
 * Interface for SignOutButton component props.
 */
export type SignOutButtonProps = HTMLAttributes<HTMLButtonElement>;

/**
 * SignOutButton component. This button initiates the sign-out process when clicked.
 *
 * @example
 * ```tsx
 * import { SignOutButton } from '@asgardeo/auth-react';
 *
 * const App = () => {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *   return (
 *     <SignOutButton ref={buttonRef} className="custom-class" style={{ backgroundColor: 'blue' }}>
 *       Sign Out
 *     </SignOutButton>
 *   );
 * }
 * ```
 */
const SignOutButton = forwardRef<HTMLButtonElement, PropsWithChildren<SignOutButtonProps>>(
  ({children = 'Sign Out', className, style, ...rest}, ref) => {
    const {signOut} = useAsgardeo();

    const handleClick = async () => {
      try {
        await signOut();
      } catch (error) {
        throw new Error('Sign out failed: ' + (error instanceof Error ? error.message : String(error)));
      }
    };

    return (
      <button ref={ref} onClick={handleClick} className={className} style={style} type="button" {...rest}>
        {children}
      </button>
    );
  },
);

export default SignOutButton;
