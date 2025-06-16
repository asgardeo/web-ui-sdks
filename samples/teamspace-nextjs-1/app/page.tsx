'use client';

import Link from 'next/link';
import styles from './page.module.css';
import {SignInButton, SignedIn, SignOutButton, SignedOut, User} from '@asgardeo/nextjs';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <SignedOut>
            <SignInButton>
              {({signIn, isLoading}) => (
                <button onClick={signIn} disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              )}
            </SignInButton>
          </SignedOut>
          <SignedOut>
            <SignInButton className={styles.primary}>Sign In with Redirect</SignInButton>
          </SignedOut>
          <SignedIn>
            <User>
              {({user}) => (
                <div className={styles.user}>
                  <img src={user?.profilePicture} alt="User Profile" className={styles.profilePicture} />
                  <h2>{user?.displayName}</h2>
                  <p>{user?.email}</p>
                </div>
              )}
            </User>
            <SignOutButton className={styles.secondary}>Sign Out</SignOutButton>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
