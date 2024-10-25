<template>
  <v-snackbar
    :color="snackbarDetails[snackbarStore.type].color"
    :model-value="snackbarStore.isActive"
    @update:model-value="snackbarStore.setSnackbarStatus($event)"
  >
    <div class="d-flex align-center justify-start text-white normalLetterSpacing">
      <v-icon class="mr-2">
        {{ snackbarDetails[snackbarStore.type].icon }}
      </v-icon>

      {{ snackbarStore.message }}
    </div>

    <template #actions>
      <v-btn
        color="white"
        variant="text"
        icon="mdi-close"
        @click="snackbarStore.setSnackbarStatus(false)"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore, SnackbarType } from '~/store/snackbar'

const snackbarStore = useSnackbarStore()

const snackbarDetails = {
  [SnackbarType.Success]: {
    color: 'success',
    icon: 'mdi-check-circle',
  },
  [SnackbarType.Error]: {
    color: 'error',
    icon: 'mdi-alert-circle',
  },
}
</script>
