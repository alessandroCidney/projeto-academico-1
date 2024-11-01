<template>
  <v-container class="py-16">
    <div class="d-flex align-center justify-start mb-10 ga-6">
      <v-btn
        to="/"
        icon="mdi-arrow-left"
        variant="tonal"
      />

      <h1 class="text-h3 font-weight-bold">
        Políticas e Termos
      </h1>
    </div>

    <v-tabs
      v-model="activeTab"
      class="mb-5"
    >
      <v-tab
        class="normalLetterSpacing"
        value="privacyPolicy"
      >
        Política de privacidade
      </v-tab>

      <v-tab
        class="normalLetterSpacing"
        value="useTerms"
      >
        Termos de Uso
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <v-tabs-window-item value="privacyPolicy">
        <privacy-policy />
      </v-tabs-window-item>

      <v-tabs-window-item value="useTerms">
        <use-terms />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script setup lang="ts">
import PrivacyPolicy from './components/PrivacyPolicy.vue'
import UseTerms from './components/UseTerms.vue'

const activeTab = ref('privacyPolicy')
</script>
