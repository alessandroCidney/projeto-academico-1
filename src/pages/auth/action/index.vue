<template>
  <page />
</template>

<script setup lang="ts">
import Page from '@/app/auth/action/index.vue'

definePageMeta({
  layout: 'clear',
  allowUnauthenticated: true,
  noRedirects: true,
})
</script>
