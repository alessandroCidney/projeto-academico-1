import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'

import { useFirestoreCrud } from './useFirestoreCrud'

export class FirestoreNews {
  _id = ''
  title = ''
  description = ''
  content = ''
  imagePath = ''
  imageUrl = ''
  tags: string[] = []
  authorId = ''
}

export function useNewsService () {
  const nuxtApp = useNuxtApp()

  const firestoreCrud = useFirestoreCrud<FirestoreNews>('news')

  async function fillItemImageUrl (item: FirestoreNews) {
    if (item.imagePath) {
      const thumbnailRef = storageRef(nuxtApp.$firebaseStorage, item.imagePath)

      const downloadUrl = await getDownloadURL(thumbnailRef)

      item.imageUrl = downloadUrl
    }

    return item
  }

  return {
    ...firestoreCrud,

    async list () {
      const results = await firestoreCrud.list()

      const formattedResults = await Promise.all(results.map(fillItemImageUrl))

      return formattedResults
    },

    async get (itemId: string) {
      const result = await firestoreCrud.get(itemId)

      return fillItemImageUrl(result)
    },

    async create (itemId: string, payload: FirestoreNews, imageFile: File) {
      const thumbnailRef = storageRef(nuxtApp.$firebaseStorage, `news/${itemId}/thumbnail.${imageFile.name.split('.').pop()}`)

      const snapshot = await uploadBytes(thumbnailRef, imageFile)

      payload.imagePath = snapshot.metadata.fullPath

      return await firestoreCrud.create(itemId, payload)
    },

    async update (itemId: string, payload: FirestoreNews, imageFile?: File) {
      if (imageFile) {
        const thumbnailRef = storageRef(nuxtApp.$firebaseStorage, `news/${itemId}/thumbnail.${imageFile.name.split('.').pop()}`)

        const snapshot = await uploadBytes(thumbnailRef, imageFile)

        payload.imagePath = snapshot.metadata.fullPath
      }

      return await firestoreCrud.update(itemId, payload)
    },
  }
}
