import { EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, signInWithEmailAndPassword, signInWithPopup, type UserCredential } from 'firebase/auth'

import { useUsersService } from '~/composables/services/useUsersService'

import { useAccountStore } from '~/store/account'
import { useSnackbarStore } from '~/store/snackbar'

export function useLogin () {
  const nuxtApp = useNuxtApp()

  const accountStore = useAccountStore()
  const snackbarStore = useSnackbarStore()

  const usersService = useUsersService()

  const loadingLoginWithGoogle = ref(false)
  const loadingSignInWithEmailAndPassword = ref(false)

  async function handleValidateLogin (userCredential: UserCredential) {
    try {
      await usersService.get(userCredential.user.uid)

      reloadNuxtApp()
    } catch (err) {
      console.error(err)

      if (err instanceof Error && err.message === 'Not found') {
        snackbarStore.showErrorSnackbar('Você não possui uma conta. Registre-se para começar')
      } else {
        snackbarStore.showErrorSnackbar()
      }
    }
  }

  async function handleLoginWithGoogle ({ validateLogin = true } = {}) {
    try {
      loadingLoginWithGoogle.value = true

      const googleAuthProvider = new GoogleAuthProvider()

      const userCredential = await signInWithPopup(nuxtApp.$firebaseAuth, googleAuthProvider)

      if (validateLogin) {
        await handleValidateLogin(userCredential)
      }
    } catch (err) {
      console.error(err)
      snackbarStore.showErrorSnackbar()
    } finally {
      loadingLoginWithGoogle.value = false
    }
  }

  async function handleSignInWithEmailAndPassword (email: string, password: string, { validateLogin = true } = {}) {
    try {
      loadingSignInWithEmailAndPassword.value = true

      const userCredential = await signInWithEmailAndPassword(nuxtApp.$firebaseAuth, email, password)

      if (validateLogin) {
        await handleValidateLogin(userCredential)
      }
    } catch (err) {
      console.error(err)
      snackbarStore.showErrorSnackbar('E-mail ou senha inválidos')
    } finally {
      loadingSignInWithEmailAndPassword.value = false
    }
  }

  async function reauthenticateWithGoogle () {
    if (!nuxtApp.$firebaseAuth.currentUser || !accountStore.authUserData) {
      throw new Error('Unauthenticated')
    }

    const userHasGoogleProvider = !!accountStore.authUserData.providerData.find(item => item.providerId === 'google.com')

    if (!userHasGoogleProvider) {
      throw new Error('User doesn\'t have Google login')
    }

    const googleProvider = new GoogleAuthProvider()

    await reauthenticateWithPopup(nuxtApp.$firebaseAuth.currentUser, googleProvider)
  }

  async function reauthenticateWithEmailAndPassword (email: string, password: string) {
    if (!nuxtApp.$firebaseAuth.currentUser) {
      throw new Error('Unauthenticated')
    }

    const credential = EmailAuthProvider.credential(email, password)

    await reauthenticateWithCredential(nuxtApp.$firebaseAuth.currentUser, credential)
  }

  return {
    handleValidateLogin,
    handleLoginWithGoogle,
    handleSignInWithEmailAndPassword,

    loadingLoginWithGoogle,
    loadingSignInWithEmailAndPassword,

    reauthenticateWithGoogle,
    reauthenticateWithEmailAndPassword,
  }
}
