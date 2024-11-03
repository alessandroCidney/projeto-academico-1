<template>
  <article-form-page
    :service="articlesService"
    type="articles"
  />
</template>

<script setup lang="ts">
import ArticleFormPage from '~/components/articles/ArticleFormPage.vue'

import { useArticlesService } from '~/composables/services/useArticlesService'

const articlesService = useArticlesService()
</script>
