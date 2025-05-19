import {FC, PropsWithChildren, ReactNode} from 'react';
import useAsgardeo from '../hooks/useAsgardeo';

/**
 * Props for the SignedIn component.
 */
interface SignedInProps {
  /**
   * Content to show when the user is not signed in.
   */
  fallback?: ReactNode;
}

/**
 * A component that only renders its children when the user is signed in.
 *
 * @example
 * ```tsx
 * import { SignedIn } from '@asgardeo/auth-react';
 *
 * const App = () => {
 *   return (
 *     <SignedIn fallback={<p>Please sign in to continue</p>}>
 *       <p>Welcome! You are signed in.</p>
 *     </SignedIn>
 *   );
 * }
 * ```
 */
const SignedIn: FC<PropsWithChildren<SignedInProps>> = ({
  children,
  fallback = null
}) => {
  const {isSignedIn} = useAsgardeo();
  
  if (!isSignedIn) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default SignedIn;
