<template>
  <div
    class="resetPasswordPage py-10 px-5"
  >
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center justify-start">
        <v-btn
          icon="mdi-chevron-left"
          variant="tonal"
          class="mr-5"
          @click="$router.push('/account')"
        />

        <h1 class="text-h5 font-weight-bold  font-weight-bold">
          Redefinição de senha
        </h1>
      </div>
    </div>

    <div class="mb-5 px-2">
      <div class="mb-5">
        Informe a senha anterior para continuar ou solicite um código de acesso via e-mail:
      </div>

      <div>
        <v-text-field
          variant="outlined"
          label="Senha anterior"
        />
      </div>
    </div>

    <div class="mb-2">
      <v-btn
        class="normalLetterSpacing text-white"
        color="primary"
        variant="flat"
        size="large"
        block
      >
        Continuar
      </v-btn>
    </div>

    <div>
      <v-btn
        class="normalLetterSpacing"
        color="grey-darken-3"
        variant="flat"
        size="large"
        block
      >
        Receber link de redefinição
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.resetPasswordPage {
  padding-bottom: 120px !important;
}
</style>
