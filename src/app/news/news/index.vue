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

  <div
    v-else-if="newsData"
    class="pageContainer"
  >
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center justify-start">
        <v-btn
          to="/news"
          icon="mdi-chevron-left"
          variant="tonal"
          class="mr-5"
        />

        <h1 class="text-h5 font-weight-bold  font-weight-bold">
          {{ newsData.title }}
        </h1>
      </div>

      <div
        v-if="newsData.authorId === accountStore.authUserData?.uid"
      >
        <v-btn
          :to="`/news/${newsData._id}/edit`"
          icon="mdi-pencil"
          variant="text"
        />

        <v-btn
          :loading="loadingRemove"
          icon="mdi-delete"
          variant="text"
          @click="handleRemove"
        />
      </div>
    </div>

    <div class="mb-5 px-2">
      {{ newsData.description }}
    </div>

    <div class="mb-5">
      <v-img
        :src="newsData.imageUrl"
        class="rounded-lg"
        height="200px"
        width="100%"
        cover
      />
    </div>

    <div class="mb-5 px-2">
      {{ newsData.content }}
    </div>

    <div class="mb-5 px-2">
      <v-chip
        v-for="(articleTag, articleTagIndex) in newsData.tags"
        :key="`articleTag${articleTagIndex}`"
        class="mr-2"
      >
        {{ articleTag }}
      </v-chip>
    </div>

    <div class="d-flex align-center justify-center">
      <v-btn
        :loading="loadingToggleLike"
        variant="text"
        size="large"
        icon
        @click="toggleLike"
      >
        <v-icon size="large">
          {{ alreadyLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>

      <v-btn
        variant="text"
        size="large"
        icon
        @click="showComments = !showComments"
      >
        <v-icon size="large">
          {{ showComments ? 'mdi-message' : 'mdi-message-outline' }}
        </v-icon>
      </v-btn>

      <v-btn
        variant="text"
        size="large"
        icon
        @click="handleShare"
      >
        <v-icon size="large">
          mdi-share-variant
        </v-icon>
      </v-btn>
    </div>

    <comments-list
      v-if="showComments"
      :list="newsCommentService.list"
      :create="newsCommentService.create"
      :update="newsCommentService.update"
    />
  </div>
</template>

<script setup lang="ts">
import { useNewsService, useNewsLikeService, useNewsCommentService } from '@/composables/services/useNewsService'

import CommentsList from './components/CommentsList/index.vue'

import { useAccountStore } from '~/store/account'

const route = useRoute()

if (typeof route.params.newsId !== 'string') {
  throw new Error('Cannot found news ID')
}

const accountStore = useAccountStore()

const newsService = useNewsService()
const newsLikeService = useNewsLikeService(route.params.newsId)
const newsCommentService = useNewsCommentService(route.params.newsId)

const loadingGet = ref(false)
const loadingRemove = ref(false)
const loadingToggleLike = ref(false)
const alreadyLiked = ref(false)
const showComments = ref(false)

const newsData = ref<Awaited<ReturnType<typeof newsService.get>>>()

onMounted(async () => {
  handleGet()
  handleGetLikeData()
})

async function handleGet () {
  if (typeof route.params.newsId !== 'string') {
    throw new Error('Cannot found news ID')
  }

  try {
    loadingGet.value = true
    newsData.value = await newsService.get(route.params.newsId)
  } catch (err) {
    console.error(err)
  } finally {
    loadingGet.value = false
  }
}

async function handleGetLikeData () {
  if (!accountStore.authUserData?.uid) {
    throw new Error('Unauthenticated')
  }

  try {
    loadingToggleLike.value = true
    alreadyLiked.value = !!(await newsLikeService.get(accountStore.authUserData.uid))
  } catch (err) {
    console.error(err)
  } finally {
    loadingToggleLike.value = false
  }
}

async function handleRemove () {
  if (typeof route.params.newsId !== 'string') {
    throw new Error('Cannot found news ID')
  }

  try {
    loadingRemove.value = true
    await newsService.remove(route.params.newsId)

    await navigateTo({ path: '/news' })
  } catch (err) {
    console.error(err)
  } finally {
    loadingRemove.value = false
  }
}

async function toggleLike () {
  try {
    loadingToggleLike.value = true

    if (!accountStore.authUserData?.uid) {
      throw new Error('Unauthenticated')
    }

    if (alreadyLiked.value) {
      await newsLikeService.remove(accountStore.authUserData.uid)
    } else {
      await newsLikeService.create(accountStore.authUserData.uid, {
        authorId: accountStore.authUserData.uid,
        createdAt: new Date().toISOString(),
      })
    }

    alreadyLiked.value = !alreadyLiked.value
  } catch (err) {
    console.error(err)
  } finally {
    loadingToggleLike.value = false
  }
}

async function handleShare () {
  try {
    if (!newsData.value) {
      throw new Error('Empty data')
    }

    const shareData = {
      title: newsData.value.title,
      text: newsData.value.description,
      url: window.location.href,
    }

    await navigator.share(shareData)
  } catch (err) {
    console.error(err)
  }
}
</script>
