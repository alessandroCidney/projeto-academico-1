<template>
  <div
    v-if="loadingList"
    class="fill-width fill-height d-flex align-center justify-center"
  >
    <v-progress-circular
      size="150"
      width="8"
      color="primary"
      indeterminate
    />
  </div>

  <div
    v-else
    class="pageContainer"
  >
    <div class="d-flex align-center mb-8">
      <v-btn
        icon="mdi-chevron-left"
        variant="tonal"
        class="mr-5"
        @click="$router.push('/')"
      />

      <h1 class="text-h5 font-weight-bold">
        Painel do Admin
      </h1>
    </div>

    <div>
      <h2 class="text-h6 font-weight-bold">
        Usuários Cadastrados
      </h2>

      <v-list>
        <template
          v-for="(userData, userIndex) in usersList"
          :key="`user${userIndex}`"
        >
          <v-list-item class="py-3">
            <template #prepend>
              <user-avatar
                :src="userData.imageUrl"
                :size="50"
              />
            </template>

            <template #title>
              {{ userData.displayName }}
            </template>

            <template #subtitle>
              {{ userData.position }}
            </template>

            <template #append>
              <v-btn
                icon="mdi-pencil"
                variant="text"
              />

              <v-btn
                icon="mdi-delete"
                variant="text"
              />
            </template>
          </v-list-item>

          <v-divider />
        </template>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '~/store/snackbar'

import { useUsersService } from '~/composables/services/useUsersService'

import UserAvatar from '~/components/commons/UserAvatar.vue'

const snackbarStore = useSnackbarStore()

const usersService = useUsersService()

const loadingList = ref(false)

const usersList = ref<Awaited<ReturnType<typeof usersService.list>>>([])

onMounted(() => {
  handleList()
})

async function handleList () {
  try {
    loadingList.value = true

    usersList.value = await usersService.list()
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingList.value = false
  }
}
</script>
