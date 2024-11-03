<template>
  <article-edition-page
    v-if="typeof route.params.articleId === 'string'"
    :article-id="route.params.articleId"
    :service="articlesService"
    type="articles"
  />
</template>

<script setup lang="ts">
import ArticleEditionPage from '~/components/articles/ArticleEditionPage.vue'

import { useArticlesService } from '~/composables/services/useArticlesService'

const route = useRoute()

const articlesService = useArticlesService()
</script>
