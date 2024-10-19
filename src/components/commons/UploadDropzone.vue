<template>
  <div
    :style="{
      width,
      height,
      backgroundColor: currentFileUrl ? 'transparent' : 'rgb(var(--v-theme-primary), .2)',
      backgroundImage: currentFileUrl ? `url(${currentFileUrl})` : 'none',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    }"
    class="uploadDropzone d-flex align-center justify-center cursor-pointer"
    @click="handleSelectFile"
  >
    <v-icon size="x-large">
      mdi-upload
    </v-icon>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
  customFileUrl: { type: String, default: undefined },
})

const selectedFile = defineModel<File | undefined>()
const selectedFileUrl = ref<string>()

const currentFileUrl = computed(() => {
  if (selectedFileUrl.value) {
    return selectedFileUrl.value
  }

  if (props.customFileUrl) {
    return props.customFileUrl
  }

  return undefined
})

function handleSelectFile () {
  selectFile(async (file) => {
    selectedFile.value = file
    selectedFileUrl.value = await convertFileToBase64(file)
  })
}
</script>

<style lang="scss" scoped>
.uploadDropzone {
  border: 2px dashed black;
  border-radius: 16px;

  background-color: rgb(var(--v-theme-primary), .2)
}
</style>
