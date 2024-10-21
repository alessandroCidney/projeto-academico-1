<template>
  <v-list-item>
    <template #title>
      {{ item.title }}
    </template>

    <template #subtitle>
      {{ item.value }}
    </template>

    <template #append>
      <v-btn
        v-if="item.allowEdition"
        :loading="loadingEdit"
        icon="mdi-pencil"
        variant="text"
        @click="showEditForm = !showEditForm"
      />
    </template>
  </v-list-item>

  <v-text-field
    v-if="showEditForm"
    v-model="newValueStr"
    :placeholder="`Novo ${item.title.toLowerCase()}`"
    class="mt-3"
  >
    <template #append>
      <v-btn
        variant="flat"
        color="error"
        class="mr-2"
        icon="mdi-close"
        size="small"
        @click="reset"
      />

      <v-btn
        variant="flat"
        color="success"
        icon="mdi-check"
        size="small"
        @click="handleSave"
      />
    </template>
  </v-text-field>

  <v-divider class="my-3" />
</template>

<script setup lang="ts">
interface PersonalDataItem {
  title: string
  value?: string
  allowEdition: boolean
  update?: (newValue: string) => Promise<void>
}

const props = defineProps({
  item: { type: Object as PropType<PersonalDataItem>, required: true },
})

const showEditForm = ref(false)
const newValueStr = ref('')

const loadingEdit = ref(false)

async function handleSave () {
  loadingEdit.value = true
  showEditForm.value = false

  await props.item.update?.(newValueStr.value)

  newValueStr.value = ''
  loadingEdit.value = false
}

function reset () {
  newValueStr.value = ''
  showEditForm.value = false
}
</script>
