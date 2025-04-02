<script setup>
import { useAsgardeo } from '@asgardeo/vue'
import { computed } from 'vue'

const { state, signOut , getDecodedIDToken} = useAsgardeo()

const userEmail = computed(() => state?.email || "This is the content of the home page.")

const getid = async () => {
    const id = await getDecodedIDToken();
    console.log(JSON.stringify(id, null, 2));
}
</script>

<template>
  <div>
    <h1>Welcome to the Home Page!</h1>
    <p>{{ userEmail }}</p>
    <button @click="signOut">Sign Out</button>
    <button @click="getid">getid</button>
  </div>
</template>
