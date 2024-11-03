import { FirebaseError } from 'firebase/app'
import { AuthErrorCodes, EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, signInWithEmailAndPassword, signInWithPopup, signOut, type UserCredential } from 'firebase/auth'

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

  function getFirebaseErrorMessage (err: FirebaseError) {
    switch (err.code) {
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
      case AuthErrorCodes.INVALID_PASSWORD:
        return 'E-mail ou senha inválidos'
      case AuthErrorCodes.POPUP_BLOCKED:
        return 'O popup de autenticação foi bloqueado. Revise as configurações de seu navegador'
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        return 'O popup de autenticação foi fechado'
      case AuthErrorCodes.EXPIRED_POPUP_REQUEST:
        return 'A solicitação de autenticação via popup expirou. Por favor, tente novamente'
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return 'Limite de tentativas atingido! Por favor, tente novamente mais tarde'
    }
  }

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

      googleAuthProvider.setCustomParameters({
        prompt: 'select_account',
      })

      const userCredential = await signInWithPopup(nuxtApp.$firebaseAuth, googleAuthProvider)

      if (validateLogin) {
        await handleValidateLogin(userCredential)
      }
    } catch (err) {
      console.error(err)

      if (err instanceof FirebaseError) {
        snackbarStore.showErrorSnackbar(getFirebaseErrorMessage(err))
      } else {
        snackbarStore.showErrorSnackbar()
      }
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

      if (err instanceof FirebaseError) {
        snackbarStore.showErrorSnackbar(getFirebaseErrorMessage(err))
      } else {
        snackbarStore.showErrorSnackbar()
      }
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

  async function handleSignOut ({ redirect = true } = {}) {
    await signOut(nuxtApp.$firebaseAuth)

    accountStore.setAuthUserData(undefined)
    accountStore.setFirestoreUserData(undefined)
    accountStore.setFirestoreUserPrivateData(undefined)

    if (redirect) {
      await navigateTo({ path: '/auth/login' })
    }
  }

  return {
    handleValidateLogin,
    handleLoginWithGoogle,
    handleSignInWithEmailAndPassword,

    loadingLoginWithGoogle,
    loadingSignInWithEmailAndPassword,

    reauthenticateWithGoogle,
    reauthenticateWithEmailAndPassword,

    handleSignOut,
  }
}
