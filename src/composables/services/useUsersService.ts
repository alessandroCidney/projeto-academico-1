import { doc, getDoc } from 'firebase/firestore'

function generateFakeArray () {
  return [1, 2, 3, 4, 5, 6, 7].map(index => ({
    _id: `exampleuser1${index}`,
    displayName: `Example User ${index}`,
    imageUrl: 'https://cdn.pixabay.com/photo/2023/10/29/14/37/pumpkins-8350480_1280.jpg',
  }))
}

export function useUsersService () {
  const nuxtApp = useNuxtApp()

  return {
    async list () {
      return generateFakeArray()
    },

    async get (userId: string) {
      const docRef = doc(nuxtApp.$firebaseFirestore, `users/${userId}`)

      const docSnap = await getDoc(docRef)
      const docData = docSnap.data()

      if (docData) {
        return docData
      } else {
        throw new Error('Not found')
      }
    },
  }
}
