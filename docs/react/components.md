# Available Components

## UI Components

- [SignIn](/SignIn.md): A component that provides sign-in forms as configured in the login flow of asgardeo.

- [SignOutButton](./SignOutButton.md): A component that provides a sign-out button. When clicked, it initiates the sign-out process.

## Control Components

- [SignedIn](./SignedIn.md): A component that renders its children only when the user is signed in.

- [SignedOut](./SignedOut.md): A component that renders its children only when the user is not signed in.

## Provider Component

- [AsgardeoProvider](./components/asgardeo-provider): A context provider component that provides an Asgardeo context to all its children. It takes a `UIAuthConfig` object as a prop, which includes the configuration for the Asgardeo context.
