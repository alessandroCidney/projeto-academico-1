<template>
  <div class="loginPage">
    <v-img
      src="@/assets/images/photos/team.jpg"
      width="100%"
      height="30%"
      cover
    >
      <div class="teamImageOverlay fillWidth fillHeight" />
    </v-img>

    <div class="pa-10">
      <h1 class="mb-10">
        Company<span class="text-primary">Culture</span>
      </h1>

      <v-form class="mb-10">
        <v-text-field
          label="E-mail"
          placeholder="user@example.com"
          variant="outlined"
        />

        <v-text-field
          label="Senha"
          placeholder="Digite sua senha"
          variant="outlined"
        />

        <v-btn
          color="primary"
          class="text-white normalLetterSpacing py-6"
          variant="flat"
          block
        >
          Entrar
        </v-btn>
      </v-form>

      <ul>
        <li class="mb-2">
          <nuxt-link
            to="reset-password"
          >
            Esqueceu sua senha?
          </nuxt-link>
        </li>

        <li>
          <nuxt-link
            to="privacy-policy"
          >
            Privacidade
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.teamImageOverlay {
  background-color: rgb(var(--v-theme-primary), .4);
}

.loginPage {
  height: 100vh;
}
</style>
