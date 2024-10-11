<template>
  <div class="newsPage pa-10">
    <h1 class="text-h5 font-weight-bold mb-10">
      Notificações
    </h1>

    <v-list class="itemsList">
      <template
        v-for="item in items"
        :key="item._id"
      >
        <v-list-item
          class="mb-5"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                :src="item.imageUrl"
              />
            </v-avatar>
          </template>

          <v-list-item-title>
            <template v-if="item.likes.length === 1">
              <span class="font-weight-bold">{{ item.likes[0] }}</span> curtiu seu artigo
            </template>

            <template v-else>
              <span class="font-weight-bold">{{ item.likes[0] }}</span> e mais {{ item.likes.length - 1 }} curtiram seu artigo
            </template>
          </v-list-item-title>
        </v-list-item>

        <v-divider
          class="mb-5"
        />
      </template>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

function generateFakeArray () {
  return [1, 2, 3, 4, 5, 6, 7].map(index => ({
    _id: `notificacao-${index}`,
    likes: ['user1', 'user2', 'user3'],
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
