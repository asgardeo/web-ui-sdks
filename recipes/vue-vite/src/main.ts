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

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { asgardeoPlugin } from '@asgardeo/vue'

const app = createApp(App)

app.use(router)
app.use(asgardeoPlugin, {
  signInRedirectURL: 'http://localhost:5173/',
  signOutRedirectURL: 'http://localhost:5173/',
  clientID: 'DlhbfqNZEP0CGRN2933Aa1cwoAMa',
  baseUrl: 'https://api.asgardeo.io/t/thineth6424',
  scope: ["openid", "profile"],
})

app.mount('#app')
