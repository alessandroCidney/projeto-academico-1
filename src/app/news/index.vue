<template>
  <articles-list-page
    :service="newsService"
    title="Últimas notícias"
  />
</template>

<script setup lang="ts">
import { useNewsService } from '~/composables/services/useNewsService'

import ArticlesListPage from '~/components/articles/ArticlesListPage.vue'

const newsService = useNewsService()
</script>
