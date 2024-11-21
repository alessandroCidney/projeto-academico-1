<template>
  <login-page-container>
    <h1 class="text-h5 font-weight-bold mb-5">
      Redefinição de senha
    </h1>

    <template v-if="confirmEmailIsFilled">
      <v-form
        v-if="accountStore.isAuthenticated && accountStore.userHasEmailAndPasswordLogin"
        v-model="resetPasswordFormIsValid"
        class="mb-16"
        @submit.prevent="reauthenticateAndUpdatePassword"
      >
        <div class="mb-5">
          Preencha as informações para continuar:
        </div>

        <div>
          <password-text-field
            v-model="resetPasswordFormData.password"
            :rules="[rules.required]"
            label="Senha anterior"
            placeholder="Digite a sua senha anterior"
            variant="outlined"
          />

          <password-text-field
            v-model="resetPasswordFormData.newPassword"
            :rules="[rules.required, rules.strongPassword]"
            label="Nova senha"
            placeholder="Digite a nova senha desejada"
            variant="outlined"
          />

          <password-text-field
            v-model="resetPasswordFormData.newPasswordConfirmation"
            :rules="[rules.required, rules.valuesAreEqual(resetPasswordFormData.newPassword)]"
            :depends-on="resetPasswordFormData.newPassword"
            label="Confirme a nova senha"
            placeholder="Digite a nova senha novamente"
            variant="outlined"
          />
        </div>

        <v-btn
          :disabled="!resetPasswordFormIsValid"
          :loading="loadingReauthenticateAndUpdatePassword"
          type="submit"
          class="normalLetterSpacing text-white"
          color="primary"
          variant="flat"
          size="large"
          block
        >
          Continuar
        </v-btn>
      </v-form>

      <div class="mb-5">
        <div class="font-weight-bold mb-5">
          Não lembra da sua senha anterior?
        </div>

        <p class="mb-5">
          Receba um link de redefinição de senha por e-mail clicando no botão abaixo.
        </p>

        <v-btn
          :loading="loadingSendPasswordResetEmail"
          class="normalLetterSpacing"
          color="grey-darken-3"
          variant="flat"
          size="large"
          block
          @click="handleSendPasswordResetEmail"
        >
          Receber link de redefinição
        </v-btn>
      </div>

      <v-btn
        class="normalLetterSpacing mr-2"
        color="grey-lighten-4"
        variant="flat"
        size="large"
        block
        @click="handleCancelAfterConfirmEmail()"
      >
        <v-icon
          v-if="!accountStore.isAuthenticated"
          start
        >
          mdi-arrow-left
        </v-icon>

        {{ accountStore.isAuthenticated ? 'Cancelar' : 'Voltar' }}
      </v-btn>
    </template>

    <template v-else>
      <v-form
        v-model="fillEmailFormIsValid"
        class="w-100"
        @submit.prevent="confirmEmailIsFilled = true"
      >
        <div class="mb-5">
          Informe seu email para iniciar o processo de redefinição:
        </div>

        <div>
          <v-text-field
            v-model="resetPasswordFormData.email"
            :rules="[rules.required, rules.email]"
            label="E-mail"
            placeholder="Digite seu e-mail"
            variant="outlined"
          />
        </div>

        <div class="d-flex align-center justify-center ga-2 w-100">
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
            :disabled="!fillEmailFormIsValid"
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
    </template>
  </login-page-container>
</template>

<script setup lang="ts">
import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from 'firebase/auth'

import { useRules } from '~/composables/commons/useRules'

import PasswordTextField from '~/components/commons/PasswordTextField.vue'
import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'

import { useAccountStore } from '~/store/account'
import { useSnackbarStore } from '~/store/snackbar'

const nuxtApp = useNuxtApp()

const rules = useRules()

const accountStore = useAccountStore()
const snackbarStore = useSnackbarStore()

const loadingReauthenticateAndUpdatePassword = ref(false)
const loadingSendPasswordResetEmail = ref(false)

const resetPasswordFormIsValid = ref()
const fillEmailFormIsValid = ref()

const confirmEmailIsFilled = ref(!!accountStore.firestoreUserPrivateData?.email)

const resetPasswordFormData = ref({
  email: accountStore.firestoreUserPrivateData?.email ?? '',
  password: '',
  newPassword: '',
  newPasswordConfirmation: '',
})

async function reauthenticateWithEmailAndPassword () {
  if (!nuxtApp.$firebaseAuth.currentUser) {
    throw new Error('Unauthenticated')
  }

  const credential = EmailAuthProvider.credential(resetPasswordFormData.value.email, resetPasswordFormData.value.password)

  await reauthenticateWithCredential(nuxtApp.$firebaseAuth.currentUser, credential)
}

async function reauthenticateAndUpdatePassword () {
  try {
    loadingReauthenticateAndUpdatePassword.value = true

    if (accountStore.isAuthenticated) {
      await reauthenticateWithEmailAndPassword()
    } else {
      await signInWithEmailAndPassword(nuxtApp.$firebaseAuth, resetPasswordFormData.value.email, resetPasswordFormData.value.password)
    }

    if (!nuxtApp.$firebaseAuth.currentUser) {
      throw new Error('Unauthenticated')
    }

    await updatePassword(nuxtApp.$firebaseAuth.currentUser, resetPasswordFormData.value.newPassword)

    snackbarStore.showSuccessSnackbar('Senha redefinida com sucesso!')
    await navigateTo({ path: '/' })
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingReauthenticateAndUpdatePassword.value = false
  }
}

async function handleSendPasswordResetEmail () {
  try {
    loadingSendPasswordResetEmail.value = true

    if (!resetPasswordFormData.value.email) {
      throw new Error('Cannot found email')
    }

    await sendPasswordResetEmail(nuxtApp.$firebaseAuth, resetPasswordFormData.value.email)

    snackbarStore.showSuccessSnackbar('E-mail enviado! Verifique sua caixa de entrada')

    await navigateTo({ path: '/' })
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingSendPasswordResetEmail.value = false
  }
}

async function handleCancelAfterConfirmEmail () {
  if (accountStore.firestoreUserPrivateData?.email) {
    await navigateTo({ path: '/account' })
  } else {
    confirmEmailIsFilled.value = false
  }
}
</script>

<style lang="scss">
.resetPasswordPage {
  padding-bottom: 120px !important;
}
</style>
