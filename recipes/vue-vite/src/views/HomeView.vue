<script setup lang="ts">
import { ref } from 'vue'
import { type SignInConfig, type BasicUserInfo } from '@asgardeo/vue'
import { useAsgardeo } from '@asgardeo/vue'

const config: SignInConfig = {
  signInRedirectURL: 'http://localhost:5173/',
  signOutRedirectURL: 'http://localhost:5173/',
  clientID: 'DlhbfqNZEP0CGRN2933Aa1cwoAMa',
  baseUrl: 'https://api.asgardeo.io/t/thineth6424',
  scope: 'openid profile',
}

const auth = useAsgardeo()
const {
  signIn,
  httpRequestAll,
  disableHttpHandler,
  enableHttpHandler,
  getAccessToken,
  getDecodedIDToken,
  getHttpClient,
  getIDToken,
  getOIDCServiceEndpoints,
  httpRequest,
  isAuthenticated,
  signOut,
} = useAsgardeo()
const userInfo = ref<BasicUserInfo | null>(null)

const getUser = async () => {
  try {
    const user = await auth?.getBasicUserInfo()
    console.log(user)
    if (user) {
      userInfo.value = user
    }
  } catch (error) {
    console.error('Error fetching user info', error)
  }
}
const login = async () => {
  try {
    await signIn()
  } catch (error) {
    console.error('Sign in failed', error)
  }
}

const logout = async () => {
  try {
    await signOut()
  } catch (error) {
    console.error('Sign out failed', error)
  }
}

const testResult = ref<string>('')

const testDisableHttpHandler = async () => {
  try {
    const result = await disableHttpHandler()
    testResult.value = `Disabled HTTP Handler: ${result}`
    console.log(result)
  } catch (error) {
    testResult.value = 'Error disabling HTTP Handler'
    console.error(error)
  }
}

const testEnableHttpHandler = async () => {
  try {
    const result = await enableHttpHandler()
    testResult.value = `Enabled HTTP Handler: ${result}`
    console.log(result)
  } catch (error) {
    testResult.value = 'Error enabling HTTP Handler'
    console.error(error)
  }
}

const testGetAccessToken = async () => {
  try {
    const token = await getAccessToken()
    testResult.value = `Access Token: ${token}`
    console.log(token)
  } catch (error) {
    testResult.value = 'Error fetching Access Token'
    console.error(error)
  }
}

const testGetDecodedIDToken = async () => {
  try {
    const decodedToken = await getDecodedIDToken()
    testResult.value = `Decoded ID Token: ${JSON.stringify(decodedToken)}`
    console.log(decodedToken)
  } catch (error) {
    testResult.value = 'Error fetching Decoded ID Token'
    console.error(error)
  }
}

const testGetHttpClient = async () => {
  try {
    const client = await getHttpClient()
    if (typeof client === 'function') {
      const httpClient = await client({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos/1',
      })
      console.log('Resolved HTTP Client:', httpClient)
    } else {
      console.log('HTTP Client Object:', client)
    }
  } catch (error) {
    console.error('Error fetching HTTP Client:', error)
  }
}

const testGetIDToken = async () => {
  try {
    const idToken = await getIDToken()
    testResult.value = `ID Token: ${idToken}`
    console.log(idToken)
  } catch (error) {
    testResult.value = 'Error fetching ID Token'
    console.error(error)
  }
}

const testGetOIDCServiceEndpoints = async () => {
  try {
    const endpoints = await getOIDCServiceEndpoints()
    testResult.value = `OIDC Endpoints: ${JSON.stringify(endpoints)}`
    console.log(endpoints)
  } catch (error) {
    testResult.value = 'Error fetching OIDC Endpoints'
    console.error(error)
  }
}

const testHttpRequest = async () => {
  try {
    const response = await httpRequest({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
    })
    testResult.value = `HTTP Response: ${JSON.stringify(response?.data)}`
    console.log(response)
  } catch (error) {
    testResult.value = 'Error making HTTP Request'
    console.error(error)
  }
}

const testHttpRequestAll = async () => {
  try {
    const responses = await httpRequestAll([
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos/1',
      },
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos/2',
      },
    ])
    testResult.value = `HTTP Responses: ${JSON.stringify(responses?.map((res) => res.data))}`
    console.log(responses)
  } catch (error) {
    testResult.value = 'Error making multiple HTTP Requests'
    console.error(error)
  }
}
const testIsAuthenticated = async () => {
  try {
    const result = await isAuthenticated()
    testResult.value = `Is Authenticated: ${result}`
    console.log(result)
  } catch (error) {
    testResult.value = 'Error checking authentication'
    console.error(error)
  }
}
</script>

<template>
  <main>
    <button @click="login">Login</button>
    <button @click="getUser">User</button>
    <button @click="logout">Logout</button>

    <div>
      <h3>Test Auth Context Methods</h3>
      <button @click="testDisableHttpHandler">Disable HTTP Handler</button>
      <button @click="testEnableHttpHandler">Enable HTTP Handler</button>
      <button @click="testGetAccessToken">Get Access Token</button>
      <button @click="testGetDecodedIDToken">Get Decoded ID Token</button>
      <button @click="testGetHttpClient">Get HTTP Client</button>
      <button @click="testGetIDToken">Get ID Token</button>
      <button @click="testGetOIDCServiceEndpoints">Get OIDC Endpoints</button>
      <button @click="testHttpRequest">Make HTTP Request</button>
      <button @click="testHttpRequestAll">Make Multiple HTTP Requests</button>
      <button @click="testIsAuthenticated">isAuthenticated</button>

      <p><strong>Result:</strong> {{ testResult }}</p>
    </div>
  </main>
</template>

<style scoped>
button {
  display: block;
  margin: 5px;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
}

p {
  margin-top: 10px;
  font-size: 16px;
}
</style>
