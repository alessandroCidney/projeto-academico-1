<template>
  <div
    :style="{ width, height }"
    class="uploadDropzone d-flex align-center justify-center"
  >
    <v-icon size="x-large">
      mdi-upload
    </v-icon>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
})
</script>

<style lang="scss" scoped>
.uploadDropzone {
  border: 2px dashed black;
  border-radius: 8px;

  background-color: rgb(var(--v-theme-primary), .2)
}
</style>
