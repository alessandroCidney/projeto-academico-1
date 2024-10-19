import { useFirestoreCrud } from './useFirestoreCrud'

interface FirestoreUser {
  _id: string
  displayName: string
  createdAt: string
}

export function useUsersService () {
  const firestoreCrud = useFirestoreCrud<FirestoreUser>('users')

  return firestoreCrud
}
