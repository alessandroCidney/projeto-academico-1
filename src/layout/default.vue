<template>
  <v-app>
    <v-main class="defaultLayoutMain">
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss">
.defaultLayoutMain {
  overflow: auto !important;
}
</style>
