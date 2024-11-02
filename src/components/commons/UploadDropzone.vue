<template>
  <div
    v-ripple
    :style="{
      width,
      height,
      backgroundColor: currentFileUrl ? 'transparent' : 'rgb(var(--v-theme-primary), .2)',
      backgroundImage: currentFileUrl ? `url(${currentFileUrl})` : 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    }"
    :class="{
      'uploadDropzone d-flex align-center justify-center flex-column cursor-pointer': true,
      'text-white': !!selectedFile,
      isDragging,
    }"
    @click="handleSelectFile"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @dragend="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <v-icon size="x-large">
      mdi-upload
    </v-icon>

    <div class="my-2 text-body-2">
      Clique para enviar uma imagem
    </div>
  </div>
</template>

<script setup lang="ts">
import { selectFile, defaultAllowedImageExtensions } from '~/utils'

import { useSnackbarStore } from '~/store/snackbar'

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
  customFileUrl: { type: String, default: undefined },
})

const snackbarStore = useSnackbarStore()

const selectedFile = defineModel<File | undefined>()
const selectedFileUrl = ref<string>()

const isDragging = ref(false)

const currentFileUrl = computed(() => {
  if (selectedFileUrl.value) {
    return selectedFileUrl.value
  }

  if (props.customFileUrl) {
    return props.customFileUrl
  }

  return undefined
})

async function handleUpdateSelectedFile (file: File) {
  const fileExtension = `.${file.name.split('.').pop()}`

  if (defaultAllowedImageExtensions.split(', ').includes(fileExtension)) {
    selectedFile.value = file
    selectedFileUrl.value = await convertFileToBase64(file)
  } else {
    snackbarStore.showErrorSnackbar('Este formato de arquivo não é permitido')
  }
}

function handleSelectFile () {
  selectFile(handleUpdateSelectedFile)
}

async function handleDrop (event: DragEvent) {
  if (event.dataTransfer) {
    const filesArr = Array.from(event.dataTransfer.files)

    if (filesArr.length > 1) {
      snackbarStore.showErrorSnackbar('Apenas 1 arquivo permitido')
    } else {
      await handleUpdateSelectedFile(filesArr[0])
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadDropzone {
  border: 2px dashed black;
  border-radius: 16px;

  background-color: rgb(var(--v-theme-primary), .2);

  &:hover, &.isDragging {
    filter: brightness(0.8);
  }
}
</style>
