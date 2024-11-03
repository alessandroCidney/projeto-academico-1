<template>
  <form-dialog
    :submit="handleConfirm"
    title="Excluir conta"
  >
    <template #activator="{ props: removalAccountDialogProps }">
      <slot
        :props="removalAccountDialogProps"
        name="activator"
      />
    </template>

    <div class="mb-5">
      A sua conta será excluída e você perderá acesso à plataforma.
      Deseja continuar?
    </div>

    <v-form
      v-if="!accountStore.userHasGoogleLogin"
      v-model="validModel"
      @submit.prevent
    >
      <password-text-field
        v-model="userPassword"
        label="Digite sua senha"
      />
    </v-form>

    <template #submitButton="{ action: submitButtonAction, loading: submitButtonLoading }">
      <v-btn
        :disabled="!validModel && !accountStore.userHasGoogleLogin"
        :loading="submitButtonLoading"
        class="normalLetterSpacing px-8"
        variant="flat"
        color="primary"
        text="Continuar"
        @click="submitButtonAction"
      />
    </template>
  </form-dialog>
</template>

<script setup lang="ts">
import _ from 'lodash'

import { deleteUser } from 'firebase/auth'

import FormDialog from '~/components/commons/FormDialog.vue'
import PasswordTextField from '~/components/commons/PasswordTextField.vue'

import { FirestoreUser, useUsersService } from '~/composables/services/useUsersService'

import { useLogin } from '~/composables/commons/useLogin'

import { useAccountStore } from '~/store/account'

const props = defineProps({
  userData: { type: Object as PropType<FirestoreUser>, default: () => new FirestoreUser() },
})

const nuxtApp = useNuxtApp()

const accountStore = useAccountStore()

const { reauthenticateWithGoogle, reauthenticateWithEmailAndPassword } = useLogin()

const validModel = ref(false)
const userPassword = ref('')

const usersService = useUsersService()

const usersListModel = defineModel<FirestoreUser[]>('users-list', { default: () => [] })

async function handleConfirm () {
  if (!accountStore.authUserData?.email || !nuxtApp.$firebaseAuth.currentUser) {
    throw new Error('Unauthenticated')
  }

  if (!accountStore.userHasGoogleLogin) {
    await reauthenticateWithEmailAndPassword(accountStore.authUserData.email, userPassword.value)
  } else {
    await reauthenticateWithGoogle()
  }

  await usersService.remove(props.userData._id)

  const itemIndex = usersListModel.value.findIndex(item => item._id === props.userData._id)

  if (itemIndex !== -1) {
    usersListModel.value.splice(itemIndex, 1)
  }

  await deleteUser(nuxtApp.$firebaseAuth.currentUser)

  reloadNuxtApp()
}
</script>
