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

      <password-text-field
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
        @click="handleSignInWithEmailAndPassword(emailLoginPayload.email, emailLoginPayload.password)"
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

import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'
import PasswordTextField from '~/components/commons/PasswordTextField.vue'

import { useLogin } from '~/composables/commons/useLogin'

const emailLoginPayload = ref({
  email: '',
  password: '',
})

const {
  handleLoginWithGoogle,
  handleSignInWithEmailAndPassword,

  loadingLoginWithGoogle,
  loadingSignInWithEmailAndPassword,
} = useLogin()
</script>
