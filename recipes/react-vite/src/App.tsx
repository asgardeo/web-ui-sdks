import "./App.css";
import {
  SignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "../../../packages/react/src"; // ToDO: temporary

function App() {
  return (
    <>
      <SignIn />

      <SignedIn fallback={<div>Fallback content</div>}>
        <div>Protected content</div>
        <SignOutButton />
      </SignedIn>

      <SignedOut fallback={<div>signedout fallback</div>}>
        <div>Public content</div>
        <SignInButton/>
      </SignedOut>
    </>
  );
}

export default App;
