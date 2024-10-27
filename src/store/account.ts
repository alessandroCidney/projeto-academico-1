import type { User as FirebaseAuthUser } from 'firebase/auth'

import type { FirestoreUser, FirestoreUserPersonalData } from '~/composables/services/useUsersService'

export const useAccountStore = defineStore('account', {
  state: () => ({
    authUserData: undefined as FirebaseAuthUser | undefined,
    firestoreUserData: undefined as FirestoreUser | undefined,
    firestoreUserPrivateData: undefined as FirestoreUserPersonalData | undefined,

    cachedUsers: {} as Record<string, FirestoreUser>,
  }),

  getters: {
    isAuthenticated (state) {
      return !!state.firestoreUserData && !!state.authUserData
    },

    userDisplayNameStr (state) {
      return state.firestoreUserData?.displayName ?? ''
    },
  },

  actions: {
    setAuthUserData (value: typeof this.authUserData) {
      this.authUserData = value
    },

    setFirestoreUserData (value: typeof this.firestoreUserData) {
      this.firestoreUserData = value
    },

    setFirestoreUserPrivateData (value: typeof this.firestoreUserPrivateData) {
      this.firestoreUserPrivateData = value
    },

    updateCachedUser (value: FirestoreUser) {
      this.cachedUsers = {
        ...this.cachedUsers,
        [value._id]: value,
      }
    },
  },
})
