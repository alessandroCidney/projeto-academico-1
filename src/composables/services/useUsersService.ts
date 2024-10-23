import { useFirestoreCrud } from './useFirestoreCrud'

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

export function useUsersService () {
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

  return {
    ...firestoreCrud,

    useUserPrivateDataService,
  }
}
