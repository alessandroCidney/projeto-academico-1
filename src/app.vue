<template>
  <div
    v-if="mainStore.loadingAuthPlugin"
    class="d-flex align-center justify-center appLoadingContainer"
  >
    <v-progress-circular
      width="7"
      size="150"
      color="primary"
      indeterminate
    />
  </div>

  <nuxt-layout
    v-else
  >
    <nuxt-page />
  </nuxt-layout>
</template>

<script setup lang="ts">
import { useMainStore } from '~/store'
import { useAccountStore } from '~/store/account'

import { waitFor } from '~/utils'

const route = useRoute()
const router = useRouter()

const mainStore = useMainStore()
const accountStore = useAccountStore()

onMounted(async () => {
  console.log('waiting', mainStore.loadingAuthPlugin)
  await waitFor(() => !mainStore.loadingAuthPlugin)

  console.log('end waiting')

  if (route.name === 'login' && accountStore.isAuthenticated) {
    console.log('navigate to index')
    await router.push('/news')
  }

  if (route.name !== 'login' && !accountStore.isAuthenticated) {
    console.log('navigate to login')
    await router.push('/login')
  }
})
</script>

<style lang="scss" scoped>
.appLoadingContainer {
  height: 100vh;
}
</style>
