<template>
  <form-dialog
    :title="isUpdate ? 'Atualizar usuário' : 'Criar novo usuário'"
    :submit="handleSubmit"
  >
    <template #activator="{ props: activatorProps }">
      <slot
        :props="activatorProps"
        name="activator"
      />
    </template>

    <template #submitButton="{ loading, action }">
      <v-btn
        :disabled="!validModel"
        :loading="loading"
        class="normalLetterSpacing px-8"
        variant="flat"
        color="primary"
        text="Continuar"
        @click="action"
      />
    </template>

    <v-form
      v-model="validModel"
      @submit.prevent="handleSubmit"
    >
      <v-text-field
        v-model="formPayload.displayName"
        :rules="[rules.required, rules.maxLength(200)]"
        label="Nome"
      />

      <v-text-field
        v-model="formPayload.position"
        :rules="[rules.required, rules.maxLength(200)]"
        label="Cargo"
      />

      <v-select
        v-model="formPayload.role"
        :rules="[rules.required]"
        :items="['Viewer', 'Admin']"
        label="Nível de acesso"
      />

      <v-checkbox
        v-model="formPayload.manuallyVerified"
        label="Verificado manualmente"
        hide-details
      />

      <v-checkbox
        v-model="formPayload.blockAccess"
        label="Bloquear acesso"
        hide-details
      />
    </v-form>
  </form-dialog>
</template>

<script setup lang="ts">
import _ from 'lodash'

import { useRules } from '~/composables/commons/useRules'

import FormDialog from '~/components/commons/FormDialog.vue'

import { FirestoreUser, useUsersService } from '~/composables/services/useUsersService'

const props = defineProps({
  initialPayload: { type: Object as PropType<FirestoreUser>, default: () => new FirestoreUser() },
  isUpdate: Boolean,
})

const rules = useRules()

const usersService = useUsersService()

const usersListModel = defineModel<FirestoreUser[]>('users-list', { default: () => [] })

const validModel = ref(false)

const formPayload = ref(_.cloneDeep(props.initialPayload))

async function handleSubmit () {
  if (props.isUpdate) {
    const newData: FirestoreUser = {
      ...props.initialPayload,
      displayName: formPayload.value.displayName,
      position: formPayload.value.position,
      role: formPayload.value.role,
      manuallyVerified: formPayload.value.manuallyVerified,
      blockAccess: formPayload.value.blockAccess,
      updatedAt: new Date().toISOString(),
    }

    await usersService.update(newData._id, newData)

    const itemIndex = usersListModel.value.findIndex(item => item._id === newData._id)

    if (itemIndex !== -1) {
      usersListModel.value[itemIndex] = _.cloneDeep(newData)
    }
  }
}
</script>
