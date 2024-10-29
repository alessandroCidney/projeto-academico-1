<template>
  <v-app>
    <default-header />

    <desktop-navigation-bar
      v-if="!mobile"
    />

    <v-main
      :class="{
        defaultLayoutMain: true,
        mobile,
      }"
    >
      <slot />
    </v-main>

    <mobile-navigation-bar
      v-if="currentRouteIsInMainRoutes && mobile"
    />
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

import DefaultHeader from '~/components/layouts/DefaultHeader.vue'
import MobileNavigationBar from '~/components/layouts/MobileNavigationBar.vue'
import DesktopNavigationBar from '~/components/layouts/DesktopNavigationBar.vue'

import { mainRoutes } from '~/data/routes'

const { mobile } = useDisplay()

const route = useRoute()

const currentRouteIsInMainRoutes = computed(() => mainRoutes.value.map(mainRoute => mainRoute.route).includes(route.path))
</script>

<style lang="scss">
.defaultLayoutMain {
  overflow: auto !important;

  padding-right: 255px !important;

  &.mobile {
    padding-right: 0 !important;
  }
}
</style>
