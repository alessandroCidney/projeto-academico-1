<template>
  <div
    :style="{
      width,
      height,
      backgroundColor: selectedFileUrl ? 'transparent' : 'rgb(var(--v-theme-primary), .2)',
      backgroundImage: selectedFileUrl ? `url(${selectedFileUrl})` : 'none',
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
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
})

const selectedFile = defineModel<File | undefined>()
const selectedFileUrl = ref<string>()

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
