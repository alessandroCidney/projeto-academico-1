<template>
  <div class="loginPage">
    <v-img
      src="@/assets/images/photos/team.jpg"
      width="100%"
      height="30%"
      cover
    >
      <div class="teamImageOverlay fillWidth fillHeight" />
    </v-img>

    <div class="pa-10">
      <v-img
        src="@/assets/images/logos/default.svg"
        width="230px"
        class="mb-10"
      />

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
            to="reset-password"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

import { useAccountStore } from '@/store/account'

import { useUsersService } from '@/composables/services/useUsersService'

import { useNuxtApp } from '#imports'

const nuxtApp = useNuxtApp()

const router = useRouter()

const loadingLoginWithGoogle = ref(false)

const accountStore = useAccountStore()

const usersService = await useUsersService()

async function handleLoginWithGoogle () {
  try {
    loadingLoginWithGoogle.value = true

    const googleAuthProvider = new GoogleAuthProvider()

    const userCredential = await signInWithPopup(nuxtApp.$firebaseAuth, googleAuthProvider)

    const userData = await usersService.get(userCredential.user.uid)

    accountStore.setFirestoreUserData(userData)

    await router.push('/news')
  } catch (err) {
    console.error('handleLoginWithGoogle error', err)
  } finally {
    loadingLoginWithGoogle.value = false
  }
}
</script>

<style lang="scss" scoped>
.teamImageOverlay {
  background-color: rgb(var(--v-theme-primary), .4);
}

.loginPage {
  height: 100vh;
}
</style>
