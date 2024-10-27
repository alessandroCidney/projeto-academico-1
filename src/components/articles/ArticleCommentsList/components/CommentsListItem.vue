<template>
  <v-list-item
    class="mb-10"
  >
    <template #prepend>
      <v-avatar
        color="grey-darken-4"
      >
        <v-icon>
          mdi-account
        </v-icon>
      </v-avatar>
    </template>

    <v-list-item-subtitle>
      <span v-if="comment.removed">
        Comentário removido
      </span>

      <span v-else-if="accountStore.cachedUsers[comment.authorId]">
        {{ accountStore.cachedUsers[comment.authorId].displayName }}
      </span>

      <span v-else>
        Usuário desconhecido
      </span>
    </v-list-item-subtitle>

    <v-list-item-title
      v-if="!comment.removed"
    >
      {{ comment.content }}
    </v-list-item-title>

    <template
      v-if="!comment.removed"
      #append
    >
      <template v-if="comment.authorId === accountStore.authUserData?.uid">
        <v-btn
          :loading="loadingRemove"
          icon="mdi-delete"
          variant="text"
          @click="handleRemove(comment._id)"
        />
      </template>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/store/account'

import type { FirestoreComment } from '~/types'

const accountStore = useAccountStore()

const props = defineProps({
  comment: { type: Object as PropType<FirestoreComment>, required: true },
  remove: { type: Function as PropType<(commentId: string) => Promise<unknown>>, required: true },
})

const loadingRemove = ref(false)

async function handleRemove (itemId: string) {
  loadingRemove.value = true

  await props.remove(itemId)

  loadingRemove.value = false
}
</script>
