<template>
  <div class="newsPage pa-10">
    <h1 class="mb-10">
      Artigos e Conteúdos
    </h1>

    <v-fab
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
      <template
        v-for="item in items"
        :key="item._id"
      >
        <v-card
          height="120px"
          class="mb-5"
          flat
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
import { ref } from 'vue'

function generateFakeArray () {
  return [1, 2, 3, 4, 5, 6, 7].map(index => ({
    _id: `artigo-${index}`,
    title: `Artigo ${index}`,
    description: `Esta é a descrição da Artigo ${index}.`,
    imageUrl: 'https://cdn.pixabay.com/photo/2023/10/29/14/37/pumpkins-8350480_1280.jpg',
    tags: ['Tag 01'],
  }))
}

const items = ref(generateFakeArray())
</script>

<style lang="scss">
.newsPage {
  padding-bottom: 120px !important;

  .newItemFab {
    position: fixed;
    bottom: 120px;
    right: 70px;
    z-index: 2;
  }
}
</style>
