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
    v-else-if="articleData"
    class="pageContainer"
  >
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center justify-start">
        <v-btn
          icon="mdi-chevron-left"
          variant="tonal"
          class="mr-5"
          @click="$router.back()"
        />

        <h1 class="text-h5 font-weight-bold  font-weight-bold">
          {{ articleData.title }}
        </h1>
      </div>

      <div
        v-if="articleData.authorId === accountStore.authUserData?.uid"
      >
        <v-btn
          :to="`${$route.path}/edit`"
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
      {{ articleData.description }}
    </div>

    <div class="mb-5">
      <image-with-loader
        :src="articleData.imageUrl"
        class="rounded-lg"
        height="200px"
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
      :list="service.commentsService(articleId).list"
      :create="service.commentsService(articleId).create"
      :update="service.commentsService(articleId).update"
    />
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidV4 } from 'uuid'

import CommentsList from './ArticleCommentsList/index.vue'

import type { useArticlesService } from '~/composables/services/useArticlesService'
import { useUsersService, type FirestoreUserNotificationTarget } from '~/composables/services/useUsersService'

import ImageWithLoader from '~/components/commons/ImageWithLoader.vue'

import { useAccountStore } from '~/store/account'

const router = useRouter()

const props = defineProps({
  service: { type: Object as PropType<ReturnType<typeof useArticlesService>>, required: true },
  articleId: { type: String, required: true },
  type: { type: String as PropType<FirestoreUserNotificationTarget>, required: true },
})

const accountStore = useAccountStore()

const usersService = useUsersService()

const loadingGet = ref(false)
const loadingRemove = ref(false)
const loadingToggleLike = ref(false)
const alreadyLiked = ref(false)
const showComments = ref(false)

const articleData = ref<Awaited<ReturnType<typeof props.service.get>>>()

onMounted(async () => {
  handleGet()
  handleGetLikeData()
})

async function handleGet () {
  try {
    loadingGet.value = true
    articleData.value = await props.service.get(props.articleId)
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
    alreadyLiked.value = !!(await props.service.likesService(props.articleId).get(accountStore.authUserData.uid))
  } catch (err) {
    console.error(err)
  } finally {
    loadingToggleLike.value = false
  }
}

async function handleRemove () {
  try {
    loadingRemove.value = true
    await props.service.remove(props.articleId)

    router.back()
  } catch (err) {
    console.error(err)
  } finally {
    loadingRemove.value = false
  }
}

async function toggleLike () {
  try {
    loadingToggleLike.value = true

    if (!accountStore.authUserData) {
      throw new Error('Unauthenticated')
    }

    if (!articleData.value) {
      throw new Error('Not loaded')
    }

    if (alreadyLiked.value) {
      await props.service.likesService(props.articleId).remove(accountStore.authUserData.uid)
    } else {
      await props.service.likesService(props.articleId).create(accountStore.authUserData.uid, {
        authorId: accountStore.authUserData.uid,
        createdAt: new Date().toISOString(),
      })

      const newNotificationId = uuidV4()

      await usersService.useNotificationsService(articleData.value.authorId).create(newNotificationId, {
        _id: newNotificationId,
        action: 'like',
        authorId: accountStore.authUserData.uid,
        createdAt: new Date().toISOString(),
        target: props.type,
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
    if (!articleData.value) {
      throw new Error('Empty data')
    }

    const shareData = {
      title: articleData.value.title,
      text: articleData.value.description,
      url: window.location.href,
    }

    await navigator.share(shareData)
  } catch (err) {
    console.error(err)
  }
}
</script>
