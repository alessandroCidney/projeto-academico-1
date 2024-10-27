import { useFirestoreCrud } from './useFirestoreCrud'

import { useAccountStore } from '~/store/account'

export class FirestoreUser {
  _id = ''
  displayName = ''
  createdAt = ''
  updatedAt: string | null = null
  position = ''
  role: 'Viewer' | 'Admin' = 'Viewer'
  manuallyVerified = false
  emailVerified = false
}

export class FirestoreUserPersonalData {
  email = ''
  createdAt = ''
  updatedAt: string | null = null
}

export enum FirestoreUserNotificationTarget {
  news = 'news',
  article = 'article',
}

export class FirestoreUserNotification {
  _id = ''
  action: 'like' | 'comment' = 'like'
  authorId = ''
  createdAt = ''
  target: 'news' | 'article' = 'news'
}

export function useUsersService () {
  const accountStore = useAccountStore()

  const firestoreCrud = useFirestoreCrud<FirestoreUser>('users')

  function useUserPrivateDataService (userId: string) {
    const userPrivateDataFirestoreCrud = useFirestoreCrud<FirestoreUserPersonalData>(`users/${userId}/private`)

    return {
      getPersonalData () {
        return userPrivateDataFirestoreCrud.get('personal-data')
      },

      createPersonalData (payload: FirestoreUserPersonalData) {
        return userPrivateDataFirestoreCrud.create('personal-data', payload)
      },

      updatePersonalData (payload: FirestoreUserPersonalData) {
        return userPrivateDataFirestoreCrud.update('personal-data', payload)
      },
    }
  }

  function useNotificationsService (userId: string) {
    const notificationsFirestoreCrud = useFirestoreCrud<FirestoreUserNotification>(`users/${userId}/notifications`)

    return notificationsFirestoreCrud
  }

  return {
    ...firestoreCrud,

    async getUserAndSaveToStoreCache (userId: string) {
      if (accountStore.cachedUsers[userId]) {
        console.log('loading cached user', userId)
        return accountStore.cachedUsers[userId]
      }

      console.log('saving user to cache', userId)
      const userData = await firestoreCrud.get(userId)

      accountStore.updateCachedUser(userData)

      return userData
    },

    useUserPrivateDataService,
    useNotificationsService,
  }
}
