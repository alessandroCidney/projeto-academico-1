<template>
  <page />
</template>

<script setup lang="ts">
import Page from '@/app/auth/register/index.vue'

definePageMeta({
  layout: 'clear',
  allowUnauthenticated: true,
  onlyUnauthenticated: true,
})
</script>
