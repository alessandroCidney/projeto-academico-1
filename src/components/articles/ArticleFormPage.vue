<template>
  <v-form
    v-model="isValid"
    class="pageContainer articleFormPage"
  >
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center justify-start fillWidth">
        <v-btn
          icon="mdi-chevron-left"
          variant="tonal"
          class="mr-5"
          @click="$router.back()"
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
        :custom-file-url="payload.imageUrl ?? undefined"
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
        class="normalLetterSpacing mr-2"
        color="grey-lighten-4"
        variant="flat"
        size="large"
        @click="$router.back()"
      >
        Cancelar
      </v-btn>

      <v-btn
        :disabled="!isValid || !selectedFile"
        :loading="isUpdate ? loadingUpdate : loadingCreate"
        :style="{ width: '50% !important' }"
        class="normalLetterSpacing"
        color="primary"
        variant="flat"
        size="large"
        @click="isUpdate ? handleUpdate() : handleCreate()"
      >
        Salvar
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { v4 as uuidV4 } from 'uuid'

import type { useArticlesService } from '~/composables/services/useArticlesService'
import UploadDropzone from '~/components/commons/UploadDropzone.vue'

import { useAccountStore } from '~/store/account'

import { FirestoreArticle } from '~/types'

const props = defineProps({
  service: { type: Object as PropType<ReturnType<typeof useArticlesService>>, required: true },
  initialPayload: { type: Object as PropType<FirestoreArticle>, default: () => new FirestoreArticle() },
  isUpdate: Boolean,
})

const router = useRouter()

const accountStore = useAccountStore()

const loadingCreate = ref(false)
const loadingUpdate = ref(false)

const payload = ref<FirestoreArticle>(props.initialPayload)
const selectedFile = ref<File>()
const isValid = ref()

async function handleCreate () {
  try {
    if (!accountStore.authUserData?.uid) {
      throw new Error('Unauthenticated')
    }

    loadingCreate.value = true

    const _id = uuidV4()

    await props.service.create(
      _id,
      {
        ...payload.value,
        authorId: accountStore.authUserData?.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _id,
      },
      selectedFile.value as File,
    )

    router.back()
  } catch (err) {
    console.error(err)
  } finally {
    loadingCreate.value = false
  }
}

async function handleUpdate () {
  try {
    if (!accountStore.authUserData?.uid) {
      throw new Error('Unauthenticated')
    }

    loadingUpdate.value = true

    const _id = payload.value._id

    await props.service.update(
      _id,
      {
        ...payload.value,
        authorId: accountStore.authUserData?.uid,
        updatedAt: new Date().toISOString(),
        _id,
      },
      selectedFile.value,
    )

    router.back()
  } catch (err) {
    console.error(err)
  } finally {
    loadingUpdate.value = false
  }
}
</script>

<style lang="scss">
.articleFormPage {
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
