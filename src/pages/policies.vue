<template>
  <page />
</template>

<script setup lang="ts">
import Page from '@/app/policies/index.vue'

definePageMeta({
  layout: 'policies',
  allowUnauthenticated: true,
})
</script>
