<template>
  <app-loading-screen v-if="loadingCheck" />

  <login-page-container v-else-if="invalidLink">
    <div class="font-weight-bold mb-5 text-h5">
      Link inválido
    </div>

    <p class="mb-8">
      O link de acesso utilizado é inválido e não pode ser utilizado.
      Verifique se a URL está correta e tente novamente.
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

  <template v-else-if="validatedParams">
    <reset-password-area
      v-if="validatedParams.mode === 'resetPassword'"
      :action-code="validatedParams.actionCode"
    />
  </template>
</template>

<script setup lang="ts">
import ResetPasswordArea from './components/ResetPasswordArea/index.vue'

import AppLoadingScreen from '~/components/commons/loading/AppLoadingScreen.vue'
import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'

const route = useRoute()

const validatedParams = ref<{
  mode: string
  actionCode: string
}>()

const loadingCheck = ref(false)
const invalidLink = ref(false)

onMounted(() => {
  try {
    loadingCheck.value = true

    if (typeof route.query.mode !== 'string' || typeof route.query.oobCode !== 'string') {
      throw new Error('Invalid link')
    }

    validatedParams.value = {
      mode: route.query.mode,
      actionCode: route.query.oobCode,
    }
  } catch (err) {
    invalidLink.value = true
    console.error(err)
  } finally {
    loadingCheck.value = false
  }
})
</script>
