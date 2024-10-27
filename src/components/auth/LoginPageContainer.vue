<template>
  <div
    :class="{
      'loginPage': true,
      'd-flex align-center justify-space-between': !mobile,
    }"
  >
    <v-img
      src="@/assets/images/photos/team.jpg"
      :height="mobile ? '30vh' : '100vh'"
      :width="mobile ? '100%' : '50%'"
      cover
    >
      <div class="teamImageOverlay fillWidth fillHeight" />
    </v-img>

    <div
      :style="{
        width: mobile ? '100%' : '50%',
      }"
      class="pa-10"
    >
      <div
        :style="{
          margin: 'auto',
          maxWidth: mobile ? 'none' : '500px',
        }"
      >
        <v-img
          src="@/assets/images/logos/default.svg"
          width="230px"
          class="mb-10"
        />

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<style lang="scss" scoped>
.teamImageOverlay {
  background-color: rgb(var(--v-theme-primary), .4);
}

.loginPage {
  min-height: 100vh;
}
</style>
