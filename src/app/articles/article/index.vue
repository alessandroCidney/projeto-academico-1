<template>
  <article-content-page
    v-if="typeof route.params.articleId === 'string'"
    :article-id="route.params.articleId"
    :service="articlesService"
    :type="FirestoreUserNotificationTarget.article"
  />
</template>

<script setup lang="ts">
import ArticleContentPage from '~/components/articles/ArticleContentPage.vue'

import { useArticlesService } from '~/composables/services/useArticlesService'

import { FirestoreUserNotificationTarget } from '~/composables/services/useUsersService'

const route = useRoute()

const articlesService = useArticlesService()
</script>
