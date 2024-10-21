import { useFirestoreCrud } from './useFirestoreCrud'

export interface FirestoreUser {
  _id: string
  displayName: string
  createdAt: string
  providerPhotoUrl?: string
  position: string
  role: 'Viewer' | 'Admin'
}

export interface FirestoreUserPersonalData {
  email: string
}

export function useUsersService () {
  const firestoreCrud = useFirestoreCrud<FirestoreUser>('users')

  function useUserPrivateDataService (userId: string) {
    const userPrivateDataFirestoreCrud = useFirestoreCrud<FirestoreUserPersonalData>(`users/${userId}/private`)

    return {
      getPersonalData () {
        return userPrivateDataFirestoreCrud.get('personal-data')
      },
    }
  }

  return {
    ...firestoreCrud,

    useUserPrivateDataService,
  }
}
