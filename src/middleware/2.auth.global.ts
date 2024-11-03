import { useMainStore } from '~/store'
import { useAccountStore } from '~/store/account'

type MiddlewareRouteParam = Parameters<Parameters<typeof defineNuxtRouteMiddleware>[0]>[0]

export function authMiddlewareCheck (route: MiddlewareRouteParam) {
  const accountStore = useAccountStore()

  if (accountStore.isAuthenticated && route.meta.onlyUnauthenticated) {
    return navigateTo({ path: '/' })
  }

  if (!accountStore.isAuthenticated && !route.meta.allowUnauthenticated) {
    return navigateTo({ path: '/auth/login' })
  }

  if (accountStore.isAuthenticated && !route.meta.noRedirects && !accountStore.emailIsVerified && route.path !== '/account/verify-email') {
    return navigateTo({ path: '/account/verify-email' })
  }

  if (accountStore.isAuthenticated && !route.meta.noRedirects && accountStore.emailIsVerified && route.path === '/account/verify-email') {
    return navigateTo({ path: '/' })
  }

  if (accountStore.isAuthenticated && !route.meta.noRedirects && accountStore.emailIsVerified && !accountStore.firestoreUserData?.completedRegistration && route.path !== '/auth/register/complete') {
    return navigateTo({ path: '/auth/register/complete' })
  }

  if (accountStore.isAuthenticated && !route.meta.noRedirects && accountStore.emailIsVerified && accountStore.firestoreUserData?.completedRegistration && route.path === '/auth/register/complete') {
    return navigateTo({ path: '/' })
  }

  if (accountStore.isAuthenticated && !route.meta.noRedirects && accountStore.firestoreUserData?.blockAccess && route.path !== '/warnings/block-access') {
    return navigateTo({ path: '/warnings/block-access' })
  }

  if (accountStore.isAuthenticated && !route.meta.noRedirects && !accountStore.firestoreUserData?.blockAccess && route.path === '/warnings/block-access') {
    return navigateTo({ path: '/' })
  }

  if (accountStore.isAuthenticated && !route.meta.noRedirects && route.meta.isAnAdminRoute && accountStore.userRole !== 'Admin') {
    throw createError({ statusCode: 404, fatal: true })
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const mainStore = useMainStore()

  if (!mainStore.loadingAuthPlugin) {
    return authMiddlewareCheck(to)
  }
})
