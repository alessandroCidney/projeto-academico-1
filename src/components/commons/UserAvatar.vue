<template>
  <v-avatar
    :color="src ? undefined : 'grey'"
    :size="size"
  >
    <image-with-loader
      v-if="src"
      :src="src"
    />

    <v-icon
      v-else
      :size="size - 10"
    >
      mdi-account-circle
    </v-icon>

    <slot />
  </v-avatar>
</template>

<script setup lang="ts">
import ImageWithLoader from './ImageWithLoader.vue'

defineProps({
  src: { type: String },
  size: { type: Number, default: 80 },
})
</script>
