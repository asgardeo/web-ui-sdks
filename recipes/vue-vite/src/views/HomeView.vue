<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type SignInConfig, type BasicUserInfo } from '@asgardeo/vue'
import { useAsgardeoContext } from '@asgardeo/vue'

const config: SignInConfig = {
  signInRedirectURL: 'http://localhost:5173/',
  signOutRedirectURL: 'http://localhost:5173/',
  clientID: 'DlhbfqNZEP0CGRN2933Aa1cwoAMa',
  baseUrl: 'https://api.asgardeo.io/t/thineth6424',
  scope: 'openid profile',
}

const auth = useAsgardeoContext()
const { signIn } = useAsgardeoContext()
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

// onMounted(async () => {

//   const urlParams = new URLSearchParams(window.location.search);
//   const authorizationCode = urlParams.get("code");
//   const state = urlParams.get("state");
//   const sessionState = urlParams.get("session_state");

//   if (authorizationCode && sessionState && state) {
//     try {
//       const result = await auth?.signIn(
//         config,
//         authorizationCode,
//         sessionState,
//         state
//       );
//       if (result) {
//         userInfo.value = result;
//       }
//       window.history.replaceState({}, document.title, window.location.pathname);
//     } catch (error) {
//       console.error("Sign in failed", error);
//     }
//   }
// });
</script>

<template>
  <main>
    <button @click="login">Login</button>
    <button @click="getUser">User</button>
    <h2>{{ userInfo }}</h2>
  </main>
</template>
