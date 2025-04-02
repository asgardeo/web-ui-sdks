<script setup>
import vueLogo from '../assets/logo.svg'
import asgardeoLogo from '../assets/asgardeo.svg'

import SignInBtn from '../components/SignInBtn.vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

import { useAsgardeo } from '@asgardeo/vue'

const { state } = useAsgardeo()

const router = useRouter()

watch(() => state.isAuthenticated, (auth) => {
  if (auth) {
    router.push('/home')
  }
})
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
