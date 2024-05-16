import "./App.css";
import { SignIn, SignedIn, SignedOut } from "../../../packages/react/src"; // ToDO: temporary

function App() {
  return (
    <>
      <SignIn />

      <SignedIn fallback={<div>Fallback content</div>}>
        <div>Protected content</div>
      </SignedIn>

      <SignedOut fallback={<div>signedout fallback</div>}>
        <div>Public content</div>
      </SignedOut>
    </>
  );
}

export default App;
