import { useFirestoreCrud } from './useFirestoreCrud'

interface FirestoreNews {
  _id: string
  title: string
  description: string
  content: string
  imageUrl: string
  tags: string[]
}

export function useNewsService () {
  const firestoreCrud = useFirestoreCrud<FirestoreNews>('news')

  return firestoreCrud
}
