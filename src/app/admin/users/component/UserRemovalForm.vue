<template>
  <form-dialog
    :submit="handleConfirm"
    title="Excluir usuário"
  >
    <template #activator="{ props: activatorProps }">
      <slot
        :props="activatorProps"
        name="activator"
      />
    </template>

    <div>
      O usuário <span class="font-weight-bold">{{ userData.displayName }}</span> será removido e suas informações serão excluídas.
      Deseja continuar?
    </div>
  </form-dialog>
</template>

<script setup lang="ts">
import _ from 'lodash'

import FormDialog from '~/components/commons/FormDialog.vue'

import { FirestoreUser, useUsersService } from '~/composables/services/useUsersService'

const props = defineProps({
  userData: { type: Object as PropType<FirestoreUser>, default: () => new FirestoreUser() },
})

const usersService = useUsersService()

const usersListModel = defineModel<FirestoreUser[]>('users-list', { default: () => [] })

async function handleConfirm () {
  await usersService.remove(props.userData._id)

  const itemIndex = usersListModel.value.findIndex(item => item._id === props.userData._id)

  if (itemIndex !== -1) {
    usersListModel.value.splice(itemIndex, 1)
  }
}
</script>
