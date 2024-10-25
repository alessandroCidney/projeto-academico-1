<template>
  <div class="loginPage">
    <v-img
      src="@/assets/images/photos/team.jpg"
      width="100%"
      height="30vh"
      cover
    >
      <div class="teamImageOverlay fillWidth fillHeight" />
    </v-img>

    <div class="pa-10">
      <v-img
        src="@/assets/images/logos/default.svg"
        width="230px"
        class="mb-10"
      />

      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.teamImageOverlay {
  background-color: rgb(var(--v-theme-primary), .4);
}

.loginPage {
  min-height: 100vh;
}
</style>
