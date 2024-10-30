<template>
  <v-dialog
    v-model="modelValue"
    max-width="600"
  >
    <template #activator="{ props: activatorProps }">
      <slot
        :props="activatorProps"
        name="activator"
      />
    </template>

    <v-card
      :title="title"
    >
      <v-card-text>
        <slot />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          :disabled="loadingSubmit"
          class="normalLetterSpacing px-4"
          text="Cancelar"
          @click="modelValue = false"
        />

        <slot
          :loading="loadingSubmit"
          :action="handleSubmit"
          name="submitButton"
        >
          <v-btn
            :loading="loadingSubmit"
            class="normalLetterSpacing px-8"
            variant="flat"
            color="primary"
            text="Continuar"
            @click="handleSubmit"
          />
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '~/store/snackbar'

const props = defineProps({
  title: { type: String, required: true },
  submit: { type: Function, required: true },
})

const snackbarStore = useSnackbarStore()

const modelValue = ref(false)
const loadingSubmit = ref(false)

async function handleSubmit () {
  try {
    loadingSubmit.value = true

    await props.submit()

    modelValue.value = false
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingSubmit.value = false
  }
}
</script>
