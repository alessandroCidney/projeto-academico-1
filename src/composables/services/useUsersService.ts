import { useFirestoreCrud } from './useFirestoreCrud'

interface FirestoreUser {
  displayName: string
  createdAt: string
}

export function useUsersService () {
  const firestoreCrud = useFirestoreCrud<FirestoreUser>('users')

  return firestoreCrud
}
