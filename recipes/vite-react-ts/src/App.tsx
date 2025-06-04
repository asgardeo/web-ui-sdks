import {UserDropdown, SignInButton, SignedOut, SignOutButton, SignedIn, User, UserProfile} from '@asgardeo/react';
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
        <UserDropdown
          menuItems={[
            {
              label: 'Manage Profile',
              icon: null,
              onClick: () => null,
            },
            {
              label: 'Logout',
              icon: null,
              onClick: () => null,
            },
          ]}
          portalId="custom-dropdown"
        />
        <UserProfile mode="popup" />
        <SignOutButton>Logout</SignOutButton>
      </SignedIn>
    </>
  );
}

export default App;
