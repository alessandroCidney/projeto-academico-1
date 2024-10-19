<template>
  <div class="pageContainer">
    <h1 class="text-h5 font-weight-bold">
      Últimas notícias
    </h1>

    <v-fab
      to="/news/create"
      class="newItemFab"
      color="primary"
      size="large"
      icon
    >
      <v-icon
        color="white"
        size="large"
      >
        mdi-plus
      </v-icon>
    </v-fab>

    <div class="cardsList">
      <v-card
        v-for="item in items"
        :key="item._id"
        height="330px"
        class="mb-7"
        @click="navigateTo({ path: `/news/${item._id}` })"
      >
        <v-img
          :src="item.imageUrl"
          height="200px"
          width="100%"
          cover
        />

        <div class="py-4">
          <v-card-subtitle>
            {{ item.tags.join(', ') }}
          </v-card-subtitle>

          <v-card-title>
            {{ item.title }}
          </v-card-title>

          <v-card-text class="pb-0">
            {{ item.description }}
          </v-card-text>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewsService } from '~/composables/services/useNewsService'

const newsService = useNewsService()

const loadingNews = ref(false)

const items = ref<Awaited<ReturnType<typeof newsService.list>>>()

onMounted(() => {
  handleList()
})

async function handleList () {
  try {
    loadingNews.value = true

    items.value = await newsService.list()
  } catch (err) {
    console.error(err)
  } finally {
    loadingNews.value = false
  }
}
</script>
