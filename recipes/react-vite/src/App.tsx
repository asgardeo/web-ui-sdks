import "./App.css";
import { SignIn, SignedIn } from "../../../packages/react/src"; // ToDO: temporary

function App() {
  return (
    <>
      <SignIn />

      <SignedIn fallback={<div>Fallback content</div>}>
        <div>Protected content</div>
      </SignedIn>
    </>
  );
}

export default App;
