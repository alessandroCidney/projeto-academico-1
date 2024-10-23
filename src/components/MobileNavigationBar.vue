<template>
  <div class="bg-primary mobileNavigationBar fillWidth">
    <v-tabs
      v-model="currentRoute"
      align-tabs="center"
      selected-class="text-white"
      stacked
    >
      <v-tab
        v-for="tab in mainRoutes"
        :key="tab.route"
        :value="tab.route"
        class="normalLetterSpacing"
      >
        <v-icon class="mb-1">
          {{ tab.icon }}
        </v-icon>

        {{ tab.title }}
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
  position: fixed;
  bottom: 0;
  height: 80px;
}
</style>
