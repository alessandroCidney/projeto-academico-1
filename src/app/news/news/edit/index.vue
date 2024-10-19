<template>
  <div
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
        :custom-file-url="payload.imageUrl"
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
        :loading="loadingUpdate"
        :style="{ width: '50% !important' }"
        class="normalLetterSpacing text-white"
        color="primary"
        variant="flat"
        size="large"
        @click="handleUpdate"
      >
        Salvar
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadDropzone from '~/components/commons/UploadDropzone.vue'

import { useAccountStore } from '~/store/account'

import { useNewsService, FirestoreNews } from '~/composables/services/useNewsService'

const accountStore = useAccountStore()

const route = useRoute()

const newsService = useNewsService()

const loadingGet = ref(false)
const loadingUpdate = ref(false)

const selectedFile = ref<File>()

const payload = ref<Parameters<typeof newsService.create>[1]>(new FirestoreNews())

onMounted(async () => {
  handleGet()
})

async function handleGet () {
  if (typeof route.params.newsId !== 'string') {
    throw new Error('Cannot found news ID')
  }

  try {
    loadingGet.value = true
    payload.value = await newsService.get(route.params.newsId)
  } catch (err) {
    console.error(err)
  } finally {
    loadingGet.value = false
  }
}

async function handleUpdate () {
  try {
    if (!accountStore.authUserData?.uid) {
      throw new Error('Unauthenticated')
    }

    loadingUpdate.value = true

    const _id = payload.value._id

    await newsService.update(
      _id,
      {
        ...payload.value,
        authorId: accountStore.authUserData?.uid,
        updatedAt: new Date().toISOString(),
        _id,
      },
      selectedFile.value,
    )

    await navigateTo({ path: '/news' })
  } catch (err) {
    console.error(err)
  } finally {
    loadingUpdate.value = false
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
