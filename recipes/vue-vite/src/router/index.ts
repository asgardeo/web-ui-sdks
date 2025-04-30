/**
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
 */

import { useAsgardeo, type AuthStateInterface } from '@asgardeo/vue'
import { watch } from 'vue'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'

/**
 * Wait for Asgardeo loading state to complete before proceeding
 * @param state - The Asgardeo state containing isLoading property
 * @returns A promise that resolves when loading is complete
 */
async function waitForAsgardeoLoaded(state: AuthStateInterface): Promise<void> {
  return new Promise<void>((resolve: () => void) => {
    // If already not loading, resolve immediately
    if (!state.isLoading) {
      resolve()
      return
    }

    // Watch for changes in loading state
    const unwatch: () => void = watch(
      () => state.isLoading,
      (isLoading: boolean) => {
        if (!isLoading) {
          unwatch()
          resolve()
        }
      },
    )
  })
}

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: LandingView,
      name: 'landing',
      path: '/',
    },
    {
      beforeEnter: async (): Promise<boolean> => {
        const { state, isAuthenticated, signIn } = useAsgardeo()

        // Wait for loading to complete if still in progress
        if (state.isLoading) {
          await waitForAsgardeoLoaded(state)
        }

        try {
          const auth: boolean = await isAuthenticated()
          if (!auth) {
            await signIn()
            return false // Prevent navigation until sign-in completes
          }
          return true
        } catch {
          return false // Prevent navigation on error
        }
      },
      component: HomeView,
      name: 'home',
      path: '/home',
    },
  ],
})

export default router
