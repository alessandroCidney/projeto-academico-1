<template>
  <div
    v-if="mainStore.loadingAuthPlugin || loadingRoot"
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
import { useTheme } from 'vuetify'

import { authMiddlewareCheck } from './middleware/2.auth.global'

import AppSnackbar from '~/components/commons/AppSnackbar.vue'

import { useMainStore } from '~/store'

import { waitFor } from '~/utils'

const theme = useTheme()

const route = useRoute()

const mainStore = useMainStore()

const loadingRoot = ref(false)

onMounted(async () => {
  loadingRoot.value = true

  await waitFor(() => !mainStore.loadingAuthPlugin)

  await authMiddlewareCheck(route)

  theme.global.name.value = 'mainTheme'

  loadingRoot.value = false
})
</script>

<style lang="scss" scoped>
.appLoadingContainer {
  height: 100vh;
}
</style>
