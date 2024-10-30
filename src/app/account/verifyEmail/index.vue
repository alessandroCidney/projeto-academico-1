<template>
  <login-page-container>
    <h1 class="text-h5 font-weight-bold mb-5">
      Verifique seu e-mail!
    </h1>

    <p class="mb-5">
      Um e-mail de verificação foi enviado! Verifique sua caixa de entrada e acesse o link de verificação para continuar.
    </p>

    <p class="mb-5">
      Não recebeu o e-mail? Clique em "Enviar novamente" para receber um novo e-mail.
    </p>

    <div class="d-flex align-center justify-center ga-4">
      <v-btn
        prepend-icon="mdi-arrow-left"
        class="normalLetterSpacing w-50"
        color="grey-lighten-4"
        size="large"
        flat
        @click="handleSignOut"
      >
        Sair
      </v-btn>

      <v-btn
        :loading="loadingSendEmail"
        prepend-icon="mdi-email"
        class="normalLetterSpacing w-50"
        color="primary"
        size="large"
        @click="handleSendEmailVerification"
      >
        Enviar novamente
      </v-btn>
    </div>
  </login-page-container>
</template>

<script setup lang="ts">
import { sendEmailVerification, signOut } from 'firebase/auth'

import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'

import { useSnackbarStore } from '~/store/snackbar'
import { useAccountStore } from '~/store/account'

const nuxtApp = useNuxtApp()

const snackbarStore = useSnackbarStore()
const accountStore = useAccountStore()

const loadingSendEmail = ref(false)

async function handleSendEmailVerification () {
  try {
    if (!nuxtApp.$firebaseAuth.currentUser) {
      throw new Error('Unauthenticated')
    }

    loadingSendEmail.value = true

    await sendEmailVerification(nuxtApp.$firebaseAuth.currentUser)
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingSendEmail.value = false
  }
}

async function handleSignOut () {
  await signOut(nuxtApp.$firebaseAuth)

  accountStore.setAuthUserData(undefined)
  accountStore.setFirestoreUserData(undefined)
  accountStore.setFirestoreUserPrivateData(undefined)

  await navigateTo({ path: '/auth/login' })
}
</script>

<style lang="scss">
.resetPasswordPage {
  padding-bottom: 120px !important;
}
</style>
