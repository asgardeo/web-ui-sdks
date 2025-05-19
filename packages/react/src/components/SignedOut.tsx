import {FC, PropsWithChildren, ReactNode} from 'react';
import useAsgardeo from '../hooks/useAsgardeo';

/**
 * Props for the SignedOut component.
 */
interface SignedOutProps {
  /**
   * Content to show when the user is signed in.
   */
  fallback?: ReactNode;
}

/**
 * A component that only renders its children when the user is signed out.
 *
 * @example
 * ```tsx
 * import { SignedOut } from '@asgardeo/auth-react';
 *
 * const App = () => {
 *   return (
 *     <SignedOut fallback={<p>You are already signed in</p>}>
 *       <p>Please sign in to continue</p>
 *     </SignedOut>
 *   );
 * }
 * ```
 */
const SignedOut: FC<PropsWithChildren<SignedOutProps>> = ({children, fallback = null}) => {
  const {isSignedIn} = useAsgardeo();

  if (!isSignedIn) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default SignedOut;
