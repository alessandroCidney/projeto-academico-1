<template>
  <login-page-container>
    <div class="font-weight-bold mb-5 text-h5">
      {{ errorDetails.title }}
    </div>

    <p class="mb-5">
      {{ errorDetails.description }}
    </p>

    <v-btn
      to="/auth/login"
      color="grey-lighten-4"
      class="normalLetterSpacing"
      prepend-icon="mdi-arrow-left"
      variant="flat"
      size="large"
      block
    >
      Voltar
    </v-btn>
  </login-page-container>
</template>

<script setup lang="ts">
import { FirebaseError } from 'firebase/app'
import { AuthErrorCodes } from 'firebase/auth'
import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'

const props = defineProps({
  error: { type: Object as PropType<Error>, required: true },
})

const errorDetails = computed(() => {
  if (props.error instanceof FirebaseError) {
    switch (props.error.code) {
      case AuthErrorCodes.EXPIRED_OOB_CODE:
        return {
          title: 'Link expirado',
          description: 'O link utilizado está expirado. Por favor, solicite um novo link de redefinição de senha e tente novamente.',
        }
      case AuthErrorCodes.INVALID_OOB_CODE:
        return {
          title: 'Link inválido',
          description: 'O link utilizado é inválido. Por favor, solicite um novo link de redefinição de senha e tente novamente.',
        }
    }
  }

  return {
    title: 'Ocorreu um erro',
    description: 'Não foi possível iniciar a redefinição de senha. Por favor, tente novamente.',
  }
})
</script>
