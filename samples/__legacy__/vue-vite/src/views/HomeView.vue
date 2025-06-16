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
import { useAsgardeo } from '@asgardeo/vue'
import { computed } from 'vue'

const { state, signOut, getDecodedIdToken } = useAsgardeo()

const userEmail = computed(() => state?.email || 'This is the content of the home page.')

const getid = async () => {
  const id = await getDecodedIdToken()
  console.log(JSON.stringify(id, null, 2))
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
