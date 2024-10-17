import type { useUsersService } from '@/composables/services/useUsersService'

export const useAccountStore = defineStore('account', {
  state: () => ({
    firestoreUserData: undefined as Awaited<ReturnType<ReturnType<typeof useUsersService>['get']>> | undefined,
  }),

  getters: {
    isAuthenticated (state) {
      return !!state.firestoreUserData
    },
  },

  actions: {
    setFirestoreUserData (value: typeof this.firestoreUserData) {
      this.firestoreUserData = value
    },
  },
})
