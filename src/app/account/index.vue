<template>
  <div class="accountPage pa-10">
    <h1 class="text-h5 font-weight-bold mb-10">
      Minha conta
    </h1>

    <div class="d-flex align-center justify-space-start mb-5">
      <div class="mr-5">
        <v-avatar
          size="80"
        >
          <v-img
            src="https://cdn.pixabay.com/photo/2019/07/26/11/33/campaign-4364557_1280.jpg"
          />
        </v-avatar>
      </div>

      <div>
        <h2 class="text-h6 font-weight-bold">
          Nome do usuário
        </h2>

        <div class="text-body-1">
          Cargo do usuário
        </div>
      </div>
    </div>

    <div>
      <v-list class="accountPageOptions">
        <v-list-item
          class="py-5"
          @click="() => {}"
        >
          <template #title>
            Dados pessoais
          </template>

          <template #append>
            <v-icon>
              mdi-chevron-right
            </v-icon>
          </template>
        </v-list-item>

        <v-list-item
          to="/account/reset-password"
          class="py-5"
        >
          <template #title>
            Redefinição de senha
          </template>

          <template #append>
            <v-icon>
              mdi-chevron-right
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<style lang="scss">
.accountPage {
  .accountPageOptions {
    .v-list-item {
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
