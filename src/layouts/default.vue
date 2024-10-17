<template>
  <v-app>
    <default-header />

    <v-main class="defaultLayoutMain">
      <slot />
    </v-main>

    <mobile-navigation-bar />
  </v-app>
</template>

<script setup lang="ts">
import DefaultHeader from '@/components/DefaultHeader.vue'
import MobileNavigationBar from '@/components/MobileNavigationBar.vue'
</script>

<style lang="scss">
.defaultLayoutMain {
  overflow: auto !important;

  --v-layout-bottom: 80px !important;
}
</style>
