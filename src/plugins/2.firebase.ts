import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: runtimeConfig.public.apiKey,
    authDomain: runtimeConfig.public.authDomain,
    projectId: runtimeConfig.public.projectId,
    storageBucket: runtimeConfig.public.storageBucket,
    messagingSenderId: runtimeConfig.public.messagingSenderId,
    appId: runtimeConfig.public.appId,
  }

  const firebaseApp = initializeApp(firebaseConfig)

  const firebaseAuth = getAuth(firebaseApp)
  const firebaseFirestore = getFirestore(firebaseApp)
  const firebaseStorage = getStorage(firebaseApp)

  nuxtApp.vueApp.provide('firebaseAuth', firebaseAuth)
  nuxtApp.vueApp.provide('firebaseFirestore', firebaseFirestore)
  nuxtApp.vueApp.provide('firebaseStorage', firebaseStorage)

  return {
    provide: {
      firebaseAuth,
      firebaseFirestore,
      firebaseStorage,
    },
  }
})
