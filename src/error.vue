<template>
  <div class="errorPageContainer fillWidth d-flex align-center justify-center">
    <div class="text-center">
      <h1 class="text-h1 font-weight-bold text-primary mb-5">
        {{ error?.statusCode }}
      </h1>

      <p class="mb-8">
        {{ errorMessage }}
      </p>

      <v-btn
        to="/"
        class="normalLetterSpacing"
        prepend-icon="mdi-arrow-left"
        size="large"
        color="primary"
      >
        Voltar para o início
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 401:
      return 'Você não tem permissão para acessar a aplicação.'
    case 404:
      return 'Essa página não existe ou você não tem permissão para acessá-la.'
    case 500:
      return 'Ocorreu um erro interno. Por favor, tente novamente mais tarde.'
    default:
      return 'Ocorreu um erro não identificado. Por favor, tente novamente mais tarde.'
  }
})
</script>

<style lang="scss">
.errorPageContainer {
  height: 100vh;
}
</style>
