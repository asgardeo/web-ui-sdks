import {SignInButton, SignedOut, SignedIn, SignOutButton} from '@asgardeo/react';
import './App.css';

function App() {
  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
      </header>
    </>
  );
}

export default App;
