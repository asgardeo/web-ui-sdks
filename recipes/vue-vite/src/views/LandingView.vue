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

<script setup>
import vueLogo from '../assets/logo.svg'
import asgardeoLogo from '../assets/asgardeo.svg'

import SignInBtn from '../components/SignInBtn.vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

import { useAsgardeo } from '@asgardeo/vue'

const { state } = useAsgardeo()

const router = useRouter()

watch(
  () => state.isAuthenticated,
  (auth) => {
    if (auth) {
      router.push('/home')
    }
  },
)
</script>

<template>
  <div>
    <a href="https://wso2.com/asgardeo" target="_blank">
      <img :src="asgardeoLogo" class="logo asgardeo" alt="Asgardeo logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img :src="vueLogo" class="logo vue" alt="VUe logo" />
    </a>
  </div>
  <h1>Asgardeo + Vue</h1>
  <p class="read-the-docs">Click on the logos to learn more</p>
  <div class="button-container">
    <SignInBtn />
    <router-link to="/home" class="home-btn"> Go to Home </router-link>
  </div>
</template>

<style scoped>
.logo {
  width: 100px;
  margin: 10px;
}
.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}
.home-btn {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.home-btn:hover {
  background-color: #3aa876;
}
</style>
