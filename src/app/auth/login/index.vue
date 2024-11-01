<template>
  <login-page-container>
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

    <v-form
      ref="emailLoginFormRef"
      v-model="emailLoginFormIsValid"
      class="mb-10"
      @submit.prevent="validateFormAndLoginWithEmail"
    >
      <v-text-field
        v-model="emailLoginPayload.email"
        :rules="[rules.required, rules.email]"
        label="E-mail"
        placeholder="user@example.com"
        variant="outlined"
      />

      <password-text-field
        v-model="emailLoginPayload.password"
        :rules="[rules.required]"
        label="Senha"
        placeholder="Digite sua senha"
        variant="outlined"
      />

      <div class="mb-3 text-body-2">
        <nuxt-link to="/account/reset-password">
          Esqueceu sua senha?
        </nuxt-link>
      </div>

      <v-btn
        :loading="loadingSignInWithEmailAndPassword"
        :disabled="loadingLoginWithGoogle"
        type="submit"
        color="primary"
        class="text-white normalLetterSpacing py-6"
        variant="flat"
        block
      >
        Entrar
      </v-btn>
    </v-form>

    <div class="mb-3 text-body-2">
      <div class="mb-3">
        <nuxt-link to="/auth/register">
          Não possui uma conta? Criar nova conta
        </nuxt-link>
      </div>

      <div>
        <nuxt-link to="privacy-policy">
          Políticas e termos
        </nuxt-link>
      </div>
    </div>
  </login-page-container>
</template>

<script setup lang="ts">
import { useRules } from '~/composables/commons/useRules'

import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'
import PasswordTextField from '~/components/commons/PasswordTextField.vue'

import { useLogin } from '~/composables/commons/useLogin'

const rules = useRules()

const emailLoginFormIsValid = ref()

const emailLoginPayload = ref({
  email: '',
  password: '',
})

const emailLoginFormRef = useTemplateRef('emailLoginFormRef')

const {
  handleLoginWithGoogle,
  handleSignInWithEmailAndPassword,

  loadingLoginWithGoogle,
  loadingSignInWithEmailAndPassword,
} = useLogin()

async function validateFormAndLoginWithEmail () {
  const validationResult = await emailLoginFormRef.value?.validate()

  if (validationResult?.valid) {
    handleSignInWithEmailAndPassword(emailLoginPayload.value.email, emailLoginPayload.value.password)
  }
}
</script>
