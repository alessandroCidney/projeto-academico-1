<template>
  <div class="articlesPage pa-10">
    <h1 class="mb-10">
      Artigos e Conteúdos
    </h1>

    <v-fab
      class="newItemFab"
      color="primary"
      size="large"
      icon
      @click="$router.push(`/articles/create`)"
    >
      <v-icon
        color="white"
        size="large"
      >
        mdi-plus
      </v-icon>
    </v-fab>

    <div class="cardsList">
      <template
        v-for="item in items"
        :key="item._id"
      >
        <v-card
          height="120px"
          class="mb-5"
          flat
          @click="$router.push(`/articles/${item._id}`)"
        >
          <div class="d-flex align-center justify-start">
            <div>
              <v-img
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useArticlesService } from '@/composables/services/useArticlesService'

const articlesService = useArticlesService()

const items = ref<Awaited<ReturnType<typeof articlesService.list>>>()

onMounted(async () => {
  items.value = await articlesService.list()
})
</script>

<style lang="scss">
.articlesPage {
  padding-bottom: 120px !important;

  .newItemFab {
    position: fixed;
    bottom: 120px;
    right: 70px;
    z-index: 2;
  }
}
</style>
