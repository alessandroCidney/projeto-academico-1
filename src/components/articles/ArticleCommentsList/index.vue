<template>
  <div
    v-if="loadingList"
    class="d-flex align-center justify-center py-10"
  >
    <v-progress-circular
      size="80"
      width="8"
      color="primary"
      indeterminate
    />
  </div>

  <div
    v-else
    class="py-10"
  >
    <div
      v-if="commentsList.length === 0"
      class="text-center mb-5"
    >
      Nenhum comentário criado
    </div>

    <div
      v-if="openCommentForm"
    >
      <v-textarea
        v-model="newCommentContent"
        placeholder="Digite o conteúdo do comentário aqui"
      />

      <div
        :style="{ gap: '15px' }"
        class="d-flex align-center justify-end"
      >
        <v-btn
          class="normalLetterSpacing"
          variant="flat"
          @click="handleResetCreation"
        >
          Cancelar
        </v-btn>

        <v-btn
          :disabled="!newCommentContent"
          :loading="loadingCreate"
          color="primary"
          class="normalLetterSpacing px-8"
          variant="flat"
          @click="handleCreate"
        >
          Salvar
        </v-btn>
      </div>
    </div>

    <div
      v-else
      class="text-center"
    >
      <v-btn
        color="grey-darken-4"
        prepend-icon="mdi-plus"
        class="normalLetterSpacing"
        variant="flat"
        block
        @click="openCommentForm = true"
      >
        Novo comentário
      </v-btn>
    </div>

    <v-list
      v-if="commentsList.length > 0"
      class="py-10"
    >
      <comments-list-item
        v-for="comment in commentsList"
        :key="`comment${comment._id}`"
        :comment="comment"
        :remove="handleRemove"
      />
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidV4 } from 'uuid'

import CommentsListItem from './components/CommentsListItem.vue'

import type { FirestoreComment } from '~/types'

import { useAccountStore } from '~/store/account'
import { useUsersService } from '~/composables/services/useUsersService'

const accountStore = useAccountStore()

const props = defineProps({
  list: { type: Function as PropType<() => Promise<FirestoreComment[]>>, required: true },
  create: { type: Function as PropType<(itemId: string, payload: FirestoreComment) => Promise<unknown>>, required: true },
  update: { type: Function as PropType<(itemId: string, payload: FirestoreComment) => Promise<unknown>>, required: true },
})

const usersService = useUsersService()

const commentsList = ref<FirestoreComment[]>([])
const loadingList = ref(false)
const loadingCreate = ref(false)
const openCommentForm = ref(false)
const newCommentContent = ref('')

onMounted(() => {
  handleList()
})

async function handleList () {
  try {
    loadingList.value = true

    commentsList.value = await props.list()

    for (const commentData of commentsList.value) {
      if (!commentData.removed) {
        await usersService.getUserAndSaveToStoreCache(commentData.authorId)
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingList.value = false
  }
}

async function handleCreate () {
  try {
    if (!accountStore.authUserData?.uid) {
      throw new Error('Unauthenticated')
    }

    loadingCreate.value = true

    const newCommentId = uuidV4()

    const newCommentData = {
      _id: newCommentId,
      authorId: accountStore.authUserData.uid,
      content: newCommentContent.value,
      createdAt: new Date().toISOString(),
      removed: false,
    }

    await props.create(newCommentId, newCommentData)

    handleResetCreation()

    commentsList.value.push(newCommentData)
  } catch (err) {
    console.error(err)
  } finally {
    loadingCreate.value = false
  }
}

async function handleRemove (commentId: string) {
  try {
    const commentData = await commentsList.value.find(comment => comment._id === commentId)

    if (!commentData) {
      throw new Error('Comment not found')
    }

    await props.update(commentData._id, {
      ...commentData,
      removed: true,
    })

    commentData.removed = true
  } catch (err) {
    console.error(err)
  }
}

function handleResetCreation () {
  newCommentContent.value = ''
  openCommentForm.value = false
}
</script>
