import { ref as storageRef, uploadBytes } from 'firebase/storage'

import { useFirestoreCrud } from './useFirestoreCrud'

import type { FirestoreComment, FirestoreLike, FirestoreArticle } from '~/types'

import { fillItemImageUrl } from '~/utils/services'

export function useArticlesService (basePath = 'articles') {
  const nuxtApp = useNuxtApp()

  const firestoreCrud = useFirestoreCrud<FirestoreArticle>(basePath)

  function useArticlesLikeService (itemId: string, basePath = 'articles') {
    const likesFirestoreCrud = useFirestoreCrud<FirestoreLike>(`${basePath}/${itemId}/likes`)

    return likesFirestoreCrud
  }

  function useArticlesCommentService (itemId: string, basePath = 'articles') {
    const commentsFirestoreCrud = useFirestoreCrud<FirestoreComment>(`${basePath}/${itemId}/comments`)

    return commentsFirestoreCrud
  }

  return {
    ...firestoreCrud,

    likesService: (itemId: string) => useArticlesLikeService(itemId, basePath),
    commentsService: (itemId: string) => useArticlesCommentService(itemId, basePath),

    async list () {
      const results = await firestoreCrud.list()

      const formattedResults = await Promise.all(results.map(fillItemImageUrl))

      return formattedResults
    },

    async get (itemId: string) {
      const result = await firestoreCrud.get(itemId)

      return fillItemImageUrl(result)
    },

    async updateThumbnail (itemId: string, imageFile: File) {
      const thumbnailRef = storageRef(nuxtApp.$firebaseStorage, `${basePath}/${itemId}/thumbnail.${imageFile.name.split('.').pop()}`)

      const snapshot = await uploadBytes(thumbnailRef, imageFile)

      return snapshot.metadata.fullPath
    },

    async create (itemId: string, payload: FirestoreArticle, imageFile?: File) {
      if (imageFile) {
        payload.imagePath = await this.updateThumbnail(itemId, imageFile)
      }

      return await firestoreCrud.create(itemId, payload)
    },

    async update (itemId: string, payload: FirestoreArticle, imageFile?: File) {
      if (imageFile) {
        payload.imagePath = await this.updateThumbnail(itemId, imageFile)
      }

      return await firestoreCrud.update(itemId, payload)
    },
  }
}
