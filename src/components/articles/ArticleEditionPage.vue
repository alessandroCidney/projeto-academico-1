<template>
  <div
    v-if="loadingGet"
    class="fill-width fill-height d-flex align-center justify-center"
  >
    <v-progress-circular
      size="150"
      width="8"
      color="primary"
      indeterminate
    />
  </div>

  <article-form-page
    v-else
    :initial-payload="initialPayload"
    :service="service"
    is-update
  />
</template>

<script setup lang="ts">
import ArticleFormPage from './ArticleFormPage.vue'

import type { useArticlesService } from '~/composables/services/useArticlesService'

import { FirestoreArticle } from '~/types'

const props = defineProps({
  service: { type: Object as PropType<ReturnType<typeof useArticlesService>>, required: true },
  articleId: { type: String, required: true },
})

const loadingGet = ref(false)
const initialPayload = ref<FirestoreArticle>(new FirestoreArticle())

onMounted(() => {
  handleGet()
})

async function handleGet () {
  try {
    loadingGet.value = true
    initialPayload.value = await props.service.get(props.articleId)
  } catch (err) {
    console.error(err)
  } finally {
    loadingGet.value = false
  }
}
</script>
