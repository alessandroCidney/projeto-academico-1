<template>
  <app-loading-screen />
</template>

<script setup lang="ts">
import { applyActionCode } from 'firebase/auth'
import AppLoadingScreen from '~/components/commons/loading/AppLoadingScreen.vue'

import { useSnackbarStore } from '~/store/snackbar'

const props = defineProps({
  actionCode: { type: String, required: true },
})

const nuxtApp = useNuxtApp()

const snackbarStore = useSnackbarStore()

onMounted(() => {
  handleVerifyEmail()
})

async function handleVerifyEmail () {
  try {
    await applyActionCode(nuxtApp.$firebaseAuth, props.actionCode)

    snackbarStore.showSuccessSnackbar('E-mail verificado com sucesso!')

    reloadNuxtApp()
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar('Link inválido! Por favor, solicite um novo e-mail de verificação')

    await navigateTo({ path: '/account/verify-email' })
  }
}
</script>
