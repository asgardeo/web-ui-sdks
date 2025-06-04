import {SignInButton, SignedOut, SignOutButton, SignedIn, User} from '@asgardeo/react';
import './App.css';

function App() {
  return (
    <>
      <SignedOut>
        <SignInButton>Sign In</SignInButton>
      </SignedOut>
      <SignedIn>
        <User>
          {user => (
            <div className="user-info">
              <h1>
                Welcome, {user?.firstName} {user?.lastName}!
              </h1>
              <p>Email: {user?.email}</p>
            </div>
          )}
        </User>
        <SignOutButton>Logout</SignOutButton>
      </SignedIn>
    </>
  );
}

export default App;
