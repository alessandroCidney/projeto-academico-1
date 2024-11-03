<template>
  <article-form-page
    :service="newsService"
    type="news"
  />
</template>

<script setup lang="ts">
import ArticleFormPage from '~/components/articles/ArticleFormPage.vue'

import { useNewsService } from '~/composables/services/useNewsService'

const newsService = useNewsService()
</script>
