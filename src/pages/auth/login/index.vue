<template>
  <page />
</template>

<script setup lang="ts">
import Page from '@/app/auth/login/index.vue'

definePageMeta({
  layout: 'clear',
  isALoginRoute: true,
})
</script>
