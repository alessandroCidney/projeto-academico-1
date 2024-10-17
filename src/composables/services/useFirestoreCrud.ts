import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore'

export function useFirestoreCrud<BaseObject> (path: string) {
  const nuxtApp = useNuxtApp()

  return {
    async list () {
      const collectionRef = collection(nuxtApp.$firebaseFirestore, path)

      const queryRef = query(collectionRef)
      const querySnapshot = await getDocs(queryRef)

      return querySnapshot
        .docs
        .map(querySnapshotItem => ({ ...querySnapshotItem.data(), _id: querySnapshotItem.id })) as BaseObject[]
    },

    async get (userId: string) {
      const docRef = doc(nuxtApp.$firebaseFirestore, `${path}/${userId}`)

      const docSnap = await getDoc(docRef)
      const docData = docSnap.data()

      if (docData) {
        return docData as BaseObject
      } else {
        throw new Error('Not found')
      }
    },
  }
}
