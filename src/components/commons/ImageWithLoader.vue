<template>
  <v-img
    :src="src"
    @load="loading = false"
  >
    <v-skeleton-loader
      v-if="loading"
      width="100%"
      height="100%"
    />
  </v-img>
</template>

<script setup lang="ts">
defineProps({
  src: { type: String, required: true },
})

const loading = ref(true)
</script>
