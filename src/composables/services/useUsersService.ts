import { ref as storageRef, uploadBytes } from 'firebase/storage'

import { useFirestoreCrud } from './useFirestoreCrud'

import { useAccountStore } from '~/store/account'

import { fillItemImageUrl } from '~/utils/services'

export class FirestoreUser {
  _id = ''
  displayName = ''
  createdAt = ''
  updatedAt: string | null = null
  position = ''
  role: 'Viewer' | 'Admin' = 'Viewer'
  manuallyVerified = false
  emailVerified = false

  imagePath = ''
  imageUrl = ''
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

  const nuxtApp = useNuxtApp()

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

    async list () {
      const results = await firestoreCrud.list()

      const formattedResults = await Promise.all(results.map(fillItemImageUrl))

      return formattedResults
    },

    async get (itemId: string) {
      const result = await firestoreCrud.get(itemId)

      return fillItemImageUrl(result)
    },

    async updateProfilePhoto (itemId: string, imageFile: File) {
      const thumbnailRef = storageRef(nuxtApp.$firebaseStorage, `users/${itemId}/profile-photo.${imageFile.name.split('.').pop()}`)

      const snapshot = await uploadBytes(thumbnailRef, imageFile)

      return snapshot.metadata.fullPath
    },

    async create (itemId: string, payload: FirestoreUser, imageFile?: File) {
      if (imageFile) {
        payload.imagePath = await this.updateProfilePhoto(itemId, imageFile)
        await fillItemImageUrl(payload)
      }

      return await firestoreCrud.create(itemId, payload)
    },

    async update (itemId: string, payload: FirestoreUser, imageFile?: File) {
      if (imageFile) {
        payload.imagePath = await this.updateProfilePhoto(itemId, imageFile)
        await fillItemImageUrl(payload)
      }

      return await firestoreCrud.update(itemId, payload)
    },

    useUserPrivateDataService,
    useNotificationsService,
  }
}
