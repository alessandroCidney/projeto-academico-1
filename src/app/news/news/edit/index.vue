<template>
  <article-edition-page
    v-if="typeof route.params.newsId === 'string'"
    :article-id="route.params.newsId"
    :service="newsService"
    type="news"
  />
</template>

<script setup lang="ts">
import ArticleEditionPage from '~/components/articles/ArticleEditionPage.vue'

import { useNewsService } from '~/composables/services/useNewsService'

const route = useRoute()

const newsService = useNewsService()
</script>
