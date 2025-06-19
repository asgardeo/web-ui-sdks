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
            <Link href="/signin" className={styles.primary} />
          </SignedOut>
          <SignedOut>
            <SignInButton className={styles.primary}>Sign In with Redirect</SignInButton>
          </SignedOut>
          <SignedIn>
            <User>
              {({user}) => (
                <div className={styles.user}>
                  <img src={user?.profileUrl} alt="User Profile" className={styles.profilePicture} />
                  <h2>{user?.orgName}</h2>
                  <p>{user?.username}</p>
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
