import { useFirestoreCrud } from './useFirestoreCrud'

export class FirestoreNews {
  _id = ''
  title = ''
  description = ''
  content = ''
  imageUrl = ''
  tags: string[] = []
  authorId = ''
}

export function useNewsService () {
  const firestoreCrud = useFirestoreCrud<FirestoreNews>('news')

  return firestoreCrud
}
