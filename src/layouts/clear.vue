<template>
  <v-app>
    <v-main class="clearLayoutMain">
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss">
.clearLayoutMain {
  overflow: auto !important;
}
</style>
