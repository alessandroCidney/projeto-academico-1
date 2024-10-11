<template>
  <div v-if="loadingItems">
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </div>

  <div
    v-else-if="articleData"
    class="articlePage py-10 px-5"
  >
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center justify-start">
        <v-btn
          icon="mdi-chevron-left"
          variant="tonal"
          class="mr-5"
          @click="$router.push('/articles')"
        />

        <h1 class="text-h5 font-weight-bold">
          {{ articleData.title }}
        </h1>
      </div>

      <div>
        <v-btn
          icon="mdi-pencil"
          variant="text"
        />

        <v-btn
          icon="mdi-delete"
          variant="text"
        />
      </div>
    </div>

    <div class="mb-5 px-2">
      {{ articleData.description }}
    </div>

    <div class="mb-5">
      <v-img
        :src="articleData.imageUrl"
        class="rounded-lg"
        height="150px"
        width="100%"
        cover
      />
    </div>

    <div class="mb-5 px-2">
      {{ articleData.content }}
    </div>

    <div class="mb-5 px-2">
      <v-chip
        v-for="(articleTag, articleTagIndex) in articleData.tags"
        :key="`articleTag${articleTagIndex}`"
        class="mr-2"
      >
        {{ articleTag }}
      </v-chip>
    </div>

    <div class="d-flex align-center justify-center">
      <v-btn
        variant="text"
        size="large"
        icon
      >
        <v-icon size="large">
          mdi-heart-outline
        </v-icon>
      </v-btn>

      <v-btn
        variant="text"
        size="large"
        icon
      >
        <v-icon size="large">
          mdi-message-outline
        </v-icon>
      </v-btn>

      <v-btn
        variant="text"
        size="large"
        icon
      >
        <v-icon size="large">
          mdi-share-variant
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useArticlesService } from '@/composables/services/useArticlesService'

import { useRoute } from '#imports'

const route = useRoute()

const articlesService = useArticlesService()

const loadingItems = ref(false)

const articleData = ref<Awaited<ReturnType<typeof articlesService.get>>>()

onMounted(async () => {
  if (typeof route.params.articleId !== 'string') {
    throw new Error('Cannot found article ID')
  }

  try {
    loadingItems.value = true
    articleData.value = await articlesService.get(route.params.articleId)
  } catch (err) {
    console.error(err)
  } finally {
    loadingItems.value = false
  }
})
</script>

<style lang="scss">
.articlesPage {
  padding-bottom: 120px !important;
}
</style>
