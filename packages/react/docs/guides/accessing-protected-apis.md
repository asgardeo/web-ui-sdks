# Accessing Protected APIs

This guide shows how to make authenticated API calls to protected resources using the Asgardeo React SDK. The SDK provides an authenticated `http` module that automatically handles authentication headers and token refresh.

## Overview

When your application is wrapped with `AsgardeoProvider`, you can use the `useAsgardeo` hook to access the authenticated `http` module. This module has the following features:

- Includes the necessary authentication headers (Bearer token)
- Handles token refresh when tokens expire
- Provides methods like `request()` and `requestAll()` for making API calls

## Basic Usage

```tsx
import React, { useEffect, useState } from 'react';
import { useAsgardeo } from '@asgardeo/react';

export default function UserProfile() {
  const { http, isSignedIn } = useAsgardeo();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    (async () => {
      try {
        const response = await http.request({
          url: 'https://api.asgardeo.io/t/<your-organization-name>/scim2/Me',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/scim+json',
          },
          method: 'GET',
        });

        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    })();
  }, [http, isSignedIn]);

  if (!isSignedIn) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      {userData && (
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      )}
    </div>
  );
}
```

## Multiple API Calls with `requestAll()`

When you need to make multiple API calls simultaneously, you can use the `http.requestAll()` method:

```tsx
import React, { useEffect, useState } from 'react';
import { useAsgardeo } from '@asgardeo/react';

export default function UserProfile() {
  const { http, isSignedIn } = useAsgardeo();
  const [userData, setUserData] = useState({
    profile: null,
    discoverableApplications: [],
  });

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    const requests = [];

    requests.push({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      url: 'https://api.asgardeo.io/t/<your-organization-name>/api/users/v1/me/applications',
    });

    requests.push({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/scim+json',
      },
      method: 'GET',
      url: 'https://api.asgardeo.io/t/<your-organization-name>/scim2/Me',
    });

    (async () => {
      try {
        const response = await http.requestAll(requests);

        setUserData({
          discoverableApplications: response[0].data.applications,
          profile: response[1].data,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [http, isSignedIn]);

  return <pre>{JSON.stringify(userData, null, 4)}</pre>;
}
```

## Making Different Types of API Calls

### GET Request

```tsx
const fetchUsers = async () => {
  try {
    const response = await http.request({
      url: 'https://api.asgardeo.io/t/<your-organization-name>/scim2/Users',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/scim+json',
      },
      method: 'GET',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
```

### POST Request

```tsx
const createUser = async (userData) => {
  try {
    const response = await http.request({
      url: 'https://api.asgardeo.io/t/<your-organization-name>/scim2/Users',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/scim+json',
      },
      method: 'POST',
      data: userData,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
```

### PUT Request

```tsx
const updateUser = async (userId, userData) => {
  try {
    const response = await http.request({
      url: `https://api.asgardeo.io/t/<your-organization-name>/scim2/Users/${userId}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/scim+json',
      },
      method: 'PUT',
      data: userData,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
```

### DELETE Request

```tsx
const deleteUser = async (userId) => {
  try {
    const response = await http.request({
      url: `https://api.asgardeo.io/t/<your-organization-name>/scim2/Users/${userId}`,
      headers: {
        Accept: 'application/json',
      },
      method: 'DELETE',
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
```

## Bring your own HTTP Client

If you prefer to use your own HTTP client (like the native `fetch` API), you can use the `getAccessToken()` method to manually add the authorization header:

```tsx
import React, { useEffect, useState } from 'react';
import { useAsgardeo } from '@asgardeo/react';

export default function UserProfile() {
  const { isSignedIn, getAccessToken } = useAsgardeo();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    (async () => {
      try {
        const response = await fetch('https://api.asgardeo.io/t/<your-organization-name>/scim2/Me', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/scim+json',
            Authorization: `Bearer ${await getAccessToken()}`,
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        setUserData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [isSignedIn, getAccessToken]);

  if (!isSignedIn) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      {userData && (
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      )}
    </div>
  );
}
```
