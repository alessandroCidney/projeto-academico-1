<template>
  <v-text-field
    v-model="modelValue"
    :type="showPassword ? 'text' : 'password'"
  >
    <template #append-inner>
      <v-tooltip
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="text"
            v-bind="tooltipProps"
            @click="showPassword = !showPassword"
          />
        </template>

        {{ showPassword ? 'Esconder senha' : 'Mostrar senha' }}
      </v-tooltip>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
const modelValue = defineModel<string>()

const showPassword = ref(false)
</script>
