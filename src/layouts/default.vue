<template>
  <v-app>
    <default-header />

    <v-main class="defaultLayoutMain">
      <slot />
    </v-main>

    <mobile-navigation-bar v-if="currentRouteIsInMainRoutes" />
  </v-app>
</template>

<script setup lang="ts">
import DefaultHeader from '@/components/DefaultHeader.vue'
import MobileNavigationBar from '@/components/MobileNavigationBar.vue'

import { mainRoutes } from '~/data/routes'

const route = useRoute()

const currentRouteIsInMainRoutes = computed(() => mainRoutes.value.map(mainRoute => mainRoute.route).includes(route.path))
</script>

<style lang="scss">
.defaultLayoutMain {
  overflow: auto !important;

  --v-layout-bottom: 80px !important;
}
</style>
