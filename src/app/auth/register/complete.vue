<template>
  <div
    v-if="loadingRegister"
    class="fill-width fill-height d-flex align-center justify-center"
  >
    <v-progress-circular
      size="150"
      width="8"
      color="primary"
      indeterminate
    />
  </div>

  <login-page-container v-else-if="accountStore.firestoreUserData">
    <div class="font-weight-bold mb-5 text-h5">
      Complete seu cadastro
    </div>

    <div class="mb-5">
      Preencha algumas informações para continuar:
    </div>

    <v-form
      v-model="validModel"
      @submit.prevent="handleCompleteRegistration"
    >
      <div class="mb-5">
        <v-text-field
          v-model="userUpdatePayload.displayName"
          :rules="[rules.required, rules.maxLength(200)]"
          label="Nome"
          placeholder="Digite o seu nome"
          variant="outlined"
        />

        <v-combobox
          v-model="userUpdatePayload.position"
          :rules="[rules.required]"
          :items="['Avaliador', 'Estudante', 'Visitante', 'Outro']"
          offset="top"
          label="Cargo"
          placeholder="Informe o seu cargo"
          variant="outlined"
          max-height="500px"
        />
      </div>

      <div class="d-flex align-center justify-center ga-2">
        <v-btn
          class="normalLetterSpacing flex-fill"
          color="grey-lighten-4"
          variant="flat"
          size="large"
          @click="handleSignOut"
        >
          Cancelar
        </v-btn>

        <v-btn
          :disabled="!validModel"
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
import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'

import { useUsersService } from '~/composables/services/useUsersService'
import { useLogin } from '~/composables/commons/useLogin'
import { useRules } from '~/composables/commons/useRules'

import { useSnackbarStore } from '~/store/snackbar'
import { useAccountStore } from '~/store/account'

const snackbarStore = useSnackbarStore()
const accountStore = useAccountStore()

const usersService = useUsersService()
const { handleSignOut } = useLogin()
const rules = useRules()

const validModel = ref(false)
const loadingRegister = ref(false)

const userUpdatePayload = ref({
  displayName: '',
  position: '',
})

async function handleCompleteRegistration () {
  try {
    loadingRegister.value = true

    if (!accountStore.firestoreUserData) {
      throw new Error('Unauthenticated')
    }

    await usersService.update(accountStore.firestoreUserData._id, {
      ...accountStore.firestoreUserData,
      displayName: userUpdatePayload.value.displayName,
      position: userUpdatePayload.value.position,
      updatedAt: new Date().toISOString(),
      completedRegistration: true,
    })

    reloadNuxtApp()
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingRegister.value = false
  }
}
</script>
