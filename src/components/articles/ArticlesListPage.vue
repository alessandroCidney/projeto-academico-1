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
    <h1>
      {{ title }}
    </h1>

    <v-fab
      :to="`${$route.path}/create`"
      :class="{
        newItemFab: true,
        mobile,
      }"
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
      <template v-if="allowedItems.length === 0">
        <warning-screen
          title="Sem postagens criadas"
          description="Clique no botão abaixo para cadastrar uma nova postagem"
        >
          <template #append>
            <v-btn
              :to="`${$route.path}/create`"
              class="normalLetterSpacing text-white"
              prepend-icon="mdi-plus"
              color="primary"
              size="large"
            >
              Criar nova postagem
            </v-btn>
          </template>
        </warning-screen>
      </template>

      <template v-else>
        <template
          v-for="item in allowedItems"
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
              <image-with-loader
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

                <v-card-text class="pb-0 articleCardDescription">
                  {{ item.description }}
                </v-card-text>
              </div>
            </v-card>
          </slot>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

import { useUsersService } from '~/composables/services/useUsersService'
import type { useArticlesService } from '~/composables/services/useArticlesService'

import { useAccountStore } from '~/store/account'

import ImageWithLoader from '~/components/commons/ImageWithLoader.vue'
import WarningScreen from '~/components/commons/WarningScreen.vue'

const { mobile } = useDisplay()

const props = defineProps({
  service: { type: Object as PropType<ReturnType<typeof useArticlesService>>, required: true },
  title: { type: String, required: true },
})

const accountStore = useAccountStore()

const usersService = useUsersService()

const loadingItems = ref(false)

const items = ref<Awaited<ReturnType<typeof props.service.list>>>([])

const allowedItems = computed(
  () => items.value.filter(
    itemData => accountStore.cachedUsers[itemData.authorId]?.manuallyVerified
      || accountStore.authUserData?.uid === itemData.authorId,
  ),
)

onMounted(() => {
  handleList()
})

async function handleList () {
  try {
    loadingItems.value = true

    items.value = await props.service.list()

    for (const itemData of items.value) {
      await usersService.getUserAndSaveToStoreCache(itemData.authorId)
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingItems.value = false
  }
}
</script>

<style lang="scss">
.articleCardDescription {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
