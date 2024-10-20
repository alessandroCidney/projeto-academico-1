<template>
  <article-content-page
    v-if="typeof route.params.newsId === 'string'"
    :article-id="route.params.newsId"
    :service="newsService"
  />
</template>

<script setup lang="ts">
import { useNewsService } from '@/composables/services/useNewsService'

import ArticleContentPage from '~/components/articles/ArticleContentPage.vue'

const route = useRoute()

const newsService = useNewsService()
</script>
