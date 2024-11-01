<template>
  <div class="bg-primary mobileNavigationBar w-100">
    <v-tabs
      v-model="currentRoute"
      align-tabs="center"
      selected-class="text-white"
      stacked
    >
      <v-tab
        v-for="routeData in mainRoutes"
        :key="routeData.route"
        :value="routeData.route"
        class="normalLetterSpacing"
      >
        <v-icon class="mb-1">
          {{ routeData.icon }}
        </v-icon>

        {{ routeData.title }}
      </v-tab>
    </v-tabs>
  </div>
</template>

<script setup lang="ts">
import { mainRoutes } from '~/data/routes'

const route = useRoute()

const currentRoute = computed({
  get () {
    return route.path
  },

  async set (newPath) {
    await navigateTo({ path: newPath })
  },
})
</script>

<style lang="scss" scoped>
.mobileNavigationBar {
  position: sticky;
  bottom: 0;
  height: 80px;
}
</style>
