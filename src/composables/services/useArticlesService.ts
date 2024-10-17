import { useFirestoreCrud } from './useFirestoreCrud'

interface FirestoreArticle {
  title: string
  description: string
  content: string
  imageUrl: string
  tags: string[]
}

export function useArticlesService () {
  const firestoreCrud = useFirestoreCrud<FirestoreArticle>('articles')

  return firestoreCrud
}
