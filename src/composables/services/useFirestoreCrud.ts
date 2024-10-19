import _ from 'lodash'

import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore'

export function useFirestoreCrud<BaseObject extends object> (path: string) {
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

    async get (itemId: string) {
      const docRef = doc(nuxtApp.$firebaseFirestore, `${path}/${itemId}`)

      const docSnap = await getDoc(docRef)
      const docData = docSnap.data()

      if (docData) {
        return docData as BaseObject
      } else {
        throw new Error('Not found')
      }
    },

    async create (itemId: string, payload: BaseObject) {
      const docRef = doc(nuxtApp.$firebaseFirestore, path, itemId)

      await setDoc(docRef, payload)

      return _.cloneDeep(payload)
    },

    async remove (itemId: string) {
      const docRef = doc(nuxtApp.$firebaseFirestore, path, itemId)

      await deleteDoc(docRef)
    },
  }
}
