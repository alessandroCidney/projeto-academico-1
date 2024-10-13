<template>
  <v-app-bar
    color="primary"
    class="pl-5 pr-2"
  >
    <template #prepend>
      <v-img
        src="@/assets/images/logos/white.svg"
        width="150px"
      />
    </template>

    <template #append>
      <v-btn
        to="/admin/users"
        icon="mdi-star"
      />

      <v-btn
        icon="mdi-magnify"
      />
    </template>
  </v-app-bar>
</template>
