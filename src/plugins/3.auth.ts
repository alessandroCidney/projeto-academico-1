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
        let userData = await usersService.get(authUser.uid)

        if (authUser.photoURL !== userData.providerPhotoUrl) {
          userData = {
            ...userData,
            providerPhotoUrl: authUser.photoURL ?? undefined,
          }

          await usersService.update(authUser.uid, userData)
        }

        const userPrivateData = await usersService
          .useUserPrivateDataService(authUser.uid)
          .getPersonalData()

        accountStore.setAuthUserData(authUser)
        accountStore.setFirestoreUserData(userData)
        accountStore.setFirestoreUserPrivateData(userPrivateData)
      }
    } catch (err) {
      console.error('Auth plugin error', err)

      accountStore.setAuthUserData(undefined)
      accountStore.setFirestoreUserData(undefined)
      accountStore.setFirestoreUserPrivateData(undefined)
    } finally {
      console.log('end plugin')
      mainStore.setLoadingAuthPlugin(false)
    }
  })
})
