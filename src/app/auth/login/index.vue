<template>
  <login-page-container>
    <v-form class="mb-10">
      <v-btn
        :loading="loadingLoginWithGoogle"
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
        label="E-mail"
        placeholder="user@example.com"
        variant="outlined"
      />

      <v-text-field
        label="Senha"
        placeholder="Digite sua senha"
        variant="outlined"
      />

      <v-btn
        color="primary"
        class="text-white normalLetterSpacing py-6"
        variant="flat"
        block
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

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

import { useUsersService } from '@/composables/services/useUsersService'

import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'

import { useNuxtApp } from '#imports'

const nuxtApp = useNuxtApp()

const loadingLoginWithGoogle = ref(false)

const usersService = await useUsersService()

async function handleLoginWithGoogle () {
  try {
    loadingLoginWithGoogle.value = true

    const googleAuthProvider = new GoogleAuthProvider()

    const userCredential = await signInWithPopup(nuxtApp.$firebaseAuth, googleAuthProvider)

    await usersService.get(userCredential.user.uid)

    reloadNuxtApp()
  } catch (err) {
    console.error('handleLoginWithGoogle error', err)
  } finally {
    loadingLoginWithGoogle.value = false
  }
}
</script>
