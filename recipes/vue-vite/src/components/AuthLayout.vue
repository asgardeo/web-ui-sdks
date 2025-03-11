<!--
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 -->

<script setup lang="ts">
import footerImage from '@/images/footer.png'
import { useAsgardeo } from '@asgardeo/vue'
import { ref } from 'vue'

const auth = useAsgardeo()
const { signIn, signOut, getAccessToken, state } = auth

const tokenInfo = ref('')
const showTokenInfo = ref(false)

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
    tokenInfo.value = ''
    showTokenInfo.value = false
  } catch (error) {
    console.error('Sign out failed', error)
  }
}

const viewAccessToken = async () => {
  try {
    tokenInfo.value = await getAccessToken()
    showTokenInfo.value = true
  } catch (error) {
    console.error('Error fetching access token', error)
  }
}

const hideToken = () => {
  showTokenInfo.value = false
}
</script>

<template>
  <div class="container">
    <div class="auth-card">
      <div class="header">
        <h1>Asgardeo Authentication Demo</h1>
      </div>

      <div class="content">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg"
          alt="Vue Logo"
          class="logo"
        />

        <p class="description">
          Practical demonstration of authentication for Single Page Applications using the OpenID
          Connect Authorization Code flow with the
          <a
            href="https://github.com/asgardeo/web-ui-sdks/tree/main/packages/vue"
            target="_blank"
            class="sdk-link"
            >Asgardeo Auth Vue SDK</a
          >.
        </p>

        <div v-if="state.isLoading" class="status-message">
          <p>Checking authentication status...</p>
        </div>

        <div v-else-if="state.isAuthenticated" class="user-info">
          <h2 v-if="state.isAuthenticated">Welcome, {{ state.displayName }}</h2>
          <h2 v-else>Welcome, loading user data...</h2>
          <p v-if="state.email" class="user-email">{{ state.email }}</p>

          <div class="action-buttons">
            <button @click="viewAccessToken" class="action-button" :disabled="state.isLoading">
              View Access Token
            </button>
            <button @click="logout" class="logout-button" :disabled="state.isLoading">
              Logout
            </button>
          </div>

          <div v-if="showTokenInfo" class="token-info">
            <h3>Access Token</h3>
            <div class="token-container">
              <p class="token-text">{{ tokenInfo }}</p>
            </div>
            <button @click="hideToken" class="hide-button">Hide Token</button>
          </div>
        </div>

        <div v-else class="login-container">
          <button @click="login" class="login-button" :disabled="state.isLoading">
            Login with Asgardeo
          </button>
        </div>
      </div>

      <div class="footer">
        <img :src="footerImage" alt="WSO2 Logo" class="wso2-logo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.auth-card {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #f76707;
  color: white;
  padding: 1rem;
  text-align: center;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0;
}

.content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 6rem;
  margin-bottom: 1.5rem;
}

.description {
  color: #4b5563;
  text-align: center;
  max-width: 32rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.sdk-link {
  color: #f76707;
  text-decoration: none;
}

.sdk-link:hover {
  text-decoration: underline;
}

.login-button {
  background-color: #1f2937;
  color: white;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #111827;
}

.login-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.user-info {
  width: 100%;
  max-width: 32rem;
  text-align: center;
}

.user-info h2 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.user-email {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.action-button {
  background-color: #1f2937;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #111827;
}

.action-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.logout-button {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #dc2626;
}

.logout-button:disabled {
  background-color: #f87171;
  cursor: not-allowed;
}

.token-info {
  margin-top: 1rem;
  width: 100%;
  text-align: left;
}

.token-info h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.token-container {
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1rem;
  max-height: 5rem;
  overflow-y: auto;
}

.token-text {
  word-break: break-all;
  font-family: monospace;
  font-size: 0.75rem;
  margin: 0;
}

.hide-button {
  background-color: #9ca3af;
  color: white;
  padding: 0.25rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.hide-button:hover {
  background-color: #6b7280;
}

.status-message {
  color: #4b5563;
  margin-bottom: 1rem;
}

.footer {
  padding-bottom: 1rem;
  text-align: center;
}

.wso2-logo {
  height: 1.25rem;
  opacity: 0.5;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>
