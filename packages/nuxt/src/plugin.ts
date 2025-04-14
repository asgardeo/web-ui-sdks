import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { AsgardeoNodeClient } from '@asgardeo/auth-node'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const publicConfig = runtimeConfig.public.asgardeoAuth
  const privateConfig = runtimeConfig.asgardeoAuth // server-only

  const sdk = new AsgardeoNodeClient({
    clientID: publicConfig.clientID,
    clientSecret: privateConfig.clientSecret,
    baseUrl: publicConfig.baseUrl,
    signInRedirectURL: publicConfig.signInRedirectURL,
    signOutRedirectURL: publicConfig.signOutRedirectURL,
    scope: publicConfig.scope
  })

  nuxtApp.provide('auth', sdk)
})
