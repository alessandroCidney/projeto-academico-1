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
      <template v-if="usersList.length === 0">
        <warning-screen
          title="Sem usuários cadastrados"
          description="Os usuários que se cadastrarem aparecerão aqui"
          image="/images/illustrations/users.svg"
        />
      </template>

      <v-list v-else>
        <h2 class="text-h6 font-weight-bold">
          Usuários Cadastrados
        </h2>

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
              <user-form
                v-model:users-list="usersList"
                :initial-payload="userData"
                is-update
              >
                <template #activator="{ props: activatorProps }">
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    v-bind="activatorProps"
                  />
                </template>
              </user-form>

              <user-removal-form
                v-model:users-list="usersList"
                :user-data="userData"
              >
                <template #activator="{ props: activatorProps }">
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    v-bind="activatorProps"
                  />
                </template>
              </user-removal-form>
            </template>
          </v-list-item>

          <v-divider />
        </template>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserForm from './component/UserForm.vue'
import UserRemovalForm from './component/UserRemovalForm.vue'

import WarningScreen from '~/components/commons/WarningScreen.vue'
import UserAvatar from '~/components/commons/UserAvatar.vue'

import { useSnackbarStore } from '~/store/snackbar'

import { useUsersService } from '~/composables/services/useUsersService'

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
