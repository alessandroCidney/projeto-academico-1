import _ from 'lodash'

import { collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'

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
        return ({ ...docData, _id: itemId }) as BaseObject
      } else {
        throw new Error('Not found')
      }
    },

    async checkIfExists (itemId: string) {
      const docRef = doc(nuxtApp.$firebaseFirestore, `${path}/${itemId}`)

      const docSnap = await getDoc(docRef)

      return docSnap.exists()
    },

    async create (itemId: string, payload: BaseObject) {
      if (!itemId) {
        throw new Error('Invalid ID')
      }

      const docRef = doc(nuxtApp.$firebaseFirestore, path, itemId)

      await setDoc(docRef, payload)

      return _.cloneDeep(payload)
    },

    async update (itemId: string, payload: BaseObject) {
      if (!itemId) {
        throw new Error('Invalid ID')
      }

      const docRef = doc(nuxtApp.$firebaseFirestore, path, itemId)

      await updateDoc(docRef, payload)

      return _.cloneDeep(payload)
    },

    async remove (itemId: string) {
      const docRef = doc(nuxtApp.$firebaseFirestore, path, itemId)

      await deleteDoc(docRef)
    },

    async search (property: keyof BaseObject, searchStr: string) {
      const collectionRef = collection(nuxtApp.$firebaseFirestore, path)

      const queryRef = query(
        collectionRef,
        where(property as string, '>=', searchStr),
        where(property as string, '<=', searchStr + '\uf8ff'),
        limit(5),
      )

      const querySnapshot = await getDocs(queryRef)

      return querySnapshot
        .docs
        .map(querySnapshotItem => ({ ...querySnapshotItem.data(), _id: querySnapshotItem.id })) as BaseObject[]
    },
  }
}
