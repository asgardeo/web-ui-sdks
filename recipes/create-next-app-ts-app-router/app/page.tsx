import styles from './page.module.css';
import {SignInButton} from '@asgardeo/next';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <SignInButton className={styles.primary}>Sign In</SignInButton>
        </div>
      </main>
    </div>
  );
}
