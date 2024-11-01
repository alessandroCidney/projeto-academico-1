<template>
  <v-app>
    <default-header
      disable-buttons
    />

    <v-main class="policiesLayoutMain">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import DefaultHeader from '~/components/layouts/DefaultHeader.vue'
</script>

<style lang="scss">
.policiesLayoutMain {
  overflow: auto !important;
}
</style>
