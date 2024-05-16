import "./App.css";
import {
  SignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useAuthentication,
} from "../../../packages/react/src"; // ToDO: temporary

function App() {
  const {user, accessToken} = useAuthentication();
  console.log(user);
  return (
    <>
      <SignIn />

      {/* <SignedIn fallback={<div>Fallback content</div>}>
        <div>Protected content</div>
        <SignOutButton />
        <div style={{textAlign: 'left'}}>
          {accessToken}
          {user && (
          <>
            {
              <div
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(user, null, 2).replace(
                    /\n/g,
                    "<br />"
                  ),
                }}
              />
            }
          </>
        )}</div>
      </SignedIn>

      <SignedOut fallback={<div>signedout fallback</div>}>
        <div>Public content</div>
        <SignInButton/>
      </SignedOut> */}
    </>
  );
}

export default App;
