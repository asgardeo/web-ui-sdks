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

import { useAsgardeo } from '@asgardeo/vue'
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext,
  type Router,
} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const AboutView = (): Promise<typeof import('../views/AboutView.vue')> =>
  import('../views/AboutView.vue')

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: HomeView,
      name: 'home',
      path: '/',
    },
    {
      beforeEnter: (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext,
      ): void => {
        const { isAuthenticated } = useAsgardeo()

        isAuthenticated()
          .then((auth: boolean) => {
            if (auth) {
              next()
            } else {
              next('/')
            }
          })
          .catch(() => {
            next('/')
          })
      },
      component: AboutView,
      name: 'about',
      path: '/about',
    },
  ],
})

export default router
