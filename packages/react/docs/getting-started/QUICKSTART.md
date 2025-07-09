# React Quickstart

Welcome to the React Quickstart guide! In this document, you will learn to build a React app, add user sign-in and display user profile information using Asgardeo.

## What You Will Learn

- Create new React app using Vite
- Install @asgardeo/react package
- Add user sign-in and sign-out
- Display user profile information

## Prerequisites

Before you start, ensure you have the following:

- About 15 minutes
- Asgardeo account
- Install Node.js on your system
- Make sure you have a JavaScript package manager like npm, yarn, or pnpm
- A favorite text editor or IDE

## Example Source Code

[React Vite App Sample](../../samples/)

## 1. Configure an Application in Asgardeo

1. Sign into the Asgardeo Console and navigate to **Applications** > **New Application**.
2. Select **React** and complete the wizard by providing a suitable name and an authorized redirect URL.

**Example:**

- Name: `asgardeo-react`
- Authorized redirect URL: `http://localhost:5173`

Once you finish creating the application, note down the following values from its **Guide** tab. You will need them to configure Asgardeo React SDK.

- **Client ID** - The unique identifier for your application.
- **Base URL** - The base URL of your Asgardeo organization. This typically follows the format `https://api.asgardeo.io/t/<your-organization-name>`

> **Info**: The authorized redirect URL determines where Asgardeo should send users after they successfully log in. Typically, this will be the web address where your app is hosted. For this guide, we'll use `http://localhost:5173`, as the sample app will be accessible at this URL.

## 2. Create a React App Using Vite

Create (scaffold) your new React app using Vite:

```bash
npm create vite@latest asgardeo-react -- --template react
cd asgardeo-react
npm install
npm run dev
```

## 3. Install @asgardeo/react

Asgardeo React SDK provides all the components and hooks you need to integrate Asgardeo into your app. To get started, simply add the Asgardeo React SDK to the project. Make sure to stop the dev server you started in the previous step.

```bash
# Using npm
npm install @asgardeo/react

# Using pnpm
pnpm add @asgardeo/react

# Using yarn
yarn add @asgardeo/react
```

## 4. Add `<AsgardeoProvider />` to Your App

The `<AsgardeoProvider />` serves as a context provider for the SDK. You can integrate this provider to your app by wrapping the root component.

Add the following changes to the `main.jsx` file.

> **Important**: Replace below placeholders with your registered organization name in Asgardeo and the generated client-id from the app you registered in Asgardeo.
>
> - `<your-app-client-id>`
> - `https://api.asgardeo.io/t/<your-organization-name>`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AsgardeoProvider } from '@asgardeo/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AsgardeoProvider
      clientId="<your-app-client-id>"
      baseUrl="https://api.asgardeo.io/t/<your-organization-name>"
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
)
```

## 5. Add Sign-In and Sign-Out to Your App

Asgardeo SDK provides `SignInButton`, `SignOutButton` components to handle user sign-in and sign-out. You can use these components alongside `SignedIn` and `SignedOut` components to conditionally render content based on the user's logged in state.

Replace the existing content of the `App.jsx` file with following content:

```jsx
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@asgardeo/react'
import './App.css'

function App() {
  return (
    <header>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </header>
  )
}

export default App
```

## 6. Display Signed-In User's Profile Information

You can use the `User`, `UserProfile`, or `UserDropdown` components to access and display user profile information in a declarative way.

- **User**: The `User` component provides a render prop pattern to access user profile information:
- **UserProfile**: The `UserProfile` component provides a declarative way to display and update user profile information.
- **UserDropdown**: The `UserDropdown` component provides a dropdown menu with built-in user information and sign-out functionality.

```jsx
import { SignedIn, SignedOut, SignInButton, SignOutButton, User, UserDropdown, UserProfile } from '@asgardeo/react'
import './App.css'

function App() {
  return (
    <>
      <header>
        <SignedIn>
          <UserDropdown />
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </header>
      <main>
        <SignedIn>
          <User>
            {(user) => (
              <div>
                <p>Welcome back, {user.userName || user.username || user.sub}</p>
              </div>
            )}
          </User>
          <UserProfile />
        </SignedIn>
      </main>
    </>
  )
}

export default App
```

## 7. Run the App

To run the app, use the following command:

```bash
npm run dev
```

Visit your app's homepage at [http://localhost:5173](http://localhost:5173).

> **Important**: To try out sign-in and sign-out features, create a test user in Asgardeo by following [this guide](https://wso2.com/asgardeo/docs/guides/users/manage-users/#onboard-a-user).

## What's Next?

Now that you have basic authentication working, you can:

- [Explore all available components](../components/overview.md) to enhance your app.
