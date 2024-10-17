import type { Auth } from 'firebase/auth'

import { useUsersService } from '@/composables/services/useUsersService'

import { useMainStore } from '@/store/index'
import { useAccountStore } from '@/store/account'

export default defineNuxtPlugin(async (nuxtApp) => {
  const firebaseAuth = nuxtApp.$firebaseAuth as Auth

  const mainStore = useMainStore()
  const accountStore = useAccountStore()

  const usersService = useUsersService()

  firebaseAuth.onAuthStateChanged(async (authUser) => {
    try {
      console.log('authUser', authUser)

      if (authUser) {
        const userData = await usersService.get(authUser.uid)

        accountStore.setFirestoreUserData(userData)
      }
    } catch (err) {
      console.error('Auth plugin error', err)

      accountStore.setFirestoreUserData(undefined)
    } finally {
      console.log('end plugin')
      mainStore.setLoadingAuthPlugin(false)
    }
  })
})
