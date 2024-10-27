<template>
  <div class="pageContainer accountPage pa-10">
    <h1 class="mb-10">
      Minha conta
    </h1>

    <div class="d-flex align-center justify-space-start mb-5">
      <div class="mr-5">
        <user-avatar
          :src="accountStore.firestoreUserData?.imageUrl"
        />
      </div>

      <div>
        <h2 class="text-h6 font-weight-bold">
          {{ accountStore.userDisplayNameStr }}
        </h2>

        <div class="text-body-1">
          {{ accountStore.firestoreUserData?.position }}
        </div>
      </div>
    </div>

    <div class="mb-5">
      <v-list class="accountPageOptions">
        <v-list-item
          to="/account/personal-data"
          class="py-5"
        >
          <template #title>
            Dados pessoais
          </template>

          <template #append>
            <v-icon>
              mdi-chevron-right
            </v-icon>
          </template>
        </v-list-item>

        <v-list-item
          to="/account/reset-password"
          class="py-5"
        >
          <template #title>
            Redefinição de senha
          </template>

          <template #append>
            <v-icon>
              mdi-chevron-right
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <div>
      <v-btn
        class="normalLetterSpacing"
        prepend-icon="mdi-arrow-left"
        variant="flat"
        color="error"
        size="large"
        block
        @click="handleSignOut"
      >
        Sair
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { signOut } from 'firebase/auth'

import UserAvatar from '~/components/commons/UserAvatar.vue'

import { useAccountStore } from '~/store/account'

const accountStore = useAccountStore()

const nuxtApp = useNuxtApp()

async function handleSignOut () {
  await signOut(nuxtApp.$firebaseAuth)

  accountStore.setAuthUserData(undefined)
  accountStore.setFirestoreUserData(undefined)
  accountStore.setFirestoreUserPrivateData(undefined)

  await navigateTo({ path: '/auth/login' })
}
</script>

<style lang="scss">
.accountPage {
  .accountPageOptions {
    .v-list-item {
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
