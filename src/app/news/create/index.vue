<template>
  <v-form
    v-model="isValid"
    class="pageContainer newsCreationPage"
  >
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center justify-start fillWidth">
        <v-btn
          to="/news"
          icon="mdi-chevron-left"
          variant="tonal"
          class="mr-5"
        />

        <v-text-field
          v-model="payload.title"
          class="titleTextField font-weight-bold mb-1"
          placeholder="Informe um título"
          variant="solo"
          hide-details
          flat
        />
      </div>
    </div>

    <div class="mb-5 px-2">
      <v-text-field
        v-model="payload.description"
        placeholder="Informe uma descrição"
        class="fieldWithoutPadding"
        variant="solo"
        hide-details
        flat
      />
    </div>

    <div class="mb-5">
      <upload-dropzone
        v-model="selectedFile"
        height="200px"
      />
    </div>

    <div class="mb-5 px-2">
      <v-textarea
        v-model="payload.content"
        placeholder="Informe o conteúdo"
        class="fieldWithoutPadding"
        variant="solo"
        hide-details
        flat
      />
    </div>

    <div class="mb-5 px-2">
      <v-select
        v-model="payload.tags"
        :items="['Teste']"
        label="Selecionar Tags"
        variant="outlined"
        multiple
      />
    </div>

    <div class="d-flex align-center justify-center">
      <v-btn
        :style="{ width: 'calc(50% - 8px) !important' }"
        to="/news"
        class="normalLetterSpacing mr-2"
        color="grey-lighten-4"
        variant="flat"
        size="large"
      >
        Cancelar
      </v-btn>

      <v-btn
        :disabled="!isValid || !selectedFile"
        :loading="loadingCreate"
        :style="{ width: '50% !important' }"
        class="normalLetterSpacing"
        color="primary"
        variant="flat"
        size="large"
        @click="handleCreate"
      >
        Salvar
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { v4 as uuidV4 } from 'uuid'

import UploadDropzone from '~/components/commons/UploadDropzone.vue'

import { useAccountStore } from '~/store/account'

import { useNewsService, FirestoreNews } from '~/composables/services/useNewsService'

const accountStore = useAccountStore()

const newsService = useNewsService()

const loadingCreate = ref(false)

const payload = ref<Parameters<typeof newsService.create>[1]>(new FirestoreNews())
const selectedFile = ref<File>()
const isValid = ref()

async function handleCreate () {
  try {
    if (!accountStore.authUserData?.uid) {
      throw new Error('Unauthenticated')
    }

    loadingCreate.value = true

    const _id = uuidV4()

    await newsService.create(_id, {
      ...payload.value,
      authorId: accountStore.authUserData?.uid,
      _id,
    })

    await navigateTo({ path: '/news' })
  } catch (err) {
    console.error(err)
  } finally {
    loadingCreate.value = false
  }
}
</script>

<style lang="scss">
.newsCreationPage {
  .titleTextField {
    width: calc(100% - 48px - 20px);

    input {
      padding: 0;
      font-size: 24px;
    }
  }

  .fieldWithoutPadding {
    input {
      padding: 0;
    }

    textarea {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
