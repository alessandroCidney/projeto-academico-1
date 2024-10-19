import type { useUsersService } from '@/composables/services/useUsersService'
import type { User as FirebaseAuthUser } from 'firebase/auth'

export const useAccountStore = defineStore('account', {
  state: () => ({
    authUserData: undefined as FirebaseAuthUser | undefined,
    firestoreUserData: undefined as Awaited<ReturnType<ReturnType<typeof useUsersService>['get']>> | undefined,
  }),

  getters: {
    isAuthenticated (state) {
      return !!state.firestoreUserData && !!state.authUserData
    },
  },

  actions: {
    setAuthUserData (value: typeof this.authUserData) {
      this.authUserData = value
    },

    setFirestoreUserData (value: typeof this.firestoreUserData) {
      this.firestoreUserData = value
    },
  },
})
