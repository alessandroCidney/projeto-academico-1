import { getDownloadURL, ref as storageRef } from 'firebase/storage'

interface ItemWithImage {
  imagePath: string
  imageUrl: string
}

export async function fillItemImageUrl<T extends ItemWithImage> (item: T) {
  if (item.imagePath) {
    const nuxtApp = useNuxtApp()

    const thumbnailRef = storageRef(nuxtApp.$firebaseStorage, item.imagePath)

    const downloadUrl = await getDownloadURL(thumbnailRef)

    item.imageUrl = downloadUrl
  }

  return item
}
