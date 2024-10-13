<template>
  <div class="pageContainer">
    <h1 class="text-h5 font-weight-bold">
      Últimas notícias
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
      <v-card
        v-for="item in items"
        :key="item._id"
        height="330px"
        class="mb-7"
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
import { ref } from 'vue'

function generateFakeArray () {
  return [1, 2, 3, 4, 5, 6, 7].map(index => ({
    _id: `noticia-${index}`,
    title: `Notícia ${index}`,
    description: `Esta é a descrição da Notícia ${index}.`,
    imageUrl: 'https://cdn.pixabay.com/photo/2023/10/29/14/37/pumpkins-8350480_1280.jpg',
    tags: ['Tag 01', 'Tag 02'],
  }))
}

const items = ref(generateFakeArray())
</script>
