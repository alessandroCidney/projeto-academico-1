<template>
  <div class="pageContainer">
    <div class="d-flex align-center mb-8">
      <v-btn
        icon="mdi-chevron-left"
        variant="tonal"
        class="mr-5"
        @click="$router.push('/account')"
      />

      <h1 class="text-h5 font-weight-bold">
        Dados pessoais
      </h1>
    </div>

    <v-list>
      <personal-data-item
        v-for="(personalDataItem, personalDataItemIndex) in items"
        :key="`personalDataItem${personalDataItemIndex}`"
        :item="personalDataItem"
      />
    </v-list>
  </div>
</template>

<script setup lang="ts">
import PersonalDataItem from './components/PersonalDataItem.vue'

import { useAccountStore } from '~/store/account'

import { useUsersService } from '~/composables/services/useUsersService'

const accountStore = useAccountStore()

const usersService = useUsersService()

const items = computed(() => [
  {
    title: 'Nome',
    value: accountStore.firestoreUserData?.displayName,
    allowEdition: true,
    update: updateDisplayName,
  },
  {
    title: 'Cargo',
    value: accountStore.firestoreUserData?.position,
    allowEdition: false,
  },
  {
    title: 'E-mail',
    value: accountStore.firestoreUserPrivateData?.email,
    allowEdition: false,
  },
])

async function updateDisplayName (newValue: string) {
  try {
    let firestoreUserData = accountStore.firestoreUserData
    const authUserData = accountStore.authUserData

    if (firestoreUserData && authUserData) {
      firestoreUserData = {
        ...firestoreUserData,
        displayName: newValue,
      }

      await usersService.update(authUserData.uid, firestoreUserData)

      accountStore.setFirestoreUserData(firestoreUserData)
    }
  } catch (err) {
    console.error(err)
  }
}
</script>
