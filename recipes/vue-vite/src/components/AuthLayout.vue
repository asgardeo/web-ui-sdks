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
const handleLogin = () => {
  console.log('Login button clicked')
}
</script>

<template>
  <div class="container">
    <div class="auth-card">
      <!-- Header -->
      <div class="header">
        <h1>Vue SPA Authentication Sample</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- Vue Logo -->
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg"
          alt="Vue Logo"
          class="logo"
        />

        <!-- Description -->
        <p class="description">
          Sample demo to showcase authentication for a Single Page Application via the OpenID
          Connect Authorization Code flow, which is integrated using the
          <a href="#" class="sdk-link">Asgardeo Auth Vue SDK</a>.
        </p>

        <!-- Login Button -->
        <button @click="handleLogin" class="login-button">Login</button>
      </div>

      <!-- Footer -->
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

.footer {
  padding-bottom: 1rem;
  text-align: center;
}

.wso2-logo {
  height: 1.25rem;
  opacity: 0.5;
}

/* Add these styles to your CSS */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>
