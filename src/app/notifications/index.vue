<template>
  <div class="pageContainer">
    <h1 class="text-h5 font-weight-bold">
      Notificações
    </h1>

    <v-list class="itemsList">
      <template
        v-for="(notificationData, notificationDataIndex) in notificationsList"
        :key="`notificationData${notificationDataIndex}`"
      >
        <v-list-item
          class="mb-5"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                :src="''"
              />
            </v-avatar>
          </template>

          <v-list-item-title>
            {{ notificationData.authorId }}

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

const accountStore = useAccountStore()
const snackbarStore = useSnackbarStore()

const usersService = useUsersService()

const notificationsList = ref<FirestoreUserNotification[]>([])

const loadingNotifications = ref(false)

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

    loadingNotifications.value = true

    notificationsList.value = await usersService
      .useNotificationsService(accountStore.authUserData.uid)
      .list()
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingNotifications.value = false
  }
}
</script>
