<template>
  <div
    class="pageContainer newsCreationPage"
  >
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="d-flex align-center justify-start fillWidth">
        <v-btn
          icon="mdi-chevron-left"
          variant="tonal"
          class="mr-5"
          @click="$router.push('/news')"
        />

        <v-text-field
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
        placeholder="Informe uma descrição"
        class="fieldWithoutPadding"
        variant="solo"
        hide-details
        flat
      />
    </div>

    <div class="mb-5">
      <upload-dropzone
        height="100px"
      />
    </div>

    <div class="mb-5 px-2">
      <v-textarea
        placeholder="Informe o conteúdo"
        class="fieldWithoutPadding"
        variant="solo"
        hide-details
        flat
      />
    </div>

    <div class="mb-5 px-2">
      <v-select
        :items="['Teste']"
        label="Selecionar Tags"
        variant="outlined"
      />
    </div>

    <div class="d-flex align-center justify-center">
      <v-btn
        :style="{ width: 'calc(50% - 8px) !important' }"
        class="normalLetterSpacing mr-2"
        color="grey-lighten-4"
        variant="flat"
        size="large"
      >
        Cancelar
      </v-btn>

      <v-btn
        :style="{ width: '50% !important' }"
        class="normalLetterSpacing text-white"
        color="primary"
        variant="flat"
        size="large"
      >
        Salvar
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadDropzone from '@/components/commons/UploadDropzone.vue'
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
