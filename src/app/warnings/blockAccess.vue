<template>
  <div class="d-flex align-center justify-center h-screen w-100">
    <warning-screen
      title="Acesso bloqueado"
      description="Seu acesso foi bloqueado por um dos administradores da plataforma."
      image="/images/illustrations/lock.svg"
    >
      <template #append>
        <v-btn
          class="normalLetterSpacing px-10"
          prepend-icon="mdi-arrow-left"
          color="grey-lighten-4"
          variant="flat"
          @click="handleSignOut"
        >
          Sair
        </v-btn>
      </template>
    </warning-screen>
  </div>
</template>

<script setup lang="ts">
import WarningScreen from '~/components/commons/WarningScreen.vue'

import { useLogin } from '~/composables/commons/useLogin'

const { handleSignOut } = useLogin()
</script>
