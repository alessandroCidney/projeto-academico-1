<template>
  <v-app>
    <default-header />

    <v-main class="defaultLayoutMain">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import DefaultHeader from '@/components/DefaultHeader.vue'
</script>

<style lang="scss">
.defaultLayoutMain {
  overflow: auto !important;
}
</style>
