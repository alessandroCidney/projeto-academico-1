<template>
  <login-page-container>
    <v-form class="mb-10">
      <v-btn
        :loading="loadingLoginWithGoogle"
        :disabled="loadingSignInWithEmailAndPassword"
        class="normalLetterSpacing mb-5"
        prepend-icon="mdi-google"
        variant="tonal"
        color="error"
        size="large"
        block
        @click="handleLoginWithGoogle"
      >
        Entrar com o Google
      </v-btn>

      <v-text-field
        v-model="emailLoginPayload.email"
        label="E-mail"
        placeholder="user@example.com"
        variant="outlined"
      />

      <v-text-field
        v-model="emailLoginPayload.password"
        label="Senha"
        placeholder="Digite sua senha"
        variant="outlined"
      />

      <v-btn
        :loading="loadingSignInWithEmailAndPassword"
        :disabled="loadingLoginWithGoogle"
        color="primary"
        class="text-white normalLetterSpacing py-6"
        variant="flat"
        block
        @click="handleSignInWithEmailAndPassword"
      >
        Entrar
      </v-btn>
    </v-form>

    <ul>
      <li class="mb-2">
        <nuxt-link
          to="/auth/register"
        >
          Não possui uma conta?
        </nuxt-link>
      </li>

      <li class="mb-2">
        <nuxt-link
          to="/account/reset-password"
        >
          Esqueceu sua senha?
        </nuxt-link>
      </li>

      <li>
        <nuxt-link
          to="privacy-policy"
        >
          Privacidade
        </nuxt-link>
      </li>
    </ul>
  </login-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth'

import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'

import { useUsersService } from '~/composables/services/useUsersService'

import { useSnackbarStore } from '~/store/snackbar'

const nuxtApp = useNuxtApp()

const snackbarStore = useSnackbarStore()

const loadingLoginWithGoogle = ref(false)
const loadingSignInWithEmailAndPassword = ref(false)

const usersService = useUsersService()

const emailLoginPayload = ref({
  email: '',
  password: '',
})

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

async function handleLoginWithGoogle () {
  try {
    loadingLoginWithGoogle.value = true

    const googleAuthProvider = new GoogleAuthProvider()

    const userCredential = await signInWithPopup(nuxtApp.$firebaseAuth, googleAuthProvider)

    await handleValidateLogin(userCredential)
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingLoginWithGoogle.value = false
  }
}

async function handleSignInWithEmailAndPassword () {
  try {
    loadingSignInWithEmailAndPassword.value = true

    const userCredential = await signInWithEmailAndPassword(nuxtApp.$firebaseAuth, emailLoginPayload.value.email, emailLoginPayload.value.password)

    await handleValidateLogin(userCredential)
  } catch (err) {
    console.error('handleLoginWithGoogle error', err)

    if (err instanceof Error && err.message === 'Not found') {
      snackbarStore.showErrorSnackbar('Você não possui uma conta. Registre-se para começar')
    } else {
      snackbarStore.showErrorSnackbar()
    }
  } finally {
    loadingSignInWithEmailAndPassword.value = false
  }
}
</script>
