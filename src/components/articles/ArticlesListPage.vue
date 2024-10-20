<template>
  <div
    v-if="loadingItems"
    class="fill-width fill-height d-flex align-center justify-center"
  >
    <v-progress-circular
      size="150"
      width="8"
      color="primary"
      indeterminate
    />
  </div>

  <div
    v-else
    class="pageContainer"
  >
    <h1 class="text-h5 font-weight-bold">
      {{ title }}
    </h1>

    <v-fab
      :to="`${$route.path}/create`"
      class="newItemFab"
      color="primary"
      size="large"
      icon
    >
      <v-icon
        color="white"
        size="large"
      >
        mdi-plus
      </v-icon>
    </v-fab>

    <div>
      <template
        v-for="item in items"
        :key="item._id"
      >
        <slot
          :item="item"
          name="item"
        >
          <v-card
            height="330px"
            class="mb-7"
            @click="navigateTo({ path: `${$route.path}/${item._id}` })"
          >
            <v-img
              :src="item.imageUrl"
              height="200px"
              width="100%"
              cover
            />

            <div class="py-4">
              <v-card-subtitle>
                {{ item.tags.join(', ') }}
              </v-card-subtitle>

              <v-card-title>
                {{ item.title }}
              </v-card-title>

              <v-card-text class="pb-0">
                {{ item.description }}
              </v-card-text>
            </div>
          </v-card>
        </slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { useArticlesService } from '~/composables/services/useArticlesService'

const props = defineProps({
  service: { type: Object as PropType<ReturnType<typeof useArticlesService>>, required: true },
  title: { type: String, required: true },
})

const loadingItems = ref(false)

const items = ref<Awaited<ReturnType<typeof props.service.list>>>([])

onMounted(() => {
  handleList()
})

async function handleList () {
  try {
    loadingItems.value = true

    items.value = await props.service.list()
  } catch (err) {
    console.error(err)
  } finally {
    loadingItems.value = false
  }
}
</script>
