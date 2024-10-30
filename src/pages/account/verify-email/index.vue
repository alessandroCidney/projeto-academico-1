<template>
  <page />
</template>

<script setup lang="ts">
import Page from '@/app/account/verifyEmail/index.vue'

definePageMeta({
  layout: 'clear',
  isALoginRoute: true,
  noRedirect: true,
})
</script>
