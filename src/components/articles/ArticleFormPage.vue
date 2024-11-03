<template>
  <v-form
    v-model="validModel"
    class="pageContainer articleFormPage"
  >
    <div class="d-flex align-center justify-space-between mb-8">
      <div class="d-flex align-start justify-start w-100">
        <v-btn
          icon="mdi-chevron-left"
          variant="tonal"
          class="mr-5"
          @click="$router.back()"
        />

        <div class="position-relative flex-fill">
          <v-text-field
            v-model="payload.title"
            :rules="[rules.required, rules.maxLength(200)]"
            class="titleTextField font-weight-bold position-absolute top-0"
            placeholder="Informe um título"
            variant="solo"
            flat
          />
        </div>
      </div>
    </div>

    <div class="mb-3">
      <v-textarea
        v-model="payload.description"
        :rules="[rules.required, rules.maxLength(500)]"
        placeholder="Informe uma descrição"
        class="fieldWithoutPadding"
        variant="solo"
        rows="1"
        auto-grow
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

    <div class="mb-5">
      <v-textarea
        v-model="payload.content"
        :rules="[rules.required, rules.maxLength(40000)]"
        placeholder="Informe o conteúdo"
        class="fieldWithoutPadding"
        variant="solo"
        rows="1"
        auto-grow
        flat
      />
    </div>

    <div class="mb-5">
      <v-select
        v-model="payload.tags"
        :rules="[rules.required]"
        :items="['Atividades', 'Cotidiano', 'Tutorial', 'Dúvidas frequentes', 'Dicas', 'Notícias', 'Urgente', 'Regras', 'Outro']"
        label="Selecionar Tags"
        variant="outlined"
        multiple
      />
    </div>

    <div class="d-flex align-center justify-center ga-2">
      <v-btn
        class="normalLetterSpacing flex-fill"
        color="grey-lighten-4"
        variant="flat"
        size="large"
        @click="$router.back()"
      >
        Cancelar
      </v-btn>

      <v-btn
        :disabled="!validModel"
        :loading="isUpdate ? loadingUpdate : loadingCreate"
        class="normalLetterSpacing flex-fill"
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

import { useRules } from '~/composables/commons/useRules'

import type { useArticlesService } from '~/composables/services/useArticlesService'
import UploadDropzone from '~/components/commons/UploadDropzone.vue'

import { useAccountStore } from '~/store/account'

import { FirestoreArticle } from '~/types'

const props = defineProps({
  service: { type: Object as PropType<ReturnType<typeof useArticlesService>>, required: true },
  initialPayload: { type: Object as PropType<FirestoreArticle>, default: () => new FirestoreArticle() },
  isUpdate: Boolean,
})

const rules = useRules()

const router = useRouter()

const accountStore = useAccountStore()

const loadingCreate = ref(false)
const loadingUpdate = ref(false)

const payload = ref<FirestoreArticle>(props.initialPayload)
const selectedFile = ref<File>()
const validModel = ref()

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
