<template>
  <div class="text-center">
    <slot name="image">
      <v-img
        :src="image"
        :aspect-ratio="3 / 2"
        width="300px"
        class="mx-auto"
      />
    </slot>

    <div class="text-h4 font-weight-bold mb-3">
      {{ title }}
    </div>

    <div class="mb-5">
      {{ description }}
    </div>

    <slot name="append" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '/images/illustrations/news.svg' },
})
</script>
