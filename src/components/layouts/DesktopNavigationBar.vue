<template>
  <v-navigation-drawer
    class="pa-3"
  >
    <template
      v-for="routeData in mainRoutes"
      :key="routeData.route"
    >
      <v-list-item
        :to="routeData.route"
        class="py-4"
      >
        <template #prepend>
          <v-icon>
            {{ routeData.icon }}
          </v-icon>
        </template>

        <template #title>
          {{ routeData.title }}
        </template>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { mainRoutes } from '~/data/routes'
</script>
