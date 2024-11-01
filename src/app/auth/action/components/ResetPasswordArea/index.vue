<template>
  <app-loading-screen v-if="loading" />

  <reset-password-error-screen
    v-else-if="linkCheckError"
    :error="linkCheckError"
  />

  <login-page-container v-else>
    <div class="font-weight-bold mb-5 text-h5">
      Redefinição de senha
    </div>

    <v-form
      v-model="formIsValid"
      @submit.prevent="handleResetPassword"
    >
      <div class="mb-5">
        <password-text-field
          v-model="resetPasswordFormData.password"
          :rules="[rules.required, rules.strongPassword]"
          label="Senha"
          placeholder="Digite a senha desejada"
          variant="outlined"
        />

        <password-text-field
          v-model="resetPasswordFormData.passwordConfirmation"
          :rules="[rules.required, rules.valuesAreEqual(resetPasswordFormData.password)]"
          :depends-on="resetPasswordFormData.password"
          label="Confirme a senha"
          placeholder="Digite a senha novamente"
          variant="outlined"
        />
      </div>

      <div class="d-flex align-center justify-center ga-2">
        <v-btn
          to="/auth/login"
          class="normalLetterSpacing flex-fill"
          color="grey-lighten-4"
          variant="flat"
          size="large"
        >
          Cancelar
        </v-btn>

        <v-btn
          :disabled="!formIsValid"
          type="submit"
          class="normalLetterSpacing flex-fill"
          color="primary"
          variant="flat"
          size="large"
        >
          Continuar
        </v-btn>
      </div>
    </v-form>
  </login-page-container>
</template>

<script setup lang="ts">
import { AuthErrorCodes, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

import ResetPasswordErrorScreen from './components/ResetPasswordErrorScreen.vue'

import AppLoadingScreen from '~/components/commons/loading/AppLoadingScreen.vue'
import PasswordTextField from '~/components/commons/PasswordTextField.vue'
import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'

import { useSnackbarStore } from '~/store/snackbar'

import { useRules } from '~/composables/commons/useRules'

const props = defineProps({
  actionCode: { type: String, required: true },
})

const nuxtApp = useNuxtApp()

const rules = useRules()

const snackbarStore = useSnackbarStore()

const loading = ref(false)

const linkCheckError = ref<Error>()

const formIsValid = ref(false)

const resetPasswordFormData = ref({
  password: '',
  passwordConfirmation: '',
})

onMounted(() => {
  handleCheckLink()
})

async function handleCheckLink () {
  try {
    loading.value = true

    await verifyPasswordResetCode(nuxtApp.$firebaseAuth, props.actionCode)
  } catch (err) {
    console.error(err)

    if (err instanceof Error) {
      linkCheckError.value = err
    }
  } finally {
    loading.value = false
  }
}

async function handleResetPassword () {
  try {
    loading.value = true

    await confirmPasswordReset(nuxtApp.$firebaseAuth, props.actionCode, resetPasswordFormData.value.password)

    snackbarStore.showSuccessSnackbar('Senha atualizada com sucesso!')

    await navigateTo({ path: '/' })
  } catch (err) {
    console.error(err)

    if (err instanceof FirebaseError) {
      if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
        snackbarStore.showErrorSnackbar('A senha fornecida é fraca')
      } else {
        snackbarStore.showErrorSnackbar()
      }
    }
  } finally {
    loading.value = false
  }
}
</script>
