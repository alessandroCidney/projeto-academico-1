<template>
  <v-text-field
    ref="textFieldRef"
    :key="`updateKey${updateKey}`"
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
const props = defineProps({
  dependsOn: { type: String },
})

const textFieldRef = useTemplateRef('textFieldRef')

const modelValue = defineModel<string>()

const showPassword = ref(false)

const updateKey = ref(0)

watch(() => props.dependsOn, async (newValue) => {
  if (typeof newValue === 'string' && modelValue.value) {
    updateKey.value++
    await nextTick()
    await textFieldRef.value?.validate()
  }
})
</script>
