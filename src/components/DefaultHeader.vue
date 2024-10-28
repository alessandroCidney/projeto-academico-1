<template>
  <v-app-bar
    color="primary"
    class="pl-5 pr-2"
  >
    <template #prepend>
      <v-img
        src="@/assets/images/logos/white.svg"
        class="cursor-pointer"
        width="150px"
        @click="navigateTo({ path: '/' })"
      />
    </template>

    <template #append>
      <v-btn
        v-if="accountStore.firestoreUserData?.role === 'Admin'"
        to="/admin/users"
        icon="mdi-star"
      />

      <v-btn
        to="/search"
        icon="mdi-magnify"
      />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/store/account'

const accountStore = useAccountStore()
</script>
