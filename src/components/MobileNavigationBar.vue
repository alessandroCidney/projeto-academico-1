<template>
  <div class="bg-primary mobileNavigationBar fillWidth">
    <v-tabs
      align-tabs="center"
      color="white"
      stacked
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.route"
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
import { ref } from 'vue'

const tabs = ref([
  {
    route: '/news',
    icon: 'mdi-home',
    title: 'Início',
  },
  {
    route: '/articles',
    icon: 'mdi-text-box',
    title: 'Artigos',
  },
  {
    route: '/notifications',
    icon: 'mdi-bell',
    title: 'Notificações',
  },
  {
    route: '/account',
    icon: 'mdi-account-circle',
    title: 'Conta',
  },
])
</script>

<style lang="scss" scoped>
.mobileNavigationBar {
  position: fixed;
  bottom: 0;
  height: 80px;
}
</style>
