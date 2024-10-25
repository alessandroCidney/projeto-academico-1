import { useMainStore } from '~/store'
import { useAccountStore } from '~/store/account'

type MiddlewareRouteParam = Parameters<Parameters<typeof defineNuxtRouteMiddleware>[0]>[0]

export function authMiddlewareCheck (route: MiddlewareRouteParam) {
  const accountStore = useAccountStore()

  if (route.meta.isALoginRoute && accountStore.isAuthenticated && !route.meta.noRedirect) {
    console.log('navigate to index')
    return navigateTo({ path: '/' })
  }

  if (!route.meta.isALoginRoute && !accountStore.isAuthenticated) {
    console.log('navigate to login')
    return navigateTo({ path: '/auth/login' })
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const mainStore = useMainStore()

  if (!mainStore.loadingAuthPlugin) {
    return authMiddlewareCheck(to)
  }
})
