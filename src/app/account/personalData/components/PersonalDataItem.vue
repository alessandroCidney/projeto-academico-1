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

  <v-form
    v-if="showEditForm"
    v-model="validModel"
    @submit.prevent="handleSave"
  >
    <v-combobox
      v-if="item.options"
      v-model="newValueStr"
      :items="item.options"
      :rules="[rules.required, rules.maxLength(200)]"
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
          :disabled="!validModel"
          type="submit"
          variant="flat"
          color="success"
          icon="mdi-check"
          size="small"
        />
      </template>
    </v-combobox>

    <v-text-field
      v-else
      v-model="newValueStr"
      :rules="[rules.required, rules.maxLength(200)]"
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
          :disabled="!validModel"
          type="submit"
          variant="flat"
          color="success"
          icon="mdi-check"
          size="small"
        />
      </template>
    </v-text-field>
  </v-form>

  <v-divider class="my-3" />
</template>

<script setup lang="ts">
import { useRules } from '~/composables/commons/useRules'

interface PersonalDataItem {
  title: string
  value?: string
  allowEdition: boolean
  update?: (newValue: string) => Promise<void>
  options?: string[]
}

const props = defineProps({
  item: { type: Object as PropType<PersonalDataItem>, required: true },
})

const rules = useRules()

const showEditForm = ref(false)

const emptyValue = computed(() => props.item.options ? null : '')
const newValueStr = ref(emptyValue.value)

const loadingEdit = ref(false)

const validModel = ref(false)

async function handleSave () {
  loadingEdit.value = true
  showEditForm.value = false

  await props.item.update?.(newValueStr.value as string)

  newValueStr.value = emptyValue.value
  loadingEdit.value = false
}

function reset () {
  newValueStr.value = emptyValue.value
  showEditForm.value = false
}
</script>
