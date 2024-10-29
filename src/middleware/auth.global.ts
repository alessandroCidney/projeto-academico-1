import { useMainStore } from '~/store'
import { useAccountStore } from '~/store/account'

type MiddlewareRouteParam = Parameters<Parameters<typeof defineNuxtRouteMiddleware>[0]>[0]

export function authMiddlewareCheck (route: MiddlewareRouteParam) {
  const accountStore = useAccountStore()

  if (route.meta.isALoginRoute && accountStore.isAuthenticated && !route.meta.noRedirect) {
    return navigateTo({ path: '/' })
  }

  if (!route.meta.isALoginRoute && !accountStore.isAuthenticated) {
    return navigateTo({ path: '/auth/login' })
  }

  if (accountStore.isAuthenticated && accountStore.firestoreUserData?.blockAccess) {
    throw createError({ statusCode: 401, fatal: true })
  }

  if (route.meta.isAnAdminRoute && accountStore.userRole !== 'Admin') {
    throw createError({ statusCode: 404, fatal: true })
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const mainStore = useMainStore()

  if (!mainStore.loadingAuthPlugin) {
    return authMiddlewareCheck(to)
  }
})
