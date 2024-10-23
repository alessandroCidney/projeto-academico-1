<template>
  <articles-list-page
    :service="articlesService"
    title="Artigos e Conteúdos"
  >
    <template #item="{ item }">
      <v-card
        height="120px"
        class="mb-5"
        flat
        @click="$router.push(`/articles/${item._id}`)"
      >
        <div class="d-flex align-center justify-start">
          <div>
            <image-with-loader
              :src="item.imageUrl"
              height="110px"
              width="110px"
              class="rounded-lg"
              cover
            />
          </div>

          <div class="py-4">
            <v-card-subtitle>
              <v-chip
                v-for="(itemTag, itemTagIndex) in item.tags"
                :key="`itemTag${itemTagIndex}`"
                class="mr-2"
              >
                {{ itemTag }}
              </v-chip>
            </v-card-subtitle>

            <v-card-title>
              {{ item.title }}
            </v-card-title>

            <v-card-text class="pb-0">
              {{ item.description }}
            </v-card-text>
          </div>

          <v-spacer />

          <div>
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              size="large"
            />
          </div>
        </div>
      </v-card>

      <v-divider
        class="mb-5"
      />
    </template>
  </articles-list-page>
</template>

<script setup lang="ts">
import ArticlesListPage from '~/components/articles/ArticlesListPage.vue'

import { useArticlesService } from '~/composables/services/useArticlesService'

import ImageWithLoader from '~/components/commons/ImageWithLoader.vue'

const articlesService = useArticlesService()
</script>
