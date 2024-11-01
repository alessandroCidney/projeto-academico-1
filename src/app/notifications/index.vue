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
    <h1 class="font-weight-bold">
      Notificações
    </h1>

    <template v-if="notificationsList.length === 0">
      <warning-screen
        title="Sem notificações"
        description="Você não recebeu novas notificações até o momento"
        image="/images/illustrations/notifications.svg"
      />
    </template>

    <v-list
      v-else
      class="itemsList"
    >
      <template
        v-for="(notificationData, notificationDataIndex) in notificationsList"
        :key="`notificationData${notificationDataIndex}`"
      >
        <v-list-item
          class="mb-5"
        >
          <template #prepend>
            <user-avatar
              :src="accountStore.cachedUsers[notificationData.authorId]?.imageUrl"
              :size="50"
            />
          </template>

          <v-list-item-title>
            {{ accountStore.cachedUsers[notificationData.authorId]?.displayName ?? 'Usuário removido' }}

            {{ actionDetails[notificationData.action].text }}
            {{ actionDetails[notificationData.action].target[notificationData.target] }}
          </v-list-item-title>
        </v-list-item>

        <v-divider
          class="mb-5"
        />
      </template>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useAccountStore } from '~/store/account'
import { useSnackbarStore } from '~/store/snackbar'

import { type FirestoreUserNotification, useUsersService } from '~/composables/services/useUsersService'

import WarningScreen from '~/components/commons/WarningScreen.vue'
import UserAvatar from '~/components/commons/UserAvatar.vue'

const accountStore = useAccountStore()
const snackbarStore = useSnackbarStore()

const usersService = useUsersService()

const notificationsList = ref<FirestoreUserNotification[]>([])

const loadingList = ref(false)

const actionDetails = {
  like: {
    text: 'gostou',
    target: {
      news: 'da sua notícia',
      article: 'do seu artigo',
    },
  },
  comment: {
    text: 'comentou',
    target: {
      news: 'na sua notícia',
      article: 'no seu artigo',
    },
  },
}

onMounted(() => {
  handleList()
})

async function handleList () {
  try {
    if (!accountStore.authUserData) {
      throw new Error('Unauthenticated')
    }

    loadingList.value = true

    notificationsList.value = await usersService
      .useNotificationsService(accountStore.authUserData.uid)
      .list()

    for (const notificationData of notificationsList.value) {
      await usersService.getUserAndSaveToStoreCache(notificationData.authorId)
    }
  } catch (err) {
    console.error(err)

    if (err instanceof Error && err.message !== 'Not found') {
      snackbarStore.showErrorSnackbar()
    }
  } finally {
    loadingList.value = false
  }
}
</script>
