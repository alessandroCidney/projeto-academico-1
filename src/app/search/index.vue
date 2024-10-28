<template>
  <div
    class="pageContainer"
  >
    <v-form
      v-model="validModel"
      @submit.prevent
    >
      <v-text-field
        ref="searchFieldRef"
        v-model="searchStr"
        class="font-weight-bold"
        placeholder="O que deseja buscar?"
        variant="solo"
        hide-details
        flat
      >
        <template #append-inner>
          <v-btn
            :disabled="!validModel"
            :loading="loadingSearch"
            variant="text"
            icon="mdi-magnify"
            class="normalLetterSpacing"
            @click="handleSearch"
          />
        </template>
      </v-text-field>
    </v-form>

    <v-divider class="mb-8" />

    <template v-if="lastUsedSearchStr">
      <template v-if="newsList.length > 0">
        <div class="font-weight-bold text-h5">
          Notícias
        </div>

        <v-list
          class="mb-10"
        >
          <template
            v-for="(newsData, newsDataIndex) in newsList"
            :key="`newsData${newsDataIndex}`"
          >
            <v-list-item class="py-5">
              <template #title>
                {{ newsData.title }}
              </template>

              <template #subtitle>
                {{ newsData.description }}
              </template>

              <template #append>
                <v-btn
                  :to="`/news/${newsData._id}`"
                  variant="text"
                  class="normalLetterSpacing"
                >
                  Acessar
                </v-btn>
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </template>

      <template v-if="articlesList.length > 0">
        <div class="font-weight-bold text-h5">
          Artigos
        </div>

        <v-list>
          <template
            v-for="(articleData, articleDataIndex) in articlesList"
            :key="`articleData${articleDataIndex}`"
          >
            <v-list-item class="py-5">
              <template #title>
                {{ articleData.title }}
              </template>

              <template #subtitle>
                {{ articleData.description }}
              </template>

              <template #append>
                <v-btn
                  :to="`/articles/${articleData._id}`"
                  variant="text"
                  class="normalLetterSpacing"
                >
                  Acessar
                </v-btn>
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useNewsService } from '~/composables/services/useNewsService'
import { useArticlesService } from '~/composables/services/useArticlesService'
import type { FirestoreArticle } from '~/types'

import { useSnackbarStore } from '~/store/snackbar'

const snackbarStore = useSnackbarStore()

const newsService = useNewsService()
const articlesService = useArticlesService()

const validModel = ref()
const newsList = ref<FirestoreArticle[]>([])
const articlesList = ref<FirestoreArticle[]>([])

const searchFieldRef = useTemplateRef('searchFieldRef')

const searchStr = ref('')
const lastUsedSearchStr = ref('')
const loadingSearch = ref(false)

onMounted(() => {
  searchFieldRef.value?.focus()
})

async function handleSearch () {
  try {
    loadingSearch.value = true
    lastUsedSearchStr.value = searchStr.value

    newsList.value = await newsService.search('title', searchStr.value)
    articlesList.value = await articlesService.search('title', searchStr.value)
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingSearch.value = false
  }
}
</script>
