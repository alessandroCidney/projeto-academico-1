<template>
  <div
    v-if="mainStore.loadingAuthPlugin"
    class="d-flex align-center justify-center appLoadingContainer"
  >
    <v-progress-circular
      width="8"
      size="150"
      color="primary"
      indeterminate
    />
  </div>

  <nuxt-layout
    v-else
  >
    <nuxt-page />

    <app-snackbar />
  </nuxt-layout>
</template>

<script setup lang="ts">
import { authMiddlewareCheck } from './middleware/auth.global'

import AppSnackbar from '~/components/commons/AppSnackbar.vue'

import { useMainStore } from '~/store'

import { waitFor } from '~/utils'

const route = useRoute()

const mainStore = useMainStore()

onMounted(async () => {
  await waitFor(() => !mainStore.loadingAuthPlugin)

  await authMiddlewareCheck(route)
})
</script>

<style lang="scss" scoped>
.appLoadingContainer {
  height: 100vh;
}
</style>
